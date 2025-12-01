import mongoose from "mongoose";

const BusinessChannelSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true }
}, { timestamps: true });

export default mongoose.model("BusinessChannel", BusinessChannelSchema);
