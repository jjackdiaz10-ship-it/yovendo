import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    configuration: { type: Object },
    active: { type: Boolean, default: true },
    businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }]
}, { timestamps: true });

export default mongoose.model("Channel", ChannelSchema);
