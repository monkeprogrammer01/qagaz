import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

interface SignupBody {
    email: string,
    password: string,
    name: string
}

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
        const {email, password, name} = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({error: "All fields are required"})
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password must have at least 8 length"})
        }

        const isExists = await prisma.admin.findUnique({
            where: {email}
        })
        if (isExists) {
            return res.status(400).json({error: "Admin with such email exists"})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })
        const token = generateToken(newAdmin.id.toString(), res)
        const adminWithoutPassword = {
            email: newAdmin.email,
            token: token
        }
        return res.status(201).json(adminWithoutPassword)
    } catch (error) {
        console.error("Error in signup controller. ", error);
        return res.status(500).json({error: "Internal server error."})
    }
}

interface LoginBody {
    
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {

}