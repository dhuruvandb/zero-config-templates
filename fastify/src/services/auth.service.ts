import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import type { User, JwtPayload } from '../types';

export class AuthService {
    async register(email: string, password: string): Promise<User> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                refreshTokens: [],
            },
        });
    }

    async login(email: string, password: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async addRefreshToken(userId: string, refreshToken: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        return prisma.user.update({
            where: { id: userId },
            data: {
                refreshTokens: [...user.refreshTokens, refreshToken],
            },
        });
    }

    async removeRefreshToken(userId: string, refreshToken: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        return prisma.user.update({
            where: { id: userId },
            data: {
                refreshTokens: user.refreshTokens.filter((t) => t !== refreshToken),
            },
        });
    }

    async replaceRefreshToken(
        userId: string,
        oldToken: string,
        newToken: string,
    ): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const filteredTokens = user.refreshTokens.filter((t) => t !== oldToken);

        return prisma.user.update({
            where: { id: userId },
            data: {
                refreshTokens: [...filteredTokens, newToken],
            },
        });
    }

    async hasRefreshToken(userId: string, token: string): Promise<boolean> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return false;
        }

        return user.refreshTokens.includes(token);
    }

    async validateUser(userId: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export const authService = new AuthService();