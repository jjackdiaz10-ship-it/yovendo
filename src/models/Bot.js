import mongoose from "mongoose";

const BotSchema = new mongoose.Schema({
    name: String,
    configuration: Object,
    active: { type: Boolean, default: true },
    businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

export default mongoose.model("Bot", BotSchema);
