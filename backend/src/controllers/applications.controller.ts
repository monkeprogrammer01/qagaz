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
