import { Router } from "express";
import {
    listBusiness,
    showCreateForm,
    createBusiness,
    showEditForm,
    updateBusiness,
    deleteBusiness
} from "../controllers/business.controller.js";

const router = Router();

// Listado
router.get("/", listBusiness);

// Crear
router
    .route("/create")
    .get(showCreateForm)
    .post(createBusiness);

// Editar
router
    .route("/edit/:id")
    .get(showEditForm)
    .post(updateBusiness);

// Eliminar
router.post("/delete/:id", deleteBusiness);

export default router;
