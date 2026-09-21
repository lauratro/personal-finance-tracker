import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';

function decodeKey(encodedKey: string): Buffer {
  const key = Buffer.from(encodedKey, 'base64');

  if (key.length !== 32) {
    throw new Error('TWO_FACTOR_ENCRYPTION_KEY must be 32 bytes encoded as base64');
  }

  return key;
}

export function encryptTwoFactorSecret(secret: string, encodedKey: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, decodeKey(encodedKey), iv);
  const ciphertext = Buffer.concat([
    cipher.update(secret, 'utf8'),
    cipher.final(),
  ]);

  return [
    VERSION,
    iv.toString('base64'),
    cipher.getAuthTag().toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptTwoFactorSecret(value: string, encodedKey: string): string {
  const [version, iv, authTag, ciphertext] = value.split(':');

  if (version !== VERSION || !iv || !authTag || !ciphertext) {
    throw new Error('Invalid encrypted two-factor secret');
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    decodeKey(encodedKey),
    Buffer.from(iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
