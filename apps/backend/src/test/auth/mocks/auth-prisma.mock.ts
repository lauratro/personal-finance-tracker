export const createAuthPrismaMock = () => ({
  $transaction: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },

  refreshToken: {
    create: jest.fn(),
  },

  twoFactorRecoveryCode: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
});

export type AuthPrismaMock = ReturnType<typeof createAuthPrismaMock>;
