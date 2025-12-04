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

function generateRandomCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Crear canal
export const createChannel = async (req, res) => {
    try {
        const { type, name, configuration, businesses } = req.body;

        const parsedConfig = configuration ? JSON.parse(configuration) : {};

        // Asegurarse que businesses sea array de strings o IDs
        let businessIds = [];
        if (Array.isArray(businesses)) {
            businessIds = businesses.map(b => typeof b === "string" ? b : b._id?.toString()).filter(Boolean);
        } else if (businesses) {
            businessIds = [businesses];
        }

        // Tomamos el primer business para el webhook
        const businessId = businessIds.length ? businessIds[0] : "default";

        const baseUrl = "https://yovendo.onrender.com/" + type + "/webhook";

        const webhook = `${baseUrl}/${generateRandomCode(8)}-${businessId}`;

        const channel = new Channel({
            type,
            name,
            configuration: parsedConfig,
            businesses: businessIds,
            webhook,
        });

        await channel.save();

        // Redireccionar simple
        res.redirect("/channels");
    } catch (err) {
        console.error("Error creando canal:", err);
        res.status(500).send("Error al crear el canal");
    }
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
    res.redirect("/channels", { pageTitle: 'Canales' });
};

// Eliminar canal
export const deleteChannel = async (req, res) => {
    await Channel.findByIdAndDelete(req.params.id);
    res.redirect("/channels");
};


// {
//   "phone_number_id": "804332929440701",
//   "access_token": "EAANYtZAAJbPQBQMF5FjCMIKpZACdGikDZAGa77g4rpqq7IK4YkxKyk0jPCYTIF2WZCPUoFaGQpGMUtMfM3AToSYHzfiXespKtdf75GcIh7OFzrtyZBPYAn1rwLTJnB6k89t5iKXORC8PTZBSnlZBLOBy5ZB1ulDZCwPsfDO5CqDDTpzOqwVirQUAnit1Q4NhMISZBl67Yfua8xzZCXhEj3ZBD1NVbeaCw5jOV5QKYzaJ6ZAEQS6LkwBCmzCp5Bxh405WeSNfgfgvCDeBYcAZCNbuEAbmKX3ZBf5"
// }