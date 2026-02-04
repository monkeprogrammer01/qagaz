import express from "express";
import { login, signup, profile } from "../controllers/auth.controller";
import { authMiddleware } from "../lib/utils";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", authMiddleware, profile)
export default router;