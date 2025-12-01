import { Router } from "express";
import { showHome } from "../controllers/home.controller.js";
import { ensureAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", ensureAuth, showHome);

export default router;
