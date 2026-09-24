import { registerAs } from '@nestjs/config';
import ms = require('ms');

const TWO_FACTOR_TTL_SECONDS = 5 * 60;

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function duration(name: string): { ttlSeconds: number; ttlMs: number } {
  const value = required(name);
  const ttlMs = ms(value);

  if (
    typeof ttlMs !== 'number' ||
    !Number.isFinite(ttlMs) ||
    ttlMs < 1000 ||
    ttlMs % 1000 !== 0
  ) {
    throw new Error(
      `${name} must be a positive duration in whole seconds, for example "15m" or "7d"`,
    );
  }

  return { ttlSeconds: ttlMs / 1000, ttlMs };
}

export const authConfig = registerAs('auth', () => {
  const accessTtl = duration('JWT_ACCESS_TTL');
  const refreshTtl = duration('JWT_REFRESH_TTL');

  return {
    access: {
      secret: required('JWT_ACCESS_SECRET'),
      ttlSeconds: accessTtl.ttlSeconds,
    },
    refresh: {
      secret: required('JWT_REFRESH_SECRET'),
      ttlSeconds: refreshTtl.ttlSeconds,
      ttlMs: refreshTtl.ttlMs,
    },
    twoFactor: {
      secret: required('JWT_2FA_SECRET'),
      encryptionKey: required('TWO_FACTOR_ENCRYPTION_KEY'),
      ttlSeconds: TWO_FACTOR_TTL_SECONDS,
    },
  };
});
