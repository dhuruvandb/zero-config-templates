import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../types/prisma.types';
import * as bcrypt from 'bcryptjs';

/** Normalise refreshTokens from the database to always be a string array. */
function getRefreshTokens(user: { refreshTokens: string | string[] }): string[] {
  if (Array.isArray(user.refreshTokens)) return user.refreshTokens;
  try { return JSON.parse(user.refreshTokens); } catch { return []; }
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        refreshTokens: JSON.stringify([]),
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async addRefreshToken(userId: string, refreshToken: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tokens = getRefreshTokens(user);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokens: JSON.stringify([...tokens, refreshToken]),
      },
    });
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tokens = getRefreshTokens(user);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokens: JSON.stringify(tokens.filter(
          (t: string) => t !== refreshToken,
        )),
      },
    });
  }

  async replaceRefreshToken(
    userId: string,
    oldToken: string,
    newToken: string,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tokens = getRefreshTokens(user);
    const filteredTokens = tokens.filter(
      (t: string) => t !== oldToken,
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokens: JSON.stringify([...filteredTokens, newToken]),
      },
    });
  }

  async hasRefreshToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    return getRefreshTokens(user).includes(token);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
