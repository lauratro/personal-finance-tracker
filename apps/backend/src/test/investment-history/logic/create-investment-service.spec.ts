import { Prisma } from '@prisma/client';
import { CreateInvestmentService } from '../../../main/investment-history/logic/create-investment.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('CreateInvestmentService', () => {
  let service: CreateInvestmentService;
  let prisma: {
    investment: {
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      investment: {
        create: jest.fn(),
      },
    };

    service = new CreateInvestmentService(
      prisma as unknown as PrismaService,
    );
  });

  it('should create an investment with the correct data', async () => {
    const userId = 'user-123';

    const dto = {
      name: 'Infineon',
      assetType: 'STOCK',
      boughtDate: '2026-08-01',
      totalAmountInvested: 1000,
      costSingleStock: 100,
      quantity: 10,
      plannedPriceToSell: 120,
    };

    const createdInvestment = {
      id: 'investment-1',
      userId,
      ...dto,
    };

    prisma.investment.create.mockResolvedValue(createdInvestment);

    const result = await service.execute(userId, dto as any);

    expect(prisma.investment.create).toHaveBeenCalledWith({
      data: {
        userId,
        name: dto.name,
        assetType: dto.assetType,
        boughtDate: new Date(dto.boughtDate),
        totalAmountInvested: new Prisma.Decimal(dto.totalAmountInvested),
        costSingleStock: new Prisma.Decimal(dto.costSingleStock),
        quantity: new Prisma.Decimal(dto.quantity),
        plannedPriceToSell: new Prisma.Decimal(dto.plannedPriceToSell),
      },
    });

    expect(result).toEqual(createdInvestment);
  });

  it('should save plannedPriceToSell as null when it is not provided', async () => {
    const userId = 'user-123';

    const dto = {
      name: 'Infineon',
      assetType: 'STOCK',
      boughtDate: '2026-08-01',
      totalAmountInvested: 1000,
      costSingleStock: 100,
      quantity: 10,
    };

    prisma.investment.create.mockResolvedValue({
      id: 'investment-1',
    });

    await service.execute(userId, dto as any);

    expect(prisma.investment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        plannedPriceToSell: null,
      }),
    });
  });
});