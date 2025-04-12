// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

import prisma from "../prisma/prismaClient.js";

// Create or Update Bank Account
export const upsertBankAccount = async (req, res) => {
  const userId = req.user.id;
  const { accountNo, ifsc, bankName, upiId } = req.body;

  try {
    const bankAccount = await prisma.bankAccount.upsert({
      where: { userId },
      update: {
        accountNumber: accountNo,
        ifsc,
        accountHolderName: bankName,
        upiId,
      },
      create: {
        userId,
        accountNumber: accountNo,
        ifsc,
        accountHolderName: bankName,
        upiId,
      },
    });
    res.status(200).json(bankAccount);
  } catch (err) {
    console.error("Bank account upsert error", err);
    res.status(500).json({ error: "Failed to save bank account details" });
  }
};

// Get bank account details
export const getBankAccount = async (req, res) => {
  const { userId } = req.params;
  try {
    const details = await prisma.bankAccount.findUnique({
      where: { userId },
    });

    if (!details) return res.status(404).json({ error: "Not found" });

    res.json(details);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bank account details" });
  }
};
