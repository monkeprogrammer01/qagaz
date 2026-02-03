import express from "express";
import cors from "cors"

const app = express();
const PORT = 5001
app.use(cors())
app.use(express.json())
app.get("/", (req,res) => {
    res.json({message: "server works"})
})

app.listen(PORT, () => {
    console.log(`Cервер запущен на http://localhost:${PORT}`)
})