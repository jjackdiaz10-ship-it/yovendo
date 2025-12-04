// src/routes/whatsapp.routes.js
import express from "express";
import { verifyWebhook, receiveMessage, sendMessage } from "../controllers/whatsappWebhook.controller.js";

const router = express.Router();

router.post("/webhook/:code-:businessId", receiveMessage);
router.get("/webhook/:code-:businessId", verifyWebhook);
router.post("/send", sendMessage);

export default router;
