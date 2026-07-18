import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { itemService } from '../services/item.service';
import { auth } from '../lib/auth';
import type { CreateItemBody } from '../types';

/** Get user ID from Better Auth session */
async function getUserId(request: FastifyRequest, reply: FastifyReply): Promise<string | null> {
    const url = new URL(request.url, 'http://localhost');
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
        if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
    }
    const session = await auth.api.getSession({ headers });
    if (!session) {
        reply.status(401).send({ message: 'Unauthorized' });
        return null;
    }
    return session.user.id;
}

export default async function itemRoutes(fastify: FastifyInstance) {
    // GET /api/items - Get all items for authenticated user
    fastify.get('/api/items', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = await getUserId(request, reply);
        if (!userId) return;
        const items = await itemService.findAll(userId);
        return items;
    });

    // POST /api/items - Create a new item
    fastify.post('/api/items', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = await getUserId(request, reply);
        if (!userId) return;

        const { name } = request.body as CreateItemBody;
        if (!name) {
            return reply.status(400).send({ message: 'Name is required' });
        }

        const item = await itemService.create(userId, name);
        return reply.status(201).send(item);
    });

    // PUT /api/items/:id - Update an item
    fastify.put('/api/items/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = await getUserId(request, reply);
        if (!userId) return;

        const { id } = request.params as { id: string };
        const { name } = request.body as CreateItemBody;
        if (!name) {
            return reply.status(400).send({ message: 'Name is required' });
        }

        const item = await itemService.update(id, userId, name);
        if (!item) {
            return reply.status(404).send({ message: 'Item not found' });
        }
        return reply.send(item);
    });

    // DELETE /api/items/:id - Delete an item
    fastify.delete('/api/items/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = await getUserId(request, reply);
        if (!userId) return;

        const { id } = request.params as { id: string };
        await itemService.delete(id, userId);
        return reply.status(204).send();
    });
}