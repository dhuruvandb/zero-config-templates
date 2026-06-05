import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ItemsService } from './items.service.js';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto.js';
import type { Item } from '../types/prisma.types.js';

/** Extract userId from request — set by auth middleware in main.ts */
function getUserId(req: Request): string {
  return (req as any).userId;
}

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  async findAll(@Req() req: Request): Promise<Item[]> {
    return this.itemsService.findAll(getUserId(req));
  }

  @Post()
  async create(
    @Body(ValidationPipe) createItemDto: CreateItemDto,
    @Req() req: Request,
  ): Promise<Item> {
    return this.itemsService.create(createItemDto, getUserId(req));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateItemDto: UpdateItemDto,
    @Req() req: Request,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto, getUserId(req));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    await this.itemsService.remove(id, getUserId(req));
    return { message: 'Deleted' };
  }
}
