import Bot from "../models/Bot.js";
import BotInteraction from "../models/BotInteraction.js";

export async function processMessage(botId, message, userId) {
    const bot = await Bot.findById(botId);

    if (!bot || !bot.active) return null;

    // Ejemplo simple: búsqueda de keyword en FAQ
    let response = null;
    if (bot.type === "faq") {
        const { faqs } = bot.configuration;
        response = faqs.find(f => message.includes(f.keyword))?.answer || "No entiendo tu pregunta";
    }

    // Guardar interacción
    await BotInteraction.create({
        bot: bot._id,
        user: userId,
        message,
        response
    });

    return response;
}
