import express from "express";
import { createApplication, getAllApplications, getApplicationById, updateApplicationById, deleteApplicationById } from "../controllers/applications.controller";

const router = express.Router();
router.get("/", getAllApplications) // here admins or user will get applications (if user they will get its own applications only)
router.post("/", createApplication) // here client can post new application
router.get("/:id", getApplicationById) // here client or admins can get application by id 
router.delete("/:id", deleteApplicationById) // deleting application by id
router.patch("/:id", updateApplicationById) // updating application by id (admins will change status of each application or client changes its room for instance)

export default router;