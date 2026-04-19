import {
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
  
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
  
    const passwordHash = await this.hashData(dto.password);
  
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  
    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
  
    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto, req: Request) {
    const email = dto.email.toLowerCase();
  
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
  
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    if (user.twoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        message: 'Two-factor authentication is required.',
      };
    }
  
    const safeUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  
    if (!safeUser) {
      throw new UnauthorizedException('User not found');
    }
  
    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken, req);
  
    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refreshTokens(userId: string, email: string, _refreshToken: string) {
    return this.issueTokens(userId, email);
  }

  async logout(_userId: string) {
    return { success: true };
  }

  async verifyTwoFactor(_email: string, _code: string) {
    throw new NotImplementedException('verifyTwoFactor() not implemented yet');
  }

  async getProfile(userId: string) {
    return { id: userId };
  }

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload = { sub: userId, email };
  
    const accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  
    const accessTtl =
      this.configService.getOrThrow<string>('JWT_ACCESS_TTL') as StringValue;
    const refreshTtl =
      this.configService.getOrThrow<string>('JWT_REFRESH_TTL') as StringValue;
  
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTtl,
      }),
    ]);
  
    return { accessToken, refreshToken };
  }
  
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    req?: Request,
  ) {
    const tokenHash = await this.hashData(refreshToken);
  
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: this.getRefreshExpiryDate(),
        userAgent: this.extractHeader(req, 'user-agent'),
        ipAddress: this.extractIp(req),
      },
    });
  }
  
  private async hashData(data: string) {
    const saltRounds = Number(
      this.configService.get<string>('BCRYPT_ROUNDS') ?? 10,
    );
    return bcrypt.hash(data, saltRounds);
  }
  
  private getRefreshExpiryDate() {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  private extractHeader(req: Request | undefined, key: string): string | null {
    if (!req || !(req as any).headers) {
      return null;
    }
  
    const value = req.headers[key];
    if (!value) {
      return null;
    }
  
    return Array.isArray(value) ? value[0] : value;
  }
  
  private extractIp(req: Request | undefined): string | null {
    if (!req) {
      return null;
    }
  
    return req.ip ?? null;
  }
}