import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Company from "../models/Company.js";

dotenv.config();

const debugLogin = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        console.log("Finding any user...");
        const user = await User.findOne({ active: true });
        if (!user) {
            console.log("No active user found.");
            return;
        }
        console.log("User found:", user.email);
        console.log("User company:", user.company);
        console.log("User roles:", user.roles);

        // Mock session assignment
        const session = {};
        session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            company: user.company,
            roles: user.roles,
        };
        console.log("Session user assigned successfully:", session.user);

    } catch (error) {
        console.error("Error in debug script:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugLogin();
