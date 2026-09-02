import * as bcrypt from 'bcrypt';

const DEFAULT_BCRYPT_ROUNDS = 10;

export async function hashData(data: string): Promise<string> {
  const saltRounds = Number(process.env.BCRYPT_ROUNDS ?? DEFAULT_BCRYPT_ROUNDS);

  if (!Number.isInteger(saltRounds) || saltRounds < 4 || saltRounds > 31) {
    throw new Error('BCRYPT_ROUNDS must be an integer between 4 and 31');
  }

  return bcrypt.hash(data, saltRounds);
}
