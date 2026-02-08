import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import itemRoutes from "./routes/itemRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

// Validate required environment variables
function validateEnvironment() {
  const required = ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    console.error(
      'Generate secrets with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
    );
    process.exit(1);
  }
}

validateEnvironment();

const app = express();
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:4200",
    ],
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
