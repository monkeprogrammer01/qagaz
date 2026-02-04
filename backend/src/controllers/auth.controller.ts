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
    email: string,
    password: string
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({error: "Email and password are required."})
        const admin = await prisma.admin.findUnique({
            where: {email}
        })
        if (!admin) return res.status(400).json({error: "Invalid email or password."})
        const isPasswordCorrect = await bcrypt.compare(password, admin.password)
        if (!isPasswordCorrect) return res.status(400).json({error: "Invalid email or password."})
        const token = generateToken(admin.id.toString(), res);
        const adminWithoutPassword = {
            email: admin.email,
            token: token
        }
        return res.status(200).json({
            success: true,
            admin: adminWithoutPassword
        })
    } catch (error) {
        console.error("Error in login controller. ", error);
        return res.status(500).json("Internal server error.")
    }
}

interface ProfileBody {
    adminId: string
}
export const profile = async (req: Request<{}, {}, ProfileBody>, res: Response) => {
    try {
        const {adminId} = req.body;
        const admin = await prisma.admin.findUnique({
            where: {id: parseInt(adminId)}
        })
        if (!admin) return res.status(404).json("Admin not found.")
        const adminWithoutPassword = {
            email: admin.email,
        }
        return res.status(200).json({
            success: true,
            admin: adminWithoutPassword
        })
        } catch (error) {
        
    }
}