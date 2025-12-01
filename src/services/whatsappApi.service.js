import axios from "axios";
import Channel from "../models/Channel.js";

export async function sendWhatsAppText(to, text) {
    try {
        // Buscar canal activo de tipo WhatsApp
        const channel = await Channel.findOne({ type: "whatsapp", active: true });
        if (!channel) throw new Error("No hay un canal de WhatsApp activo en la BD");

        const { phone_number_id, access_token } = channel.configuration;

        const url = `https://graph.facebook.com/v22.0/${phone_number_id}/messages`;

        const payload = {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: text }
        };

        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        };

        const { data } = await axios.post(url, payload, { headers });
        return data;

    } catch (error) {
        console.error("❌ Error enviando WhatsApp:", error.response?.data || error.message);
        throw error;
    }
}
