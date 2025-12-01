// src/routes/whatsapp.routes.js
import express from "express";
import { verifyWebhook, receiveMessage, sendMessage } from "../controllers/whatsappWebhook.controller.js";

const router = express.Router();

router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveMessage);
router.post("/send", sendMessage);

export default router;
