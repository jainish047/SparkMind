import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma/prismaClient.js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Load and parse the contract artifact for blockchain interactions.
const contractPath = path.resolve("artifacts/contracts/Transactions.sol/Transactions.json");
const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf-8"));
console.log("contract artifact:--->", contractArtifact);

// Payment initiation endpoint: generates an order id and creates a transaction record.
export const initiatePayment = async (req, res) => {
  try {
    console.log("doing transaction for:", req.transaction);
    const { id, fromUserId, toUserId, amount, projectId, milestoneId, type, currency } = req.transaction;

    // Validate required fields
    if (!fromUserId || !toUserId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate a unique order id that will be used as the transaction primary key.
    const orderId = `order_${uuidv4()}`;

    // Create order on Cashfree.
    const cashfreeRes = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: fromUserId,
          customer_email: "buyer@example.com", // You can fetch this from your DB.
          customer_phone: "9999999999",
        },
        order_meta: {
          return_url: `http://localhost:5173/projects/${projectId}`, // Frontend URL.
          // Replace YOUR_NGROK_URL with your actual ngrok URL.
          notify_url: `https://7425-2409-4080-959f-c4d5-910c-6460-a271-1bfa.ngrok-free.app/api/payment/webhook`,
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    const sessionId = cashfreeRes.data.payment_session_id;
    console.log("Cashfree Response:", cashfreeRes.data);
    console.log("Cashfree Session ID:", sessionId);
    console.log("Cashfree Order ID:", orderId);

    // Insert a new transaction in the database with the generated order id.
    await prisma.transaction.create({
      data: {
        id: orderId, // Transaction primary key
        fromUserId,
        toUserId,
        projectId: projectId || null,
        amount: parseFloat(amount),
        status: "PENDING",
        currency,
        type,
        // You can add additional fields here such as milestoneId or wallet address if available.
      },
    });

    return res.json({
      success: true,
      payment_session_id: sessionId,
      order_id: orderId,
    });
  } catch (err) {
    console.error("Cashfree Error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Failed to initiate payment" });
  }
};

// Set up the blockchain provider, signer, and contract instance.
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);

// Cashfree Webhook handler: updates the transaction & project, then makes a blockchain call.
export const handleCashfreeWebhook = async (req, res) => {
  try {
    const { data, type } = req.body;
    console.log("------->Webhook received:", req.body);

    if (type !== "PAYMENT_SUCCESS_WEBHOOK") {
      return res.status(400).send("Unsupported webhook type");
    }

    const { order_id } = data.order;

    // Find the transaction using the primary key (id)
    const transaction = await prisma.transaction.findFirst({
      where: { id: order_id },
    });

    console.log("transaction:", transaction);

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    // Prepare a list of DB operations.
    // First, update the transaction status and add payment details.
    const operations = [
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          paymentGatewayId: data.payment.cf_payment_id,
          currency: data.payment.payment_currency,
          paymentTime: new Date(data.payment.payment_time),
        },
      }),
    ];

    // Update the associated project only if a projectId exists.
    if (transaction.projectId) {
      operations.push(
        prisma.project.update({
          where: { id: transaction.projectId },
          data: {
            assignedTo: transaction.toUserId,
            status: "IN_PROGRESS",
          },
        })
      );
    }

    // Execute all DB operations as a single atomic transaction.
    await prisma.$transaction(operations);

    // Update the blockchain.
    console.log("Updating blockchain...");
    const tx = await contract.addToBlockchain(
      transaction.toWalletAddress, // Make sure transaction has the receiver's wallet address.
      ethers.parseEther(data.payment.payment_amount.toString()),
      `Payment for order ${order_id}`,
      "freelance"
    );

    console.log("Waiting for blockchain transaction to be mined...");
    const receipt = await tx.wait();
    console.log("Blockchain transaction mined:", receipt);

    return res.status(200).send("Webhook received and blockchain updated");
  } catch (err) {
    console.error("[Cashfree Webhook Error]", err.message);
    return res.status(500).send("Internal server error");
  }
};
