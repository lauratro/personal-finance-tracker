import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
type TokenPair = {
    accessToken: string;
    refreshToken: string;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            id: string;
            twoFactorEnabled: boolean;
        };
    }>;
    login(dto: LoginDto, req?: Request): Promise<{
        requiresTwoFactor: boolean;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            twoFactorEnabled: any;
            createdAt: any;
            updatedAt: any;
        };
        requiresTwoFactor?: undefined;
        message?: undefined;
    }>;
    refreshTokens(userId: string, email: string, refreshToken: string): Promise<TokenPair>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    verifyTwoFactor(email: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        verified: boolean;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        twoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private issueTokens;
    private storeRefreshToken;
    private hashData;
    private getRefreshExpiryDate;
    private extractHeader;
    private extractIp;
    private toSafeUser;
}
export {};
