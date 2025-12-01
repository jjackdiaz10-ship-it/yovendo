// scripts/verify-auth.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";

// Models
import User from "../models/User.js";
import Company from "../models/Company.js";
import Role from "../models/Role.js";
import Session from "../models/Session.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const log = {
    info: (msg) => console.log(chalk.blue(msg)),
    ok: (msg) => console.log(chalk.green(msg)),
    error: (msg) => console.log(chalk.red(msg)),
};

async function run() {
    log.info("🟦 Conectando a MongoDB...");
    await mongoose.connect(mongoUri);
    log.ok("🟩 Conectado");

    try {
        log.info("🟦 Limpiando colecciones de test...");
        await Promise.all([
            User.deleteMany({}),
            Role.deleteMany({}),
            Company.deleteMany({}),
            Session.deleteMany({}),
        ]);
        log.ok("🟩 Limpio");

        // Buscar empresa
        let company = await Company.findOne({ name: "Empresa Test" });

        if (!company) {
            log.info("🟦 Creando empresa...");
            company = await Company.create({
                name: "Empresa Test",
                slug: "empresa-test",
                testData: true
            });
            log.ok(`🟩 Company creada: ${company._id}`);
        }

        log.info("🟦 Creando Role...");
        const role = await Role.create({
            name: "admin",
            permissions: ["panel.access", "users.manage", "roles.manage"],
            company: company._id,
            description: "Rol administrador test",
            testData: true
        });
        log.ok(`🟩 Role creado: ${role._id}`);

        log.info("🟦 Creando User...");
        const user = await User.create({
            name: "Usuario Test",
            email: "test@yovendo.io",
            password: "123456",
            company: company._id,
            roles: [role._id],
            testData: true
        });
        log.ok(`🟩 User creado: ${user._id}`);

        // -------------------------------
        //   VERIFICACIÓN DE PERMISOS
        // -------------------------------
        log.info("🟦 Probando roleHasPermission...");

        // Cargar helper
        const { roleHasPermission } = await import("../utils/roles.js");

        // Poblar roles del usuario
        const populatedUser = await User.findById(user._id).populate("roles");

        const roleObj = populatedUser.roles[0];

        const canAccess = roleHasPermission(roleObj, "panel.access");
        const canManageUsers = roleHasPermission(roleObj, "users.manage");
        const canDeleteOrders = roleHasPermission(roleObj, "orders.delete");

        console.log("   panel.access:", canAccess);
        console.log("   users.manage:", canManageUsers);
        console.log("   orders.delete:", canDeleteOrders);

        if (canAccess && canManageUsers && !canDeleteOrders) {
            log.ok("🟩 Permisos funcionando correctamente");
        } else {
            log.error("❌ Error en los permisos");
        }

        log.info("🟦 Test finalizado.");
    } catch (err) {
        log.error("❌ ERROR");
        console.log(err);
    }

    await mongoose.disconnect();
    process.exit(0);
}

run();
