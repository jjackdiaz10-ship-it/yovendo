import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    providerConversationId: String,
    contact: {
        phone: String,
        name: String
    },
    status: { type: String, enum: ["pending", "in_progress", "closed"], default: "pending" },
    type: { type: String, enum: ["bot", "human"], default: "bot" },
    context: { type: Object, default: {} },
    metadata: Object
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);
