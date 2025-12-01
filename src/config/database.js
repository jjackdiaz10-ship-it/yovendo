import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("🟢 Conectado a MongoDB");
    } catch (err) {
        console.error("🔴 Error al conectar MongoDB:", err.message);
        process.exit(1);
    }
};

export default connectDB;
