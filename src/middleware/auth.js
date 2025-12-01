// src/middleware/auth.js
import User from "../models/User.js";
import { anyRoleHasPermission } from "../config/roles.js";

/**
 * ensureAuth: valida que haya sesión y carga el usuario con roles y company poblados
 */
export async function ensureAuth(req, res, next) {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/auth/login");
        }

        const userSession = req.session.user;

        // Buscar el usuario completo en DB
        const user = await User.findById(userSession.id).populate("company").exec();
        if (!user || !user.active) {
            req.session.destroy?.();
            return res.redirect("/auth/login");
        }

        // Poblar roles si es necesario (asumiendo getRolesPopulated devuelve docs + strings)
        const populatedRoles = await user.getRolesPopulated?.() || [];

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            company: user.company,
            roleStrings: populatedRoles.filter(r => typeof r === "string"),
            roles: populatedRoles.filter(r => typeof r !== "string"),
        };

        // Guardar modelo completo por compatibilidad
        req.userModel = user;

        return next();
    } catch (err) {
        console.error("ensureAuth error:", err);
        return res.redirect("/auth/login");
    }
}

/**
 * requirePermission('conversations:reply')
 */
export function requirePermission(permission) {
    return async (req, res, next) => {
        try {
            if (!req.user) return res.status(401).send("No autenticado");

            const { roles = [], roleStrings = [] } = req.user;
            const combined = [...roles, ...roleStrings];

            const ok = await anyRoleHasPermission(combined, permission);
            if (!ok) return res.status(403).send("No tienes permiso");

            return next();
        } catch (err) {
            console.error("requirePermission error:", err);
            return res.status(500).send("Error en autorización");
        }
    };
}

/**
 * ensureSameCompany: valida que el recurso pertenezca a la misma empresa del usuario
 */
export function ensureSameCompany(companyIdParam = "companyId") {
    return (req, res, next) => {
        const cid = req.params[companyIdParam] || req.body[companyIdParam] || req.query[companyIdParam];
        if (!cid || !req.user) return next();
        if (String(req.user.company._id) !== String(cid)) {
            return res.status(403).send("Acceso denegado: empresa distinta");
        }
        next();
    };
}

/**
 * requireAuth: simple middleware que valida sesión
 */
export const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect("/auth/login");
    next();
};
