import Business from "../models/Business.js";

// LISTAR EMPRESAS
export const listBusiness = async (req, res) => {
    const businesses = await Business.find();
    res.render("business/list", {
        businesses,
        pageTitle: "Empresas",
    });
};

// MOSTRAR FORMULARIO DE CREACIÓN
export const showCreateForm = async (req, res) => {
    res.render("business/form", {
        business: null,
        pageTitle: "Crear Empresa",
    });
};

// CREAR EMPRESA
export const createBusiness = async (req, res) => {
    const { name, logo, website } = req.body;

    const business = new Business({
        name,
        logo,
        website,
    });

    await business.save();
    res.redirect("/business");
};

// MOSTRAR FORMULARIO DE EDICIÓN
export const showEditForm = async (req, res) => {
    const business = await Business.findById(req.params.id);

    res.render("business/form", {
        business,
        pageTitle: "Editar Empresa",
    });
};

// ACTUALIZAR EMPRESA
export const updateBusiness = async (req, res) => {
    const { name, logo, website } = req.body;

    await Business.findByIdAndUpdate(req.params.id, {
        name,
        logo,
        website,
    });

    res.redirect("/business");
};

// ELIMINAR EMPRESA
export const deleteBusiness = async (req, res) => {
    await Business.findByIdAndDelete(req.params.id);
    res.redirect("/business");
};
