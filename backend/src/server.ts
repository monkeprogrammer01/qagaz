import express from "express";
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import applicationRouter from "./routes/applications.routes";
import authRouter from "./routes/auth.routes"
dotenv.config()
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT
app.use(cors())
app.use(express.json())

app.use("/api/applications", applicationRouter)
app.use("/api/auth", authRouter)
app.listen(PORT, () => {
    console.log(`Cервер запущен на http://localhost:${PORT}`)
})