// src/services/aiService.js
import { askGroq } from "./askGroq.js";
import { flowEngine } from "../ai/flowEngine.js";
import { loadSession, saveSession } from "../storage/sessions/sessionStorage.js";

export async function generateAIResponse(phone, message) {
    // 1. Cargar sesión
    const session = loadSession(phone);

    // 2. Guardar mensaje del usuario en historial
    session.history.push({
        role: "user",
        content: message
    });

    // 3. Procesar flujo conversacional (flowEngine siempre decide el estado)
    const flowReply = flowEngine(session, message);

    // 4. Mejorar el texto usando tu LLM (opcional pero recomendado)
    let improvedReply = flowReply;
    try {
        improvedReply = await askGroq(`
Mejora este texto para WhatsApp manteniendo la intención, tono vendedor amable
y sin inventar datos ni productos nuevos:
"${flowReply}"
        `);

        // En caso de que Groq responda vacío o raro:
        if (!improvedReply || improvedReply.length < 2) {
            improvedReply = flowReply;
        }
    } catch (err) {
        console.error("Error mejorando respuesta con Groq:", err);
        improvedReply = flowReply;
    }

    // 5. Guardar respuesta final en el historial
    session.history.push({
        role: "assistant",
        content: improvedReply
    });

    // 6. Guardar sesión
    saveSession(phone, session);

    // 7. Respuesta final que se envía al usuario
    return improvedReply;
}
