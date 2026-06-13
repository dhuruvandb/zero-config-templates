import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../src/items/items.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { vi, Mocked, Mock } from 'vitest';

describe('ItemsService', () => {
    let itemsService: ItemsService;
    let prisma: Mocked<PrismaService>;

    const mockItem = {
        id: 'item-1',
        name: 'Test Item',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemsService,
                {
                    provide: PrismaService,
                    useValue: {
                        item: {
                            create: vi.fn(),
                            findMany: vi.fn(),
                            findUnique: vi.fn(),
                            update: vi.fn(),
                            delete: vi.fn(),
                        },
                    },
                },
            ],
        }).compile();

        itemsService = module.get<ItemsService>(ItemsService);
        prisma = module.get(PrismaService);
    });

    // ─── CREATE ────────────────────────────────────────

    describe('create', () => {
        it('should create an item', async () => {
            (prisma.item.create as Mock).mockResolvedValue(mockItem);

            const result = await itemsService.create(
                { name: 'Test Item' },
                'user-1',
            );

            expect(result).toEqual(mockItem);
            expect(prisma.item.create).toHaveBeenCalledWith({
                data: { name: 'Test Item', userId: 'user-1' },
            });
        });
    });

    // ─── READ ──────────────────────────────────────────

    describe('findAll', () => {
        it('should return all items for a user', async () => {
            (prisma.item.findMany as Mock).mockResolvedValue([mockItem]);

            const result = await itemsService.findAll('user-1');

            expect(result).toEqual([mockItem]);
            expect(prisma.item.findMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should return empty array for user with no items', async () => {
            (prisma.item.findMany as Mock).mockResolvedValue([]);

            const result = await itemsService.findAll('user-with-no-items');

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return an item by id', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(mockItem);

            const result = await itemsService.findOne('item-1');

            expect(result).toEqual(mockItem);
        });

        it('should throw NotFoundException for non-existent item', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(null);

            await expect(itemsService.findOne('bad-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    // ─── UPDATE ────────────────────────────────────────

    describe('update', () => {
        it('should update an item', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(mockItem);
            (prisma.item.update as Mock).mockResolvedValue({
                ...mockItem,
                name: 'Updated',
            });

            const result = await itemsService.update('item-1', { name: 'Updated' });

            expect(result.name).toBe('Updated');
            expect(prisma.item.update).toHaveBeenCalledWith({
                where: { id: 'item-1' },
                data: { name: 'Updated' },
            });
        });

        it('should throw NotFoundException for non-existent item', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(null);

            await expect(
                itemsService.update('bad-id', { name: 'Ghost' }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    // ─── DELETE ────────────────────────────────────────

    describe('remove', () => {
        it('should delete an item', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(mockItem);
            (prisma.item.delete as Mock).mockResolvedValue(mockItem);

            await itemsService.remove('item-1', 'user-1');

            expect(prisma.item.delete).toHaveBeenCalledWith({
                where: { id: 'item-1' },
            });
        });

        it('should throw NotFoundException for non-existent item', async () => {
            (prisma.item.findUnique as Mock).mockResolvedValue(null);

            await expect(
                itemsService.remove('bad-id', 'user-1'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when deleting other user\'s item', async () => {
            const otherUserItem = { ...mockItem, userId: 'other-user' };
            (prisma.item.findUnique as Mock).mockResolvedValue(otherUserItem);

            await expect(
                itemsService.remove('item-1', 'user-1'),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
