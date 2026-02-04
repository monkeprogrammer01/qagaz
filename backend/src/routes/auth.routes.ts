import express from "express";
import { login, signup, profile } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", profile)
export default router;