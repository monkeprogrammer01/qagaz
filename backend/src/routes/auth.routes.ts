import express from "express";
import { login, signup, profile, admins } from "../controllers/auth.controller";
import { authMiddleware } from "../lib/utils";
const router = express.Router();
router.get("/admins", authMiddleware, admins);
router.post("/signup", signup)
router.post("/login", login)
router.get("/me", authMiddleware, profile)
export default router;