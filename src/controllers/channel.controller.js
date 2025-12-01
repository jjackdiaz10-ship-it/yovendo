import Channel from "../models/Channel.js";
import Business from "../models/Business.js";

// Listar canales
export const listChannels = async (req, res) => {
    const channels = await Channel.find().populate("businesses", "name");
    res.render("channels/list", {
        channels,
        pageTitle: 'Canales'
    });
};

// Mostrar formulario (crear o editar)
export const showForm = async (req, res) => {
    const businesses = await Business.find();
    let channel = null;

    if (req.params.id) {
        channel = await Channel.findById(req.params.id);
        if (channel) {
            channel.businesses = channel.businesses.map(b => b.toString());
        }
    }

    res.render("channels/form", { businesses, channel, pageTitle: 'Canales' });
};

// Crear canal
export const createChannel = async (req, res) => {
    const { type, name, configuration, businesses } = req.body;
    const channel = new Channel({
        type,
        name,
        configuration: configuration ? JSON.parse(configuration) : {},
        businesses: businesses || [],
    });
    await channel.save();
    res.redirect("/channels");
};

// Actualizar canal
export const updateChannel = async (req, res) => {
    const { type, name, configuration, businesses, active } = req.body;
    await Channel.findByIdAndUpdate(req.params.id, {
        type,
        name,
        configuration: configuration ? JSON.parse(configuration) : {},
        businesses: businesses || [],
        active: active === "on",
    });
    res.redirect("/channels");
};

// Eliminar canal
export const deleteChannel = async (req, res) => {
    await Channel.findByIdAndDelete(req.params.id);
    res.redirect("/channels");
};
