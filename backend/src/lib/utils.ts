import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
dotenv.config()
const prisma = new PrismaClient();

declare global {
    namespace Express {
      interface Request {
        adminId?: string; 
      }
    }
  }

export const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict"
    })
    return token
}

interface DecodedToken {
    userId: string;
}

export const verifyToken = (token: string) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined")
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
        return {
            success: true,
            adminId: decoded.userId
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Invalid token"
        }
    }
}

export const authMiddleware = async (req: Request, res:  Response, next: NextFunction) => {
    try {
        let token = null;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]
        } else {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.status(400).json({message: "Token Not Found"})
        }
        const result = verifyToken(token);
        if (!result.success) {
            return res.status(401).json({
                message: "Invalid Token"
            })
        }

        const adminIdAsInt = parseInt(result.adminId as string);
        if (isNaN(adminIdAsInt)) {
            return res.status(400).json({ message: "Invalid ID format in token" });
        }

        const admin = await prisma.admin.findUnique({where: {id: adminIdAsInt}})
        if (!admin) {
            return res.status(404).json({message: "Admin not found"})
        }

        req.adminId = result.adminId;
        next();
    } catch (error: any) {
        return res.status(500).json({message: "Internal server error"})
    }
}
