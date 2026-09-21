import {
  decryptTwoFactorSecret,
  encryptTwoFactorSecret,
} from '../../../main/auth/utils/two-factor-secret';

describe('two-factor secret encryption', () => {
  const key = Buffer.alloc(32, 42).toString('base64');

  it('encrypts and decrypts a secret using authenticated encryption', () => {
    const encrypted = encryptTwoFactorSecret('BASE32SECRET', key);

    expect(encrypted).not.toContain('BASE32SECRET');
    expect(decryptTwoFactorSecret(encrypted, key)).toBe('BASE32SECRET');
  });

  it('rejects an invalid encryption key', () => {
    expect(() => encryptTwoFactorSecret('secret', 'not-a-valid-key')).toThrow(
      'TWO_FACTOR_ENCRYPTION_KEY must be 32 bytes encoded as base64',
    );
  });
});
