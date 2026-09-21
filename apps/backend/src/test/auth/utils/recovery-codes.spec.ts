import {
  generateRecoveryCodes,
  normalizeRecoveryCode,
} from '../../../main/auth/utils/recovery-codes';

describe('recovery codes', () => {
  it('generates ten unique human-readable codes', () => {
    const codes = generateRecoveryCodes();

    expect(codes).toHaveLength(10);
    expect(new Set(codes).size).toBe(10);
    codes.forEach((code) => expect(code).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/));
  });

  it('normalizes user input', () => {
    expect(normalizeRecoveryCode('  abcde-23456 ')).toBe('ABCDE-23456');
  });
});
