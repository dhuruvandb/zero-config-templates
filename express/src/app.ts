import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";
import itemRoutes from "./routes/itemRoutes";

dotenv.config();

const app = express();

// CORS must be before the Better Auth handler
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            "http://localhost:4200",
        ],
        credentials: true,
    })
);

// Better Auth handler — mounted BEFORE express.json() per docs
app.all("/api/auth/:path(.*)?", toNodeHandler(auth));

// Express JSON middleware — only for non-auth routes
app.use(express.json());

// Mount express.json() for routes that need it after auth handler
app.use("/api/items", itemRoutes);

export default app;
export { app, fromNodeHeaders, auth };
