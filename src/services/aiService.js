// services/aiService.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Llama a la LLM y espera un JSON estructurado.
 * Devuelve objeto seguro con keys: intent, entities, reply_text, actions
 */
export async function callAI({ text, context }) {
    const systemPrompt = `
Eres un asistente de ventas para e-commerce en español.
Devuelve SOLO un JSON válido sin texto adicional. Formato:
{
  "intent": "buy_product"|"greet"|...,
  "entities": { ... },
  "reply_text": "Texto para enviar al cliente (español).",
  "actions": [ { "type": "SUGGEST_PRODUCTS", ... } ]
}
Contexto: ${JSON.stringify(context).slice(0, 1000)}
Usuario: "${text}"
Asegúrate de que el JSON sea parseable estrictamente.
`;

    try {
        const resp = await client.chat.completions.create({
            model: "gpt-4o-mini", // ajusta al modelo que uses
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            max_tokens: 600,
            temperature: 0.1
        });

        const content = resp.choices?.[0]?.message?.content || "";
        // Forzar a extraer JSON: encuentra primer '{' y último '}'.
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");
        if (start === -1 || end === -1) {
            throw new Error("AI no devolvió JSON.");
        }
        const jsonText = content.slice(start, end + 1);
        const parsed = JSON.parse(jsonText);
        // normalize
        return {
            intent: parsed.intent || null,
            entities: parsed.entities || {},
            reply_text: parsed.reply_text || "Perdona, no entendí. ¿Puedes repetir?",
            actions: Array.isArray(parsed.actions) ? parsed.actions : []
        };
    } catch (err) {
        console.error("[aiService] error parsing AI response:", err);
        return {
            intent: null,
            entities: {},
            reply_text: "Perdona, tuve un problema entendiendo tu mensaje. Intenta simplificarlo.",
            actions: []
        };
    }
}
