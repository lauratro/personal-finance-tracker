import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
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
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            twoFactorEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(_dto: LoginDto, _req: Request): Promise<void>;
    refreshTokens(userId: string, email: string, _refreshToken: string): Promise<TokenPair>;
    logout(_userId: string): Promise<{
        success: boolean;
    }>;
    verifyTwoFactor(_email: string, _code: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
    }>;
    private issueTokens;
    private storeRefreshToken;
    private hashData;
    private getRefreshExpiryDate;
    private extractHeader;
    private extractIp;
}
export {};
