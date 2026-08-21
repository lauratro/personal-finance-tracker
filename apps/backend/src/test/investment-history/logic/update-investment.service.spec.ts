import { UpdateInvestmentService } from '../../../main/investment-history/logic/update-investment.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createInvestmentPrismaMock, InvestmentPrismaMock } from '../mocks/investment-prisma.mock';
import { Prisma } from '@prisma/client';
import { UpdateInvestmentHistoryDto } from '../../../main/investment-history/dto/update-investment-history.dto';

describe('UpdateInvestmentService', () => {
    let service: UpdateInvestmentService;
    let prisma: InvestmentPrismaMock;

    beforeEach(() => {
        prisma = createInvestmentPrismaMock();

        service = new UpdateInvestmentService(
            prisma as unknown as PrismaService,
        );
    });


    it('should throw NotFoundException if investment does not exist', async () => {
        const userId = 'user-123';
        const investmentId = 'investment-1';
        const dto = {
            quantity: 20,
            totalAmountInvested: 1000,
            saleDate: null,
            salePrice: null,
            taxes: null,
        };

        prisma.investment.findFirst.mockResolvedValue(null);

        await expect(service.execute(investmentId, userId, dto)).rejects.toThrow('Investment not found');

        expect(prisma.investment.findFirst).toHaveBeenCalledWith({
            where: {
                id: investmentId,
                userId,
            },
        });
    });



     it('should update an investment with the correct id and userId', async () => {
        const userId = 'user-123';
        const investmentId = 'investment-1';
       const dto: UpdateInvestmentHistoryDto = {
          quantity: 20,
          totalAmountInvested: 1002,
          saleDate: null,
         salePrice: null,
         taxes: null,
         };

        const existingInvestment = {
        id: investmentId,
        userId,
        quantity: 10,
        totalAmountInvested: 1000,
        saleDate: null,
        salePrice: null,
        taxes: null,
         };

        prisma.investment.findFirst.mockResolvedValue(existingInvestment);
        prisma.investment.update.mockResolvedValue({investmentId, userId, dto });

        await service.execute(investmentId, userId, dto);

    expect(prisma.investment.update).toHaveBeenCalledWith({
  where: { id: investmentId },
  data: {
    quantity: new Prisma.Decimal(20),
    totalAmountInvested: new Prisma.Decimal(1002),
    saleDate: null,
    salePrice: null,
    taxes: null,
    income: null,
    percentageIncome: null,
  },
});

        expect(prisma.investment.findFirst).toHaveBeenCalledWith({
         where: {
        id: investmentId,
        userId,
           },
          });
    }) 

})