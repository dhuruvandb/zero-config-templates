import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import itemRoutes from "./routes/itemRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            "http://localhost:4200",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected example route
app.use("/api/items", authenticateToken, itemRoutes);

export default app;
