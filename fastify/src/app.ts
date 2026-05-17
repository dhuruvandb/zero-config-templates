import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth';
import authRoutes from './routes/auth.routes';
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

    await app.register(authPlugin);

    // Register routes
    await app.register(authRoutes);
    await app.register(itemRoutes);

    // Health check
    app.get('/api/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
}
