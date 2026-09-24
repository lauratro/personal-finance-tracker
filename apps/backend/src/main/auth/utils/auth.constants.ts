import { CookieOptions } from 'express';

export const REFRESH_COOKIE_NAME = 'refresh_token';

export const REFRESH_COOKIE_PATH = '/api/auth';

export const getRefreshCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: REFRESH_COOKIE_PATH,
  maxAge,
});
