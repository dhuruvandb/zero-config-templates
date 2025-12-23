import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { Item } from '../types/prisma.types';

@Controller('api/items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@GetUser('id') userId: string): Promise<Item[]> {
    return this.itemsService.findAll(userId);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createItemDto: CreateItemDto,
    @GetUser('id') userId: string,
  ): Promise<Item> {
    return this.itemsService.create(createItemDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    await this.itemsService.remove(id, userId);
    return { message: 'Deleted' };
  }
}
