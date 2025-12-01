import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ["promotion", "abandoned_cart", "new_product"] },
    configuration: Object,
    active: { type: Boolean, default: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

export default mongoose.model("Campaign", CampaignSchema);
