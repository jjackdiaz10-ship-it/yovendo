/**

src/controllers/auth.controller.js
*/
import Company from "../models/Company.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const showLogin = (req, res) => {
    res.render("auth/login", { layout: false, error: null });
};

export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario activo por email
        const user = await User.findOne({ email, active: true });


        if (!user) {
            return res.render("auth/login", { error: "Credenciales inválidas" });
        }

        // Comparar contraseña
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.render("auth/login", { error: "Credenciales inválidas" });
        }

        // Guardar sesión
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            company: user.company,
            roles: user.roles,
        };

        console.log(req.session.user);
        return res.redirect("/");
    } catch (error) {
        console.log("Login error:");
        return res.render("auth/login", { error: "Error interno" });
    }
};

export const logout = (req, res) => { req.session.destroy(() => { res.redirect("/auth/login"); }); };

export const showRegisterCompany = (req, res) => { res.render("auth/register_company", { layout: false, error: null }); };

export const postRegisterCompany = async (req, res) => {
    try {
        const { companyName, companySlug, adminName, adminEmail, adminPassword } = req.body;

        // Crear empresa
        const company = await Company.create({
            name: companyName,
            slug: companySlug,
        });

        // Crear rol admin
        const Role = (await import("../models/Role.js")).default;
        const roleAdmin = await Role.create({
            name: "admin",
            company: company._id,
            permissions: ["panel.access", "users.manage", "roles.manage"],
            description: "Administrador principal",
        });

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Crear usuario admin
        const user = await User.create({
            company: company._id,
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            roles: [roleAdmin._id],
        });

        return res.redirect("/auth/login");

    } catch (error) {
        console.error("Register error:", error);
        return res.render("auth/register_company", { error: "Error creando empresa" });
    }
};








