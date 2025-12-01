// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
    {
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ],
        active: { type: Boolean, default: true },

        // audit fields (rellenados por audit.plugin o manualmente)
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

// Hash password antes de guardar
UserSchema.pre("save", async function () {
    // hash solo si cambió el password
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});


// comparar password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Helper: get populated Role documents (if roles are ObjectIds).
 * Si ya están poblados, los devuelve tal cual.
 * Retorna array combinado (strings y docs).
 */
UserSchema.methods.getRolesPopulated = async function () {
    // Si no hay roles → []
    if (!this.roles || this.roles.length === 0) return [];

    const Role = (await import("./Role.js")).default;

    // Separar objectIds de strings
    const ids = [];
    const strings = [];
    for (const r of this.roles) {
        if (typeof r === "string") {
            // podría ser un role name legacy
            strings.push(r);
        } else if (r && typeof r === "object" && r._id) {
            // documento ya poblado
            strings.push(r);
        } else {
            // probable ObjectId
            ids.push(r);
        }
    }

    // Buscar por ids si existen
    let docs = [];
    if (ids.length) {
        docs = await Role.find({ _id: { $in: ids } }).lean();
    }

    // combinar: docs + strings (strings pueden ser names)
    return [...docs, ...strings];
};

export default mongoose.model("User", UserSchema);
