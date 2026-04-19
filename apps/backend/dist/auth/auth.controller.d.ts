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
    login(dto: LoginDto, req: Request): Promise<{
        requiresTwoFactor: boolean;
        message: string;
    } | {
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
    verifyTwoFactor(dto: VerifyTwoFactorDto): Promise<void>;
    me(userId: string): Promise<{
        id: string;
    }>;
}
