import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Item } from '../types/prisma.types';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto, userId: string): Promise<Item> {
    return this.prisma.item.create({
      data: {
        name: createItemDto.name,
        userId,
      },
    });
  }

  async findAll(userId: string): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    await this.findOne(id); // Check if exists

    return this.prisma.item.update({
      where: { id },
      data: {
        name: updateItemDto.name,
      },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const item = await this.findOne(id); // Check if exists

    // Verify ownership
    if (item.userId !== userId) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    await this.prisma.item.delete({
      where: { id },
    });
  }
}
