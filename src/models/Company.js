// src/models/Company.js
import mongoose from "mongoose";
import auditPlugin from "../plugins/audit.plugin.js";

const CompanySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        industry: { type: String, default: "" },
        logo: { type: String },

        // auditoría
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
