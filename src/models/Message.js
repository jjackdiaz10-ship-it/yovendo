import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    from: String,
    providerMessageId: String,
    text: String,
    direction: { type: String, enum: ["in", "out"] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
