import {SearchInvestmentByYearsService} from '../../../main/investment-history/logic/search-investment-by-years.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { createInvestmentPrismaMock, InvestmentPrismaMock } from '../mocks/investment-prisma.mock';

describe('SearchInvestmentByYearsService', () => {
    let service: SearchInvestmentByYearsService;
    let prisma: InvestmentPrismaMock;

    beforeEach(() => {
        prisma = createInvestmentPrismaMock();

        service = new SearchInvestmentByYearsService(
            prisma as unknown as PrismaService,
        );
    });

    it('should return a list of investments for the given userId and date range', async () => {
        const userId = 'user-123';
        const fromDate = new Date('2022-01-01');
        const untilDate = new Date('2022-12-31');

        const investments = [
            { id: 'investment-1', userId, name: 'Infineon', boughtDate: new Date('2022-03-15') },
            { id: 'investment-2', userId, name: 'Apple', boughtDate: new Date('2022-07-20') },
        ];

        prisma.investment.findMany.mockResolvedValue(investments);

        const result = await service.search(userId, fromDate, untilDate);

        expect(prisma.investment.findMany).toHaveBeenCalledWith({
            where: {
                boughtDate: {
                    gte: fromDate,
                    lt: untilDate },
                userId: userId
            },
             orderBy: {
              boughtDate: 'asc',
              },
        });
        expect(result).toEqual(investments);
    });
});