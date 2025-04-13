import express from "express";
import { handleCashfreeWebhook, initiatePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);

router.post("/webhook", handleCashfreeWebhook)

export default router;
