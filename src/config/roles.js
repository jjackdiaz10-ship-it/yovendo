// src/config/roles.js
import RoleModel from "../models/Role.js";

/**
 * ROLES globales (legacy)
 * Si quieres definir roles globales aquí manténlos, pero preferimos roles por Company.
 */
export const GLOBAL_ROLES = {
    superadmin: ["*"]
};

/**
 * roleHasPermission:
 * - roleArg puede ser:
 *    - string role name (ej: "superadmin" or "admin")
 *    - un documento Role poblado { name, permissions, ... }
 */
export async function roleHasPermission(roleArg, permission) {
    if (!roleArg) return false;

    // string role (legacy/global)
    if (typeof roleArg === "string") {
        const perms = GLOBAL_ROLES[roleArg];
        if (perms) {
            return perms.includes("*") || perms.includes(permission);
        }
        // no encontrado a nivel global -> false
        return false;
    }

    // si es un objeto y tiene permissions
    if (typeof roleArg === "object") {
        if (Array.isArray(roleArg.permissions)) {
            const perms = roleArg.permissions;
            if (perms.includes("*")) return true;
            return perms.includes(permission);
        }
    }

    // si es un ObjectId (no poblado) -> intentar cargarlo
    try {
        const maybeId = roleArg;
        if (typeof maybeId === "object" && maybeId.toString) {
            // intentar cargar role doc
            const r = await RoleModel.findById(maybeId).lean();
            if (!r) return false;
            return roleHasPermission(r, permission);
        }
    } catch (e) {
        return false;
    }

    return false;
}

/**
 * Helper para evaluar si alguno de los roles de usuario tiene el permiso.
 * rolesArray puede contener strings, ObjectIds o Role docs.
 */
export async function anyRoleHasPermission(rolesArray = [], permission) {
    for (const r of rolesArray) {
        const ok = await roleHasPermission(r, permission);
        if (ok) return true;
    }
    return false;
}
