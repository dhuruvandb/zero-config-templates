import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { JwtPayload } from '../types';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
    interface FastifyRequest {
        userId: string;
    }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
    fastify.register(fastifyJwt, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'your-secret-key',
        sign: {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
        },
    });

    fastify.decorate(
        'authenticate',
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify();
                const payload = request.user as JwtPayload;
                request.userId = payload.userId;
            } catch (err) {
                reply.status(401).send({ message: 'Unauthorized' });
            }
        },
    );
});