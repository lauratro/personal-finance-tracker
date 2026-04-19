import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';
import { AuthenticatedRequestUser } from './types/authenticated-request-user.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto, req: Request): Promise<{
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
    refresh(user: AuthenticatedRequestUser, _dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    verifyTwoFactor(dto: VerifyTwoFactorDto): Promise<{
        accessToken: string;
        refreshToken: string;
        verified: boolean;
    }>;
    me(userId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        twoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
