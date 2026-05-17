import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { itemService } from '../services/item.service';
import type { CreateItemBody } from '../types';

export default async function itemRoutes(fastify: FastifyInstance) {
    // GET /api/items - Get all items for authenticated user
    fastify.get('/api/items', {
        preHandler: [fastify.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const items = await itemService.findAll(request.userId);
        return items;
    });

    // POST /api/items - Create a new item
    fastify.post('/api/items', {
        preHandler: [fastify.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { name } = request.body as CreateItemBody;

        if (!name) {
            return reply.status(400).send({ message: 'Name is required' });
        }

        const item = await itemService.create(request.userId, name);
        return reply.status(201).send(item);
    });

    // PUT /api/items/:id - Update an item
    fastify.put('/api/items/:id', {
        preHandler: [fastify.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const { name } = request.body as CreateItemBody;

        if (!name) {
            return reply.status(400).send({ message: 'Name is required' });
        }

        const item = await itemService.update(id, request.userId, name);
        if (!item) {
            return reply.status(404).send({ message: 'Item not found' });
        }
        return reply.send(item);
    });

    // DELETE /api/items/:id - Delete an item
    fastify.delete('/api/items/:id', {
        preHandler: [fastify.authenticate],
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        await itemService.delete(id, request.userId);
        return reply.status(204).send();
    });
}