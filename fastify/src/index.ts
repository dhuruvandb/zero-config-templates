import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/item.routes';
import { config } from './config';

async function main() {
    const app = Fastify({
        logger: config.nodeEnv !== 'test',
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

    // Start server
    try {
        await app.listen({ port: config.port, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${config.port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

main();