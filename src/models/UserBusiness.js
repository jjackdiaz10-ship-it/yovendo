import mongoose from "mongoose";

const UserBusinessSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
}, { timestamps: true });

export default mongoose.model("UserBusiness", UserBusinessSchema);
