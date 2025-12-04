// src/services/aiService.js
import { askGroq } from "./askGroq.js";
import { flowEngine } from "../ai/flowEngine.js";
import { loadSession, saveSession } from "../storage/sessions/sessionStorage.js";

export async function generateAIResponse(phone, message) {
    const session = loadSession(phone);

    // historial
    session.history.push({ role: "user", content: message });

    // flujo principal
    const flowReply = flowEngine(session, message);

    // optimización por IA, pero controlada
    let improvedReply = flowReply;
    try {
        improvedReply = await askGroq(`
Pulir texto para WhatsApp. Reglas:
- Mantén la intención EXACTA del mensaje.
- No agregues ofertas, ventas adicionales ni recomendaciones nuevas.
- No cambies el flujo conversacional.
- Evita emojis excepto máximo 1 por mensaje.
- Manténlo corto, amable y directo.
- NO inventes productos, detalles ni precios.

Texto:
"${flowReply}"

Devuelve SOLO el texto pulido.
        `).catch(() => flowReply);

        if (!improvedReply || improvedReply.trim().length < 2) {
            improvedReply = flowReply;
        }
    } catch {
        improvedReply = flowReply;
    }

    // guardar en historial
    session.history.push({ role: "assistant", content: improvedReply });
    saveSession(phone, session);

    return improvedReply;
}
