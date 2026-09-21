import { randomBytes } from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_COUNT = 10;
const CODE_LENGTH = 10;

export function generateRecoveryCodes(): string[] {
  return Array.from({ length: CODE_COUNT }, () => {
    const bytes = randomBytes(CODE_LENGTH);
    const value = Array.from(
      bytes,
      (byte) => ALPHABET[byte % ALPHABET.length],
    ).join('');

    return `${value.slice(0, 5)}-${value.slice(5)}`;
  });
}

export function normalizeRecoveryCode(code: string): string {
  const value = code.trim().toUpperCase().replace(/-/g, '');
  return `${value.slice(0, 5)}-${value.slice(5)}`;
}
