import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let jwtService: jest.Mocked<JwtService>;

    const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        refreshTokens: [],
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        validatePassword: jest.fn(),
                        addRefreshToken: jest.fn(),
                        hasRefreshToken: jest.fn(),
                        replaceRefreshToken: jest.fn(),
                        removeRefreshToken: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn((key: string) => {
                            if (key === 'ACCESS_TOKEN_SECRET') return 'test-access-secret';
                            if (key === 'REFRESH_TOKEN_SECRET') return 'test-refresh-secret';
                            if (key === 'ACCESS_TOKEN_EXPIRY') return '15m';
                            if (key === 'REFRESH_TOKEN_EXPIRY') return '7d';
                            return 'test-value';
                        }),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);
        jwtService = module.get(JwtService);
    });

    // ─── Register ──────────────────────────────────────

    describe('register', () => {
        it('should register a new user', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            usersService.create.mockResolvedValue(mockUser);
            jwtService.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            const result = await authService.register({
                email: 'test@example.com',
                password: 'ValidPass1!',
            });

            expect(result.accessToken).toBe('access-token');
            expect(result.refreshToken).toBe('refresh-token');
            expect(usersService.create).toHaveBeenCalledWith(
                'test@example.com',
                'ValidPass1!',
            );
            expect(usersService.addRefreshToken).toHaveBeenCalledWith(
                'user-1',
                'refresh-token',
            );
        });

        it('should throw if user already exists', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);

            await expect(
                authService.register({
                    email: 'test@example.com',
                    password: 'ValidPass1!',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    // ─── Login ─────────────────────────────────────────

    describe('login', () => {
        it('should login with valid credentials', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);
            usersService.validatePassword.mockResolvedValue(true);
            jwtService.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            const result = await authService.login({
                email: 'test@example.com',
                password: 'ValidPass1!',
            });

            expect(result.accessToken).toBe('access-token');
            expect(result.refreshToken).toBe('refresh-token');
        });

        it('should throw for non-existent email', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(
                authService.login({ email: 'unknown@example.com', password: 'pass' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw for wrong password', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);
            usersService.validatePassword.mockResolvedValue(false);

            await expect(
                authService.login({ email: 'test@example.com', password: 'wrong' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    // ─── Refresh ───────────────────────────────────────

    describe('refresh', () => {
        it('should refresh tokens', async () => {
            jwtService.verify.mockReturnValue({ userId: 'user-1' });
            usersService.findById.mockResolvedValue(mockUser);
            usersService.hasRefreshToken.mockResolvedValue(true);
            jwtService.sign
                .mockReturnValueOnce('new-access-token')
                .mockReturnValueOnce('new-refresh-token');

            const result = await authService.refresh('old-refresh-token');

            expect(result.accessToken).toBe('new-access-token');
            expect(result.refreshToken).toBe('new-refresh-token');
            expect(usersService.replaceRefreshToken).toHaveBeenCalledWith(
                'user-1',
                'old-refresh-token',
                'new-refresh-token',
            );
        });

        it('should throw for revoked token', async () => {
            jwtService.verify.mockReturnValue({ userId: 'user-1' });
            usersService.findById.mockResolvedValue(mockUser);
            usersService.hasRefreshToken.mockResolvedValue(false);

            await expect(authService.refresh('revoked-token')).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw for invalid token', async () => {
            jwtService.verify.mockImplementation(() => {
                throw new Error('jwt malformed');
            });

            await expect(authService.refresh('bad-token')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    // ─── Logout ────────────────────────────────────────

    describe('logout', () => {
        it('should remove refresh token on logout', async () => {
            usersService.removeRefreshToken.mockResolvedValue(undefined);

            await authService.logout('user-1', 'refresh-token');

            expect(usersService.removeRefreshToken).toHaveBeenCalledWith(
                'user-1',
                'refresh-token',
            );
        });

        it('should not throw if remove fails', async () => {
            usersService.removeRefreshToken.mockRejectedValue(
                new Error('DB error'),
            );

            await expect(
                authService.logout('user-1', 'some-token'),
            ).resolves.not.toThrow();
        });
    });
});
