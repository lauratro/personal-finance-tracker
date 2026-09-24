import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './logic/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserId } from './decorators/current-user-id.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';
import { EnableTwoFactorDto } from './dto/enable-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { AuthenticatedRequestUser } from './types/authenticated-request-user.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from './logic/update-user.service';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import {
  getRefreshCookieOptions,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from './utils/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly updateUserService: UpdateUserService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  private get refreshCookieOptions() {
    return getRefreshCookieOptions(this.config.refresh.ttlMs);
  }

@Post('register')
async register(
  @Body() dto: RegisterDto,
  @Res({ passthrough: true }) res: Response,
) {
  const result = await this.authService.register(dto);

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    this.refreshCookieOptions,
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
    this.refreshCookieOptions,
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
      this.refreshCookieOptions,
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

@HttpCode(HttpStatus.OK)
@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(
  @CurrentUserId() userId: string,
  @Res({ passthrough: true }) res: Response,
) {
  await this.authService.logout(userId);

  res.clearCookie(REFRESH_COOKIE_NAME, {
    path: REFRESH_COOKIE_PATH,
  });

  return { success: true };
}

  @HttpCode(HttpStatus.OK)
  @Post('2fa/verify')
  async verifyTwoFactor(
    @Body() dto: VerifyTwoFactorDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyTwoFactor(
      dto.twoFactorToken,
      dto.code,
      req,
    );

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      this.refreshCookieOptions,
    );

    return { user: result.user, accessToken: result.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/setup')
  async setupTwoFactor(@CurrentUserId() userId: string) {
    return this.authService.setupTwoFactor(userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enableTwoFactor(
    @CurrentUserId() userId: string,
    @Body() dto: EnableTwoFactorDto,
  ) {
    return this.authService.enableTwoFactor(userId, dto.code);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('2fa/recovery-codes/regenerate')
  async regenerateRecoveryCodes(@CurrentUserId() userId: string) {
    return this.authService.regenerateRecoveryCodes(userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disableTwoFactor(@CurrentUserId() userId: string) {
    return this.authService.disableTwoFactor(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUserId() userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.updateUserService.execute(userId, dto);
  }
}
