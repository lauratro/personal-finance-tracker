import { authConfig } from '../../../main/auth/config/auth.config';

describe('authConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_ACCESS_TTL: '15m',
      JWT_REFRESH_TTL: '7d',
      JWT_2FA_SECRET: 'two-factor-secret',
      TWO_FACTOR_ENCRYPTION_KEY: 'encryption-key',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('parses authentication settings into the structured namespace', () => {
    expect(authConfig()).toEqual({
      access: {
        secret: 'access-secret',
        ttlSeconds: 15 * 60,
      },
      refresh: {
        secret: 'refresh-secret',
        ttlSeconds: 7 * 24 * 60 * 60,
        ttlMs: 7 * 24 * 60 * 60 * 1000,
      },
      twoFactor: {
        secret: 'two-factor-secret',
        encryptionKey: 'encryption-key',
        ttlSeconds: 5 * 60,
      },
    });
  });

  it.each([
    ['JWT_ACCESS_TTL', 'invalid'],
    ['JWT_REFRESH_TTL', '0s'],
    ['JWT_REFRESH_TTL', '1500ms'],
  ])('rejects invalid %s values', (name, value) => {
    process.env[name] = value;

    expect(() => authConfig()).toThrow(`${name} must be a positive duration`);
  });

  it.each([
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_ACCESS_TTL',
    'JWT_REFRESH_TTL',
    'JWT_2FA_SECRET',
    'TWO_FACTOR_ENCRYPTION_KEY',
  ])('rejects a missing %s value', (name) => {
    delete process.env[name];

    expect(() => authConfig()).toThrow(`${name} is required`);
  });
});
