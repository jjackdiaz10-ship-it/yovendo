// src/controllers/whatsappWebhook.controller.js

import { sendWhatsAppText } from "../services/whatsappApi.service.js";
import { generateAIResponse } from "../services/aiService.js";
import Message from "../models/Message.js";

/* ============================================================
   VERIFICAR WEBHOOK (GET)
   ============================================================ */
export function verifyWebhook(req, res) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403); // Solo devuelve 403 si el token no coincide
}

/* ============================================================
   RECIBIR MENSAJES DESDE META (POST)
   ============================================================ */
export async function receiveMessage(req, res) {
    try {

        const { code, businessId } = req.params;
        console.log("Webhook recibido para business:", businessId, "con código:", code);

        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const messages = changes?.value?.messages;

        if (!messages) return res.sendStatus(200);

        const msg = messages[0];

        const from = msg.from;        // número cliente
        const text = msg.text?.body;  // mensaje entrante
        const msgId = msg.id;

        console.log("📩 Mensaje recibido:", from, text);
        const aiReply = await generateAIResponse(from, text);
        console.log("🤖 IA respondió:", aiReply);

        // Guardar mensaje entrante
        await Message.create({
            from,
            text,
            providerMessageId: msgId,
            direction: "in"
        });

        await sendWhatsAppText(from, aiReply);

        return res.sendStatus(200);

    } catch (error) {
        console.error("❌ Error webhook:", error);
        return res.sendStatus(500);
    }
}


/* ============================================================
   ENDPOINT PARA ENVIAR MENSAJES MANUALMENTE (POST /send)
   ============================================================ */
export async function sendMessage(req, res) {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({
                error: "Faltan parámetros 'to' y 'message'"
            });
        }

        const response = await sendWhatsAppText(to, message);

        // Guardar mensaje saliente
        await Message.create({
            from: to,
            text: message,
            providerMessageId: response.messages?.[0]?.id,
            direction: "out"
        });

        return res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("❌ Error enviando mensaje:", error.response?.data || error);
        return res.status(500).json({ error: "Error al enviar mensaje" });
    }
}
