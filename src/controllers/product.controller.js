import Product from "../models/Product.js";
import Business from "../models/Business.js";

// Listar productos
export const listProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("business", "name");

        res.render("products/list", {
            products,
            pageTitle: "Productos"
        });
    } catch (err) {
        console.error("Error listando productos:", err);
        res.status(500).send("Error al cargar los productos");
    }
};

// Mostrar formulario (crear o editar)
export const showForm = async (req, res) => {
    try {
        const businesses = await Business.find();
        let product = null;

        if (req.params.id) {
            product = await Product.findById(req.params.id);
        }

        res.render("products/form", {
            businesses,
            product,
            pageTitle: product ? "Editar Producto" : "Crear Producto"
        });

    } catch (err) {
        console.error("Error mostrando formulario:", err);
        res.status(500).send("Error");
    }
};

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const { name, sku, description, price, stock, image, business } = req.body;

        const product = new Product({
            name,
            sku,
            description,
            price,
            stock,
            image,
            business: business || null
        });

        await product.save();

        res.redirect("/products");

    } catch (err) {
        console.error("Error creando producto:", err);
        res.status(500).send("Error al crear el producto");
    }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const { name, sku, description, price, stock, image, business } = req.body;

        await Product.findByIdAndUpdate(req.params.id, {
            name,
            sku,
            description,
            price,
            stock,
            image,
            business: business || null,
        });

        res.redirect("/products");

    } catch (err) {
        console.error("Error actualizando producto:", err);
        res.status(500).send("Error al actualizar el producto");
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/products");

    } catch (err) {
        console.error("Error eliminando producto:", err);
        res.status(500).send("Error al eliminar el producto");
    }
};
