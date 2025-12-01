import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: String,
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    originChannel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
