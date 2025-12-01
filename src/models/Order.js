import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    order_number: { type: String, unique: true },
    total: { type: Number, required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    items: [{ productId: String, name: String, qty: Number, price: Number }],
    total: Number,
    status: { type: String, enum: ["pending", "confirmed", "delivered", "cancelled"], default: "pending" },
    metadata: Object,
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    payment: { provider: String, paymentId: String, status: String, paymentUrl: String },
    originChannel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
