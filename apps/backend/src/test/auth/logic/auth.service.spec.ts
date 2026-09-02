import { PrismaService } from '../../../prisma/prisma.service';
import {
  AuthPrismaMock,
  createAuthPrismaMock,
} from '../mocks/auth-prisma.mock';
import { AuthService } from '../../../main/auth/logic/auth.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Request } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: AuthPrismaMock;
  let jwtService: any;
  let configService: any;

  beforeEach(() => {
    prisma = createAuthPrismaMock();
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
});
