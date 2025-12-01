import mongoose from "mongoose";

const BusinessBotSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    bot: { type: mongoose.Schema.Types.ObjectId, ref: "Bot", required: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } // optional
}, { timestamps: true });

export default mongoose.model("BusinessBot", BusinessBotSchema);
