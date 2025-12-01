import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true }
}, { timestamps: false });

export default mongoose.model("OrderItem", OrderItemSchema);
