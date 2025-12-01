import mongoose from "mongoose";
import dotenv from "dotenv";
import { receiveMessage } from "../controllers/whatsappWebhook.controller.js";
import Message from "../models/Message.js";

dotenv.config();

// Mock response object
const mockRes = {
    sendStatus: (code) => {
        console.log(`Response status: ${code}`);
    },
    status: (code) => {
        console.log(`Response status: ${code}`);
        return mockRes;
    },
    send: (body) => {
        console.log(`Response body: ${body}`);
    }
};

async function runTest() {
    console.log("🚀 Starting Webhook Verification...");

    // Connect to DB
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yovendo";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Mock Request
    const mockReq = {
        body: {
            entry: [{
                changes: [{
                    value: {
                        messages: [{
                            from: "5491112345678",
                            id: "wamid.test." + Date.now(),
                            text: { body: "Test message from verification script" },
                            type: "text"
                        }]
                    }
                }]
            }]
        }
    };

    try {
        // Call controller
        await receiveMessage(mockReq, mockRes);

        // Verify DB
        const savedMsg = await Message.findOne({ text: "Test message from verification script" });

        if (savedMsg) {
            console.log("✅ Message saved successfully:", savedMsg);
            // Cleanup
            await Message.deleteOne({ _id: savedMsg._id });
            console.log("✅ Test message cleaned up");
        } else {
            console.error("❌ Message NOT found in database");
        }

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected");
    }
}

runTest();
