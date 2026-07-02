import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './logic/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { AuthenticatedRequestUser } from './types/authenticated-request-user.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from './logic/update-user.service';
import { Request, Response } from 'express';
import {REFRESH_COOKIE_OPTIONS, REFRESH_COOKIE_NAME} from "./utils/auth.constants";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly updateUserService: UpdateUserService,
  ) {}

@Post('register')
async register(
  @Body() dto: RegisterDto,
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.register(dto);

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    REFRESH_COOKIE_OPTIONS,
  );

  return {
    user: result.user,
    accessToken: result.accessToken,
  };
}

@HttpCode(HttpStatus.OK)
@Post('login')
async login(
  @Body() dto: LoginDto,
  @Req() req: Request,
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.login(dto, req);

  if ('requiresTwoFactor' in result) {
    return result;
  }

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    REFRESH_COOKIE_OPTIONS,
  );

  return {
    user: result.user,
    accessToken: result.accessToken,
  };
}

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = user.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refreshTokens(user.sub, user.email, refreshToken);

    res.cookie(
      REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('2fa/verify')
  async verifyTwoFactor(@Body() dto: VerifyTwoFactorDto) {
    return this.authService.verifyTwoFactor(dto.email, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.updateUserService.execute(userId, dto);
  }
}
