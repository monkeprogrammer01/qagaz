import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import applicationRouter from "./routes/applications.routes";
import authRouter from "./routes/auth.routes"
dotenv.config()
const app = express();
const PORT = process.env.PORT
const allowed = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: allowed as any,  
    credentials: true                  
}));
app.use(express.json())

app.use("/api/applications", applicationRouter)
app.use("/api/auth", authRouter)
app.listen(PORT, () => {
    console.log(`Server works on http://localhost:${PORT}`)
})