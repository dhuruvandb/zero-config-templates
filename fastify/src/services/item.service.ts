import prisma from '../lib/prisma';
import type { Item } from '../types';

export class ItemService {
    async findAll(userId: string): Promise<Item[]> {
        return prisma.item.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userId: string, name: string): Promise<Item> {
        return prisma.item.create({
            data: {
                name,
                userId,
            },
        });
    }

    async update(id: string, userId: string, name: string): Promise<Item | null> {
        const existing = await prisma.item.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return null;
        }

        return prisma.item.update({
            where: { id },
            data: { name },
        });
    }

    async delete(id: string, userId: string): Promise<void> {
        await prisma.item.deleteMany({
            where: { id, userId },
        });
    }
}

export const itemService = new ItemService();