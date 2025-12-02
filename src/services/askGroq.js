import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function askGroq(prompt) {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "Eres un asistente de ventas amable y directo." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("❌ Error Groq:", error);
        return "Lo siento, estoy teniendo problemas técnicos.";
    }
}
