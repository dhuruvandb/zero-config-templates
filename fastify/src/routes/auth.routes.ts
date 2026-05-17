import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { authService } from '../services/auth.service';
import type { RegisterBody, LoginBody } from '../types';

export default async function authRoutes(fastify: FastifyInstance) {
    await fastify.register(fastifyCookie);

    // POST /api/auth/register
    fastify.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as RegisterBody;

        if (!email || !password) {
            return reply.status(400).send({ message: 'Email and password are required' });
        }

        try {
            const user = await authService.register(email, password);

            const accessToken = fastify.jwt.sign({ userId: user.id });
            const refreshToken = fastify.jwt.sign(
                { userId: user.id },
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', secret: process.env.REFRESH_TOKEN_SECRET },
            );

            await authService.addRefreshToken(user.id, refreshToken);

            reply.setCookie('jid', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/api/auth/refresh',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            return { accessToken };
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'User already exists') {
                return reply.status(409).send({ message: 'User already exists' });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });

    // POST /api/auth/login
    fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as LoginBody;

        if (!email || !password) {
            return reply.status(400).send({ message: 'Email and password are required' });
        }

        try {
            const user = await authService.login(email, password);

            const accessToken = fastify.jwt.sign({ userId: user.id });
            const refreshToken = fastify.jwt.sign(
                { userId: user.id },
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', secret: process.env.REFRESH_TOKEN_SECRET },
            );

            await authService.addRefreshToken(user.id, refreshToken);

            reply.setCookie('jid', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/api/auth/refresh',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            return { accessToken };
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });

    // POST /api/auth/refresh
    fastify.post('/api/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
        const oldRefreshToken = request.cookies['jid'];

        if (!oldRefreshToken) {
            return reply.status(401).send({ message: 'No token provided' });
        }

        try {
            const payload = fastify.jwt.verify(oldRefreshToken, { secret: process.env.REFRESH_TOKEN_SECRET }) as { userId: string };
            const user = await authService.findById(payload.userId);

            if (!user) {
                return reply.status(401).send({ message: 'User not found' });
            }

            const hasToken = await authService.hasRefreshToken(user.id, oldRefreshToken);
            if (!hasToken) {
                return reply.status(401).send({ message: 'Refresh token revoked' });
            }

            const newAccessToken = fastify.jwt.sign({ userId: user.id });
            const newRefreshToken = fastify.jwt.sign(
                { userId: user.id },
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', secret: process.env.REFRESH_TOKEN_SECRET },
            );

            await authService.replaceRefreshToken(user.id, oldRefreshToken, newRefreshToken);

            reply.setCookie('jid', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/api/auth/refresh',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            return { accessToken: newAccessToken };
        } catch (error) {
            return reply.status(401).send({ message: 'Invalid refresh token' });
        }
    });

    // POST /api/auth/logout
    fastify.post('/api/auth/logout', {
        preHandler: [fastify.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const refreshToken = request.cookies['jid'];

        if (refreshToken) {
            await authService.removeRefreshToken(request.userId, refreshToken);
        }

        reply.clearCookie('jid', { path: '/api/auth/refresh' });

        return { message: 'Logged out' };
    });
}