import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma/prismaClient.js";


import { ethers } from "ethers";
// import contractArtifact from './artifacts/contracts/Transactions.sol/Transactions.json' assert { type: "json" };

import fs from 'fs';
import path from 'path';

const contractPath = path.resolve('artifacts/contracts/Transactions.sol/Transactions.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));

console.log("contract artifact:--->", contractArtifact); // You can now use contractArtifact as you normally would.

export const initiatePayment = async (req, res) => {
  try {
    console.log("doing transaction for:", req.transaction);

    const {
      id,
      fromUserId,
      toUserId,
      amount,
      projectId,
      milestoneId,
      type,
      currency,
    } = req.transaction;

    // Validate inputs (in real app)
    if (!fromUserId || !toUserId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = `order_${uuidv4()}`;

    // Create order on Cashfree
    const cashfreeRes = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: fromUserId,
          customer_email: "buyer@example.com", // Optional: fetch from DB
          customer_phone: "9999999999",
        },
        order_meta: {
          return_url: `http://localhost:5173/projects/${projectId}`, // frontend url
          notify_url: `https://0fd1-2402-3a80-4642-b344-ccfe-c567-93e3-cdbf.ngrok-free.app/api/payment/webhook`,
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
    // const rawSessionId = cashfreeRes.data.payment_session_id;
    // const sessionId = rawSessionId.replace(/paymentpayment$/, "");

    // const [updatedProject, transaction] = await prisma.$transaction([
    //   prisma.project.update({
    //     where: { id: req.transaction.projectId },
    //     data: {
    //       assignedTo: req.transaction.toUserId,
    //       status: "IN_PROGRESS", // make sure enum is valid
    //     },
    //   }),
    //   prisma.transaction.update({
    //     where: { id: id },
    //     data: {
    //       // fromUserId,
    //       fromUser:{
    //         connect:{
    //           id:fromUserId
    //         }
    //       },
    //       // toUserId,
    //       toUser:{
    //         connect:{
    //           id:toUserId
    //         }
    //       },
    //       amount: parseFloat(amount),
    //       status: "SUCCESS",
    //       // gateway: "CASHFREE",
    //       currency,
    //       // projectId,
    //       project:{
    //         connect:{
    //           id:projectId
    //         }
    //       },
    //       type,
    //     },
    //   }),
    // ]);

    console.log("Cashfree Response:", cashfreeRes.data);
    console.log("Cashfree Session ID:", sessionId);
    console.log("Cashfree Order ID:", orderId);

    return res.json({
      success: true,
      payment_session_id: sessionId,
      order_id: orderId,
    });
    // return res.redirect(`https://sandbox.cashfree.com/pg/viewPayment?payment_session_id=${sessionId}`);
  } catch (err) {
    console.error("Cashfree Error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to initiate payment" });
  }
};

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your actual Hardhat private key (you get it from `npx hardhat node`)
const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

// Replace with your deployed smart contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);

export const handleCashfreeWebhook = async (req, res) => {
  try {
    const { data, type } = req.body;

    console.log("------->Webhook received:", req.body);

    if (type !== "PAYMENT_SUCCESS_WEBHOOK") {
      return res.status(400).send("Unsupported webhook type");
    }

    const { order_id } = data.order;

    const transaction = await prisma.transaction.findFirst({
      where: { orderId: order_id },
    });

    if (!transaction) return res.status(404).send("Transaction not found");

    // Prisma DB update
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          paymentGatewayId: data.payment.cf_payment_id,
          currency: data.payment.payment_currency,
          paymentTime: new Date(data.payment.payment_time),
        },
      }),
      prisma.project.update({
        where: { id: transaction.projectId },
        data: {
          assignedTo: transaction.toUserId,
          status: "IN_PROGRESS",
        },
      }),
    ]);

    // Blockchain update
    console.log("Updating blockchain...");
    const tx = await contract.addToBlockchain(
      transaction.toWalletAddress, // receiver wallet address
      ethers.parseEther(data.payment.payment_amount.toString()), // amount in ETH format
      `Payment for order ${order_id}`, // message
      "freelance" // keyword
    );

    // Wait for transaction to be mined
    console.log("Waiting for blockchain transaction to be mined...");
    const receipt = await tx.wait(); // Wait until the transaction is mined

    // Log the transaction receipt details
    console.log("Blockchain transaction mined:", receipt);

    res.status(200).send("Webhook received and blockchain updated");
  } catch (err) {
    console.error("[Cashfree Webhook Error]", err.message);
    res.status(500).send("Internal server error");
  }
};