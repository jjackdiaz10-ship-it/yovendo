import Bot from "../models/Bot.js";
import Business from "../models/Business.js";
import Channel from "../models/Channel.js";

// Listar bots
export const listBots = async (req, res) => {
    try {
        // Traer todos los bots y popular empresas y canal
        const bots = await Bot.find()
            .populate("businesses", "name")
            .populate("channel", "name");

        // Renderizar la vista con todos los datos
        res.render('bots/list', {
            pageTitle: 'Chatbots',
            bots,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar bots");
    }
};

// Formulario crear bot
export const showCreateForm = async (req, res) => {
    const businesses = await Business.find();
    const channels = await Channel.find();
    res.render("bots/create", {
        businesses,
        channels,
        pageTitle: 'Chatbots',
    });
};

// Crear bot
export const createBot = async (req, res) => {
    const { name, configuration, businesses, channel } = req.body;
    await Bot.create({ name, configuration: JSON.parse(configuration || "{}"), businesses, channel });
    res.redirect("/bots");
};

// Formulario editar
export const showEditForm = async (req, res) => {
    const bot = await Bot.findById(req.params.id);
    const businesses = await Business.find();
    const channels = await Channel.find();
    res.render("bots/edit", { bot, businesses, channels });
};

// Actualizar bot
export const updateBot = async (req, res) => {
    const { name, configuration, businesses, channel, active } = req.body;
    await Bot.findByIdAndUpdate(req.params.id, {
        name,
        configuration: JSON.parse(configuration || "{}"),
        businesses,
        channel,
        active: active === "on"
    });
    res.redirect("/bots");
};

// Eliminar bot
export const deleteBot = async (req, res) => {
    await Bot.findByIdAndDelete(req.params.id);
    res.redirect("/bots");
};
