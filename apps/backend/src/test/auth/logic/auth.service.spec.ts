import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuthPrismaMock,
  createAuthPrismaMock,
} from '../mocks/auth-prisma.mock';
import { AuthService } from '../../../main/auth/logic/auth.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Request } from 'express';
import { generateSecret, generateURI, verify } from 'otplib';
import * as QRCode from 'qrcode';

jest.mock('otplib', () => ({
  generateSecret: jest.fn(),
  generateURI: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: AuthPrismaMock;
  let jwtService: any;
  let configService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = createAuthPrismaMock();
    prisma.$transaction.mockImplementation(async (operation: any) =>
      typeof operation === 'function' ? operation(prisma) : operation,
    );
    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn(),
    };
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('should register a new user and return user data with tokens', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const createdUser = {
      id: 'User:123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(null);

    prisma.user.create.mockResolvedValue(createdUser);

    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    configService.getOrThrow.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_ACCESS_TTL: '15m',
        JWT_REFRESH_TTL: '7d',
      };

      return config[key];
    });
    const result = await service.register(registerDto);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should throw an error if the user already exists', async () => {
    const registerDto = {
      email: 'test@gmail.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const existingUser = {
      id: 'User:123',
      email: 'test@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    prisma.user.findUnique.mockResolvedValue(existingUser);

    await expect(service.register(registerDto)).rejects.toThrow(
      'Email already in use',
    );
  });
  it('should throw an error if the user can not be found during login', async () => {
    const loginDto = {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    };

    prisma.user.findUnique.mockResolvedValue(null);

    const fakeRequest = {
      headers: {
        'user-agent': 'test-browser',
      },
      ip: '127.0.0.1',
    } as Request;

    await expect(service.login(loginDto, fakeRequest)).rejects.toThrow(
      'Invalid email or password',
    );
  });

  it('should return a short-lived challenge token when 2FA is enabled', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'User:123',
      email: 'test@example.com',
      passwordHash: '$2b$10$7EqJtq98hPqEX7fNZaFWoO5/K4UFyHCzYw9w1wH6Y7E9Y5u9YfN9K',
      twoFactorEnabled: true,
    });
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValueOnce(true);
    jwtService.signAsync.mockResolvedValueOnce('two-factor-token');
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'JWT_2FA_SECRET') return 'two-factor-secret';
      throw new Error(`Unexpected config key: ${key}`);
    });

    const result = await service.login(
      { email: 'test@example.com', password: 'password123' },
      { headers: {}, ip: '127.0.0.1' } as Request,
    );

    expect(result).toEqual({
      requiresTwoFactor: true,
      twoFactorToken: 'two-factor-token',
      message: 'Two-factor authentication is required.',
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: 'User:123',
        email: 'test@example.com',
        purpose: 'two-factor-login',
      },
      { secret: 'two-factor-secret', expiresIn: '5m' },
    );
  });

  it('should create and store an encrypted pending 2FA secret', async () => {
    const user = {
      id: 'User:123',
      email: 'test@example.com',
      passwordHash: 'hash',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.user.findUnique.mockResolvedValue(user);
    (generateSecret as jest.Mock).mockReturnValue('BASE32SECRET');
    (generateURI as jest.Mock).mockReturnValue('otpauth://totp/example');
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,qr');
    configService.getOrThrow.mockReturnValue(
      Buffer.alloc(32, 7).toString('base64'),
    );

    const result = await service.setupTwoFactor(user.id);

    expect(result).toEqual({
      secret: 'BASE32SECRET',
      otpauthUrl: 'otpauth://totp/example',
      qrCodeDataUrl: 'data:image/png;base64,qr',
    });
    const update = prisma.user.update.mock.calls[0][0];
    expect(update.data.twoFactorSecret).toMatch(/^v1:/);
    expect(update.data.twoFactorSecret).not.toContain('BASE32SECRET');
    expect(update.data.twoFactorEnabled).toBe(false);
  });

  it('should enable 2FA only after a valid authenticator code', async () => {
    const encryptionKey = Buffer.alloc(32, 7).toString('base64');
    configService.getOrThrow.mockReturnValue(encryptionKey);
    (generateSecret as jest.Mock).mockReturnValue('BASE32SECRET');
    (generateURI as jest.Mock).mockReturnValue('otpauth://totp/example');
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,qr');
    prisma.user.findUnique.mockResolvedValue({
      id: 'User:123',
      email: 'test@example.com',
      passwordHash: 'hash',
      firstName: null,
      lastName: null,
      role: 'USER',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await service.setupTwoFactor('User:123');
    const encryptedSecret = prisma.user.update.mock.calls[0][0].data
      .twoFactorSecret;
    prisma.user.findUnique.mockResolvedValue({
      id: 'User:123',
      twoFactorEnabled: false,
      twoFactorSecret: encryptedSecret,
    });
    (verify as jest.Mock).mockResolvedValue({ valid: true });

    const result = await service.enableTwoFactor('User:123', '123456');
    expect(result.success).toBe(true);
    expect(result.recoveryCodes).toHaveLength(10);
    expect(result.recoveryCodes[0]).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    expect(verify).toHaveBeenCalledWith({
      secret: 'BASE32SECRET',
      token: '123456',
    });
    expect(prisma.user.update).toHaveBeenLastCalledWith({
      where: { id: 'User:123' },
      data: { twoFactorEnabled: true },
    });
    expect(prisma.twoFactorRecoveryCode.createMany).toHaveBeenCalled();
  });

  it('should disable 2FA and remove its secrets and recovery codes', async () => {
    await expect(service.disableTwoFactor('User:123')).resolves.toEqual({
      success: true,
    });

    expect(prisma.twoFactorRecoveryCode.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'User:123' },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'User:123' },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
  });

  it('should consume a recovery code and complete login', async () => {
    const user = {
      id: 'User:123',
      email: 'test@example.com',
      passwordHash: 'hash',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      twoFactorEnabled: true,
      twoFactorSecret: 'encrypted-secret',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jwtService.verifyAsync = jest.fn().mockResolvedValue({
      sub: user.id,
      email: user.email,
      purpose: 'two-factor-login',
    });
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    configService.getOrThrow.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        JWT_2FA_SECRET: 'two-factor-secret',
        JWT_ACCESS_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_ACCESS_TTL: '15m',
        JWT_REFRESH_TTL: '7d',
      };
      return config[key];
    });
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.twoFactorRecoveryCode.findMany.mockResolvedValue([
      { id: 'Recovery:1', codeHash: 'stored-hash' },
    ]);
    prisma.twoFactorRecoveryCode.updateMany.mockResolvedValue({ count: 1 });
    jest.spyOn(require('bcrypt'), 'compare').mockResolvedValueOnce(true);

    const result = await service.verifyTwoFactor(
      'challenge-token',
      'ABCDE-23456',
      { headers: {}, ip: '127.0.0.1' } as Request,
    );

    expect(result.accessToken).toBe('access-token');
    expect(prisma.twoFactorRecoveryCode.updateMany).toHaveBeenCalledWith({
      where: { id: 'Recovery:1', usedAt: null },
      data: { usedAt: expect.any(Date) },
    });
  });
});
