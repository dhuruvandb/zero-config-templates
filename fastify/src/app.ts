import Fastify from 'fastify';
import cors from '@fastify/cors';
import { auth } from './lib/auth';
import itemRoutes from './routes/item.routes';
import { config } from './config';

export async function buildApp(opts?: { logger?: boolean }) {
    const app = Fastify({
        logger: opts?.logger ?? config.nodeEnv !== 'test',
    });

    // Register plugins
    await app.register(cors, {
        origin: config.frontendUrl,
        credentials: true,
    });

    // Better Auth handler — uses standard Web API Request/Response
    app.all('/api/auth/*', async (request, reply) => {
        // Convert Fastify request to Web API Request
        const url = new URL(request.url, config.baseUrl);
        const headers = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
            if (value) {
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
        }

        // Build the Web API Request
        const req = new Request(url.toString(), {
            method: request.method,
            headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
        });

        const res = await auth.handler(req);

        // Send the response back through Fastify
        reply.status(res.status);
        res.headers.forEach((value, key) => {
            reply.header(key, value);
        });
        const text = await res.text();
        if (text) {
            reply.send(text);
        } else {
            reply.send();
        }
    });

    // Register routes
    await app.register(itemRoutes);

    // Health check
    app.get('/api/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
}
