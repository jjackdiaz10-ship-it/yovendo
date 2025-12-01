import { Router } from "express";
import { showLogin, postLogin, logout, showRegisterCompany, postRegisterCompany } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", showLogin);
router.post("/login", postLogin);

router.get("/register-company", showRegisterCompany);
router.post("/register-company", postRegisterCompany);

router.post("/logout", logout);

export default router;
