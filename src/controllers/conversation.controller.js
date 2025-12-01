// src/controllers/conversation.controller.js
import Conversation from "../models/Conversation.js";

export const listConversations = async (req, res) => {
    const companyId = req.user.company._id;
    const conversations = await Conversation.find({ company: companyId }).sort({ lastUpdate: -1 }).lean();
    res.render("conversations", { conversations, user: req.user });
};
