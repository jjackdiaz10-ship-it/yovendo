import express from "express";
import {
    listBots,
    showCreateForm,
    createBot,
    showEditForm,
    updateBot,
    deleteBot
} from "../controllers/botController.js";

const router = express.Router();

// Lista todos los bots
router.get("/", listBots);

// Mostrar formulario para crear
router.get("/create", showCreateForm);

// Crear bot
router.post("/create", createBot);

// Mostrar formulario de edición
router.get("/:id/edit", showEditForm);

// Actualizar bot
router.post("/:id/edit", updateBot);

// Eliminar bot
router.post("/:id/delete", deleteBot);

export default router;
