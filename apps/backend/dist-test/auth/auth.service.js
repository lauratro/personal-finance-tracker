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
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
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
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await this.hashData(dto.password);
        const user = await this.prisma.user.create({
            data: {
                id: `User:${(0, crypto_1.randomUUID)()}`,
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
    async login(dto, req) {
        const email = dto.email.toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
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
            throw new common_1.UnauthorizedException('User not found');
        }
        const tokens = await this.issueTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken, req);
        return {
            user: safeUser,
            ...tokens,
        };
    }
    async refreshTokens(userId, email, _refreshToken) {
        return this.issueTokens(userId, email);
    }
    async logout(_userId) {
        return { success: true };
    }
    async verifyTwoFactor(_email, _code) {
        throw new common_1.NotImplementedException('verifyTwoFactor() not implemented yet');
    }
    async getProfile(userId) {
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
    async issueTokens(userId, email) {
        const payload = { sub: userId, email };
        const accessSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
        const refreshSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
        const accessTtl = this.configService.getOrThrow('JWT_ACCESS_TTL');
        const refreshTtl = this.configService.getOrThrow('JWT_REFRESH_TTL');
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
        const value = req.headers[key];
        if (!value) {
            return null;
        }
        return Array.isArray(value) ? value[0] : value;
    }
    extractIp(req) {
        if (!req) {
            return null;
        }
        return req.ip ?? null;
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