import {
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { randomUUID } from 'crypto';
import { hashData } from '../utils/hashData';


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
  
    const passwordHash = await hashData(dto.password);
  
    const user = await this.prisma.user.create({
      data: {
        id: `User:${randomUUID()}`,
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

  async refreshTokens(userId: string, email: string, refreshToken: string) {
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    const tokenMatches = await Promise.all(
      activeTokens.map((storedToken) =>
        bcrypt.compare(refreshToken, storedToken.tokenHash),
      ),
    );
    const matchedToken = activeTokens[tokenMatches.findIndex(Boolean)];

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.issueTokens(userId, email);
    const tokenHash = await hashData(tokens.refreshToken);

    await this.prisma.$transaction(async (transaction) => {
      const revoked = await transaction.refreshToken.updateMany({
        where: {
          id: matchedToken.id,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      if (revoked.count !== 1) {
        throw new UnauthorizedException('Refresh token already used');
      }

      await transaction.refreshToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt: this.getRefreshExpiryDate(),
        },
      });
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  async verifyTwoFactor(_email: string, _code: string) {
    throw new NotImplementedException('verifyTwoFactor() not implemented yet');
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
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
  }

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload = { sub: userId, email };
  
    const accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  
    const accessTtl =
      this.configService.getOrThrow<string>('JWT_ACCESS_TTL') as any;
    const refreshTtl =
      this.configService.getOrThrow<string>('JWT_REFRESH_TTL') as any;
  
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
    const tokenHash = await hashData(refreshToken);
  
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
