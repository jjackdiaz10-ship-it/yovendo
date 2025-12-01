import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    metadata: Object,
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    originChannel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

export default mongoose.model("Customer", CustomerSchema);
