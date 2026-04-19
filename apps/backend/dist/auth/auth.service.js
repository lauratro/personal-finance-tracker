"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email is already in use');
        }
        const passwordHash = await this.hashData(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                twoFactorEnabled: true,
            },
        });
        const tokens = await this.issueTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken);
        return {
            user,
            ...tokens,
        };
    }
    async login(dto, req) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.twoFactorEnabled) {
            return {
                requiresTwoFactor: true,
                message: '2FA is enabled. Verify the TOTP code before issuing final tokens.',
            };
        }
        const tokens = await this.issueTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken, req);
        return {
            user: this.toSafeUser(user),
            ...tokens,
        };
    }
    async refreshTokens(userId, email, refreshToken) {
        const activeToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!activeToken) {
            throw new common_1.UnauthorizedException('Refresh token is not active');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, activeToken.tokenHash);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.issueTokens(userId, email);
        await this.prisma.refreshToken.update({
            where: { id: activeToken.id },
            data: { revokedAt: new Date() },
        });
        await this.storeRefreshToken(userId, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
        return { success: true };
    }
    async verifyTwoFactor(email, code) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                twoFactorEnabled: true,
                twoFactorSecret: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.twoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('2FA is not enabled for this user');
        }
        if (!code || code.length < 6) {
            throw new common_1.BadRequestException('Invalid 2FA code format');
        }
        const tokens = await this.issueTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken);
        return {
            verified: true,
            ...tokens,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
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
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async issueTokens(userId, email) {
        const payload = { sub: userId, email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_TTL') ?? '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_TTL') ?? '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, refreshToken, req) {
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
    async hashData(data) {
        const saltRounds = Number(this.configService.get('BCRYPT_ROUNDS') ?? 10);
        return bcrypt.hash(data, saltRounds);
    }
    getRefreshExpiryDate() {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    extractHeader(req, key) {
        if (!req || !req.headers) {
            return null;
        }
        const headerValue = req.headers[key];
        if (!headerValue) {
            return null;
        }
        return Array.isArray(headerValue) ? headerValue.join(', ') : String(headerValue);
    }
    extractIp(req) {
        if (!req) {
            return null;
        }
        const maybeIp = req.ip ?? req.socket?.remoteAddress ?? null;
        return maybeIp ? String(maybeIp) : null;
    }
    toSafeUser(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map