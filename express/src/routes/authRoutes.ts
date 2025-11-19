import { Router, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

const router = Router();

// Load secrets from env
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY ||
  "15m") as `${number}${"s" | "m" | "h" | "d"}`;
const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY ||
  "7d") as `${number}${"s" | "m" | "h" | "d"}`;

interface TokenPayload {
  userId: string;
}

// JWT options
const accessTokenOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY };
const refreshTokenOptions: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY };

// Helper to generate tokens
function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, accessTokenOptions);
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, refreshTokenOptions);
}

// Registration route
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const newUser = new User({ email, password: hashed });
      await newUser.save();

      const accessToken = generateAccessToken(newUser._id.toString());
      const refreshToken = generateRefreshToken(newUser._id.toString());

      newUser.refreshTokens!.push(refreshToken);
      await newUser.save();

      res
        .cookie("jid", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/api/auth/refresh",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
        .json({ accessToken });
    } catch (err) {
      console.error("Register error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Login route
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshTokens!.push(refreshToken);
      await user.save();

      res
        .cookie("jid", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/api/auth/refresh",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .json({ accessToken });
    } catch (err) {
      console.error("Login error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Refresh token endpoint
router.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ message: "No token provided" });

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(payload.userId);
  if (!user) return res.status(401).json({ message: "User not found" });

  if (!user.refreshTokens!.includes(token)) {
    return res.status(401).json({ message: "Refresh token revoked" });
  }

  const newAccessToken = generateAccessToken(user._id.toString());
  const newRefreshToken = generateRefreshToken(user._id.toString());

  user.refreshTokens = user.refreshTokens!.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  res
    .cookie("jid", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .json({ accessToken: newAccessToken });
});

// Logout endpoint
router.post("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (token) {
    try {
      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
      const user = await User.findById(payload.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens!.filter((t) => t !== token);
        await user.save();
      }
    } catch (err) {
      console.warn("Logout: invalid token", err);
    }
  }

  res.clearCookie("jid", { path: "/api/auth/refresh" });
  res.json({ message: "Logged out" });
});

export default router;
