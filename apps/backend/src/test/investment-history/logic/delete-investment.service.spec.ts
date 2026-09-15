import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteInvestmentService } from '../../../main/investment-history/logic/delete-investment.service';
import {
  createInvestmentPrismaMock,
  InvestmentPrismaMock,
} from '../mocks/investment-prisma.mock';
import { NotFoundException } from '@nestjs/common';
import { CreateInvestmentHistoryDto } from '../../../main/investment-history/dto/create-investment-history.dto';

describe('DeleteInvestmentService', () => {
  let service: DeleteInvestmentService;
  let prisma: InvestmentPrismaMock;

  beforeEach(() => {
    prisma = createInvestmentPrismaMock();

    service = new DeleteInvestmentService(prisma as unknown as PrismaService);
  });

  it('should delete an investment with the correct id', async () => {
    const userId = 'user-123';
    const investmentId = 'investment-1';

    prisma.investment.deleteMany.mockResolvedValue({ count: 1 });

    await service.execute(investmentId, userId);

    expect(prisma.investment.deleteMany).toHaveBeenCalledWith({
      where: {
        id: investmentId,
        userId,
      },
    });
  });

  it('should reject deletion when the investment belongs to another user', async () => {
    const investmentId = 'investment-123';
    const ownerUserId = 'User:A';
    const authenticatedUserId = 'User:B';

    prisma.investment.deleteMany.mockResolvedValue({
      count: 0,
    });

    await expect(
      service.execute(investmentId, authenticatedUserId),
    ).rejects.toThrow('Investment not found');

    expect(prisma.investment.deleteMany).toHaveBeenCalledWith({
      where: {
        id: investmentId,
        userId: authenticatedUserId,
      },
    });
  });
});
