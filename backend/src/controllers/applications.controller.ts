import type { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
export const createApplication = async (req: Request, res: Response) => {
    try {
        const { clientName, phone, room } = req.body;

        const newApplication = await prisma.application.create({
            data: {
                clientName,
                phone,
                room
            }
        })
        return res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error in createApplication controller. ", error)
        res.status(500).json({error: "Internal server error."})
    }
}

export const getAllApplications = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error in getAllApplications controller. ", error)
        res.status(500).json({error: "Internal server error"})
    }
}

interface RequestParams {
    id: string;
}

export const getApplicationById = async (req: Request<RequestParams>, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        const application = await prisma.application.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!application) {
            return res.status(404).json({error: "Current application not found."});
        }
        return res.status(200).json(application);
    } catch (error) {
        console.error("Error in getApplicationById controller. ", error)
        return res.status(500).json({error: "Internal server error"})
    }
}

export const updateApplicationById = async (req: Request<RequestParams>, res: Response) => {
    try {
        const { id } = req.params;   
        const newValues = req.body
        if (!id) {
            return res.status(404).json({error: "ID is required."})
        }
        const application = await prisma.application.update({
            where: {id: parseInt(id)},
            data: newValues
        });
        return res.status(200).json(application)
         
    } catch (error: unknown) {
        console.error("Error in updateApplication controller. ", error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return res.status(404).json({ error: "Application not found." });
        }
        return res.status(500).json({error: "Internal server error."})
    }
}

export const deleteApplicationById = async (req: Request<RequestParams>, res: Response) => {
    try {
        const { id } = req.params;
        const application = await prisma.application.delete({
            where: {id: parseInt(id)}
        })
        return res.status(200).json({message: "Application deleted succssfully"});
    } catch (error: unknown) {
        console.error("Error in deleteApplicationById controller. ", error)
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return res.status(404).json({ error: "Application not found." });
        }
        return res.status(500).json({error: "Internal server error."})
    }
}