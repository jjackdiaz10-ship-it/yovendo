// src/plugins/audit.plugin.js
export default function auditPlugin(schema /*, options */) {
    // Asegurar campos (no duplicar si ya existen)
    if (!schema.path("createdBy")) {
        schema.add({ createdBy: { type: schema.constructor.Types.ObjectId, ref: "User" } });
    }
    if (!schema.path("updatedBy")) {
        schema.add({ updatedBy: { type: schema.constructor.Types.ObjectId, ref: "User" } });
    }

    // método para que la app establezca contexto de auditoría antes de save
    schema.methods.setAuditContext = function (ctx = {}) {
        // ctx: { userId }
        this._auditContext = ctx;
    };

    // Pre save: inyectar createdBy/updatedBy si _auditContext existe
    schema.pre("save", function () {
        try {
            const ctx = this._auditContext || {};
            const uid = ctx.userId;

            if (uid) {
                if (this.isNew && !this.createdBy) {
                    this.createdBy = uid;
                }
                this.updatedBy = uid;
            }
        } catch (e) {
            // no bloquear guardado por plugin
            console.warn("audit.plugin error:", e);
        }
    });
}
