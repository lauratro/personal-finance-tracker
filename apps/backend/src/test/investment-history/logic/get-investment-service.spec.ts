import { PrismaService } from "../../../prisma/prisma.service";
import { GetInvestmentService } from "../../../main/investment-history/logic/get-investment.service";
import { createInvestmentPrismaMock, InvestmentPrismaMock } from '../mocks/investment-prisma.mock';

describe('GetInvestmentService', () => {

    let service: GetInvestmentService;
    let prisma: InvestmentPrismaMock;
  

    beforeEach(() => {

        prisma = createInvestmentPrismaMock();

        service = new GetInvestmentService(
            prisma as unknown as PrismaService,
        );

    });

    it('should return an investment with the correct id and userId', async () => {
        const userId = "user-123";
        const investmentId = "investment-1";

        prisma.investment.findFirst.mockResolvedValue({ id: investmentId, userId });
        const result = await service.execute(investmentId, userId);

        expect(prisma.investment.findFirst).toHaveBeenCalledWith({
            where: { id: investmentId, userId },
        });
        expect(result).toEqual({ id: investmentId, userId });
    });



    //-----------------------------------------
    // Test Data
    //-----------------------------------------

    const userId = "user-123";

    const investmentId = "investment-1";

    const investment = {

        id: investmentId,

        userId,

        name: "Infineon",

        quantity: 10,

    };
});