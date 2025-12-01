import express from "express";
import {
    listChannels,
    showForm,
    createChannel,
    updateChannel,
    deleteChannel
} from "../controllers/channel.controller.js";

const router = express.Router();

// Listar canales
router.get("/", listChannels);

// Crear canal
router.get("/create", showForm);
router.post("/create", createChannel);

// Editar canal
router.get("/:id/edit", showForm);
router.post("/:id/edit", updateChannel);

// Eliminar canal
router.post("/:id/delete", deleteChannel);

export default router;
