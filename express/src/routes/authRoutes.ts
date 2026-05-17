import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../services/auth.service";

const router = Router();

// Registration route
router.post(
  "/register",
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await registerUser(email, password);
      res
        .cookie("jid", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/api/auth/refresh",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .json({ accessToken });
    } catch (err: any) {
      console.error("Register error", err);
      res.status(400).json({ message: err.message });
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
      const { accessToken, refreshToken } = await loginUser(email, password);
      res
        .cookie("jid", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/api/auth/refresh",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .json({ accessToken });
    } catch (err: any) {
      console.error("Login error", err);
      res.status(400).json({ message: err.message });
    }
  }
);

// Refresh token endpoint
router.post("/refresh", async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const { accessToken, refreshToken } = await refreshUserToken(token);
    res
      .cookie("jid", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({ accessToken });
  } catch (err: any) {
    console.error("Refresh error", err);
    res.status(401).json({ message: err.message });
  }
});

// Logout endpoint
router.post("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (token) {
    await logoutUser(token);
  }

  res.clearCookie("jid", { path: "/api/auth/refresh" });
  res.json({ message: "Logged out" });
});

export default router;