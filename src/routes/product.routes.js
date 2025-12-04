import express from "express";
import {
    listProducts,
    showForm,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// Listar productos
router.get("/", listProducts);

// Formulario crear producto
router.get("/create", showForm);

// Crear producto (POST)
router.post("/create", createProduct);

// Formulario editar producto
router.get("/edit/:id", showForm);

// Actualizar producto (POST o PUT)
router.post("/edit/:id", updateProduct);

// Eliminar producto
router.post("/delete/:id", deleteProduct);

export default router;
