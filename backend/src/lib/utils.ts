import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import type { Response } from "express";
dotenv.config()


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
            userId: decoded.userId
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Invalid token"
        }
    }
}

