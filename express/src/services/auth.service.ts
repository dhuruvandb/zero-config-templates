import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";

dotenv.config();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY ||
    "15m") as `${number}${"s" | "m" | "h" | "d"}`;
const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY ||
    "7d") as `${number}${"s" | "m" | "h" | "d"}`;

interface TokenPayload {
    userId: string;
}

const accessTokenOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY };
const refreshTokenOptions: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY };

function generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, accessTokenOptions);
}

function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, refreshTokenOptions);
}

export async function registerUser(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);
    const refreshToken = generateRefreshToken("placeholder");
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            refreshTokens: [refreshToken],
        },
    });

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokens: [newRefreshToken] },
    });

    return { accessToken, refreshToken: newRefreshToken };
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokens: [...user.refreshTokens, refreshToken] },
    });

    return { accessToken, refreshToken };
}

export async function refreshUserToken(token: string) {
    let payload: TokenPayload;
    try {
        payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
        throw new Error("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
        throw new Error("User not found");
    }

    if (!user.refreshTokens.includes(token)) {
        throw new Error("Refresh token revoked");
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            refreshTokens: [
                ...user.refreshTokens.filter((t) => t !== token),
                newRefreshToken,
            ],
        },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(token: string) {
    try {
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    refreshTokens: user.refreshTokens.filter((t) => t !== token),
                },
            });
        }
    } catch {
        // Token invalid, nothing to do
    }
}