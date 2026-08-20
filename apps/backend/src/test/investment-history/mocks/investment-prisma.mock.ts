export function createInvestmentPrismaMock() {
    return {
        investment: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            deleteMany: jest.fn(),
        },
    };
}

export type InvestmentPrismaMock =
    ReturnType<typeof createInvestmentPrismaMock>;