export const createAuthPrismaMock = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },

  refreshToken: {
    create: jest.fn(),
  },
});

export type AuthPrismaMock = ReturnType<typeof createAuthPrismaMock>;
