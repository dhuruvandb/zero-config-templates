import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);

    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const oldRefreshToken = request.cookies['jid'] as string | undefined;

    if (!oldRefreshToken) {
      throw new UnauthorizedException('No token provided');
    }

    const { accessToken, refreshToken } =
      await this.authService.refresh(oldRefreshToken);

    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies['jid'] as string | undefined;

    if (refreshToken) {
      await this.authService.logout(userId, refreshToken);
    }

    response.clearCookie('jid', { path: '/api/auth/refresh' });

    return { message: 'Logged out' };
  }

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }
}
