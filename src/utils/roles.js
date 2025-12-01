// utils/roles.js

/**
 * Verifica si un Role tiene un permiso.
 * @param {Object} role - Documento Role (poblado).
 * @param {String} permission - Ej: "panel.access"
 */
export function roleHasPermission(role, permission) {
    if (!role || !Array.isArray(role.permissions)) return false;
    return role.permissions.includes(permission);
}

/**
 * Verifica si un usuario tiene un permiso (considera sus roles).
 * - Carga roles automáticamente si no están poblados.
 * @param {Object} user - Documento User (sin importar si está poblado).
 * @param {String} permission - Ej: "users.manage"
 * @returns Boolean
 */
export async function userHasPermission(user, permission) {
    if (!user) return false;

    // Si los roles NO vienen poblados → poblamos
    let roles = user.roles;

    if (!roles || !roles[0] || !roles[0].permissions) {
        // populate automático
        const populatedUser = await user.populate("roles");
        roles = populatedUser.roles;
    }

    // Si sigue sin roles, no hay permiso
    if (!roles || roles.length === 0) return false;

    // Revisamos cada role
    return roles.some(role => roleHasPermission(role, permission));
}
