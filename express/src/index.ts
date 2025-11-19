import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import itemRoutes from "./routes/itemRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // important: allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB();

// Auth routes
app.use("/api/auth", authRoutes);

// Protected example route
app.use("/api/items", authenticateToken, itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
