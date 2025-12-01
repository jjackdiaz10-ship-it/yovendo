import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
    website: String,
}, { timestamps: true });

export default mongoose.model("Business", BusinessSchema);
