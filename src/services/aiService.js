// src/services/aiService.js
import { askGroq } from "./askGroq.js";
import { flowEngine } from "../ai/flowEngine.js";
import { loadSession, saveSession } from "../storage/sessions/sessionStorage.js";

export async function generateAIResponse(phone, message) {
    const session = loadSession(phone);

    // historial
    session.history.push({ role: "user", content: message });

    // Ejecutar flujo (ANTES FALTABA EL await)
    const flowReply = await flowEngine(session, message);

    // Si flowEngine devolvió algo vacío o raro → fallback
    if (!flowReply || typeof flowReply !== "string") {
        saveSession(phone, session);
        return "Hubo un pequeño error procesando tu mensaje, ¿podrías repetirlo? 🙏";
    }

    // Mejorar estilo, pero sin modificar lógica
    let improvedReply = flowReply;

    try {
        const aiResult = await askGroq(`
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
        `);

        if (aiResult && typeof aiResult === "string" && aiResult.trim().length > 1) {
            improvedReply = aiResult.trim();
        }
    } catch {
        improvedReply = flowReply;
    }

    // guardar sesión
    session.history.push({ role: "assistant", content: improvedReply });
    saveSession(phone, session);

    return improvedReply;
}
