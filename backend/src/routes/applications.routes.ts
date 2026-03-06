import express from "express";
import { createApplication, getAllApplications, getApplicationById, updateApplicationById, deleteApplicationById } from "../controllers/applications.controller";
import { authMiddleware } from "../lib/utils";

const router = express.Router();

// PUBLIC: client creates application
router.post("/", createApplication);

// ADMIN: see all applications
router.get("/", authMiddleware, getAllApplications);

// ADMIN: get by id
router.get("/:id", authMiddleware, getApplicationById);

// ADMIN: update (status, adminEmail, room, etc.)
router.patch("/:id", authMiddleware, updateApplicationById);

// ADMIN: delete
router.delete("/:id", authMiddleware, deleteApplicationById);

export default router;