import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
import connectDB from "./config/database.js";
await connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------
// Static files
// ---------------------
app.use(
    "/adminlte",
    express.static(path.join(__dirname, "../node_modules/admin-lte/dist"))
);

app.use(
    "/plugins/bootstrap",
    express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);

app.use(
    "/plugins/jquery",
    express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);

app.use(
    "/plugins/fontawesome-free",
    express.static(
        path.join(__dirname, "../node_modules/@fortawesome/fontawesome-free")
    )
);

// ---------------------
// Sessions
// ---------------------
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

// ---------------------
// EJS + Layout
// ---------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout"); // layout.ejs en carpeta views

// ---------------------
// Rutas
// ---------------------
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import botRoutes from "./routes/bot.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import businessRoutes from "./routes/business.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/bots", botRoutes);
app.use("/channels", channelRoutes);
app.use("/business", businessRoutes);
app.use("/whatsapp", whatsappRoutes);

// ---------------------
// Redirección raíz
// ---------------------
app.get("/", (req, res) => {
    if (req.session.user) return res.redirect("/home");
    return res.redirect("/auth/login");
});

// ---------------------
// Escuchar puerto
// ---------------------
const PORT = process.env.PORT || 3000; // Muy importante para Render
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
