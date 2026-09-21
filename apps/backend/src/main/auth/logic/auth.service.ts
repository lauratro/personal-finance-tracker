import {
  ConflictException,
  Injectable,
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
import { generateSecret, generateURI, verify } from 'otplib';
import * as QRCode from 'qrcode';
import {
  decryptTwoFactorSecret,
  encryptTwoFactorSecret,
} from '../utils/two-factor-secret';
import {
  generateRecoveryCodes,
  normalizeRecoveryCode,
} from '../utils/recovery-codes';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type TwoFactorChallenge = {
  requiresTwoFactor: true;
  twoFactorToken: string;
  message: string;
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
      const challenge: TwoFactorChallenge = {
        requiresTwoFactor: true,
        twoFactorToken: await this.issueTwoFactorToken(user.id, user.email),
        message: 'Two-factor authentication is required.',
      };

      return challenge;
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

  async setupTwoFactor(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new ConflictException(
        'Two-factor authentication is already enabled',
      );
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: 'Personal Finance Tracker',
      label: user.email,
      secret,
    });
    const encryptedSecret = encryptTwoFactorSecret(
      secret,
      this.getTwoFactorEncryptionKey(),
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: encryptedSecret, twoFactorEnabled: false },
    });

    return {
      secret,
      otpauthUrl,
      qrCodeDataUrl: await QRCode.toDataURL(otpauthUrl),
    };
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.twoFactorSecret || user.twoFactorEnabled) {
      throw new UnauthorizedException('Two-factor setup is not pending');
    }

    const secret = decryptTwoFactorSecret(
      user.twoFactorSecret,
      this.getTwoFactorEncryptionKey(),
    );
    const result = await verify({ secret, token: code });

    if (!result.valid) {
      throw new UnauthorizedException('Invalid authentication code');
    }

    const recoveryCodes = await this.replaceRecoveryCodes(userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { success: true, recoveryCodes };
  }

  async regenerateRecoveryCodes(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.twoFactorEnabled) {
      throw new UnauthorizedException(
        'Two-factor authentication is not enabled',
      );
    }

    return { recoveryCodes: await this.replaceRecoveryCodes(userId) };
  }

  async disableTwoFactor(userId: string) {
    await this.prisma.$transaction([
      this.prisma.twoFactorRecoveryCode.deleteMany({
        where: { userId },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: false, twoFactorSecret: null },
      }),
    ]);

    return { success: true };
  }

  async verifyTwoFactor(twoFactorToken: string, code: string, req: Request) {
    let payload: { sub: string; email: string; purpose?: string };

    try {
      payload = await this.jwtService.verifyAsync(twoFactorToken, {
        secret: this.configService.getOrThrow<string>('JWT_2FA_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired two-factor challenge',
      );
    }

    if (payload.purpose !== 'two-factor-login') {
      throw new UnauthorizedException('Invalid two-factor challenge');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException(
        'Two-factor authentication is not enabled',
      );
    }

    const valid = await this.verifySecondFactor(
      user.id,
      user.twoFactorSecret,
      code,
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid authentication code');
    }

    const tokens = await this.issueTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken, req);

    return {
      user: this.toSafeUser(user),
      ...tokens,
    };
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

    const accessTtl = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TTL',
    ) as any;
    const refreshTtl = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TTL',
    ) as any;

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

  private issueTwoFactorToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, email, purpose: 'two-factor-login' },
      {
        secret: this.configService.getOrThrow<string>('JWT_2FA_SECRET'),
        expiresIn: '5m',
      },
    );
  }

  private getTwoFactorEncryptionKey(): string {
    return this.configService.getOrThrow<string>('TWO_FACTOR_ENCRYPTION_KEY');
  }

  private async replaceRecoveryCodes(userId: string): Promise<string[]> {
    const recoveryCodes = generateRecoveryCodes();
    const codeHashes = await Promise.all(
      recoveryCodes.map((code) => hashData(normalizeRecoveryCode(code))),
    );

    await this.prisma.$transaction([
      this.prisma.twoFactorRecoveryCode.deleteMany({ where: { userId } }),
      this.prisma.twoFactorRecoveryCode.createMany({
        data: codeHashes.map((codeHash) => ({ userId, codeHash })),
      }),
    ]);

    return recoveryCodes;
  }

  private async verifySecondFactor(
    userId: string,
    encryptedSecret: string,
    code: string,
  ): Promise<boolean> {
    if (/^\d{6}$/.test(code)) {
      const secret = decryptTwoFactorSecret(
        encryptedSecret,
        this.getTwoFactorEncryptionKey(),
      );
      return (await verify({ secret, token: code })).valid;
    }

    const normalizedCode = normalizeRecoveryCode(code);
    const activeCodes = await this.prisma.twoFactorRecoveryCode.findMany({
      where: { userId, usedAt: null },
    });
    const matches = await Promise.all(
      activeCodes.map((storedCode) =>
        bcrypt.compare(normalizedCode, storedCode.codeHash),
      ),
    );
    const matchedCode = activeCodes[matches.findIndex(Boolean)];

    if (!matchedCode) return false;

    const consumed = await this.prisma.twoFactorRecoveryCode.updateMany({
      where: { id: matchedCode.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    return consumed.count === 1;
  }

  private toSafeUser(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: unknown;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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
