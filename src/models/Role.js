// src/models/Role.js
import mongoose from "mongoose";
import auditPlugin from "../plugins/audit.plugin.js";

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
    permissions: [{ type: String }],
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

RoleSchema.plugin(auditPlugin);

// Actualizar updatedAt antes de guardar
RoleSchema.pre("save", function () {
    this.updatedAt = Date.now();
});

export default mongoose.model("Role", RoleSchema);
