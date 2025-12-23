import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import type { User } from '../types/prisma.types';

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.usersService.create(email, password);

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.usersService.addRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.usersService.addRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(oldRefreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token : ' + error);
    }

    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hasToken = await this.usersService.hasRefreshToken(
      user.id,
      oldRefreshToken,
    );

    if (!hasToken) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const newAccessToken = this.generateAccessToken(user.id);
    const newRefreshToken = this.generateRefreshToken(user.id);

    await this.usersService.replaceRefreshToken(
      user.id,
      oldRefreshToken,
      newRefreshToken,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      await this.usersService.removeRefreshToken(userId, refreshToken);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.warn(`Failed to remove refresh token: ${error.message}`);
      } else {
        this.logger.warn('Failed to remove refresh token: unknown error');
      }
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        expiresIn:
          this.configService.get<string>('ACCESS_TOKEN_EXPIRY') ?? '15m',
      },
    );
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        expiresIn:
          this.configService.get<string>('REFRESH_TOKEN_EXPIRY') ?? '7d',
      },
    );
  }
}
