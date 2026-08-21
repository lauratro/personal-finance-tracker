import {ListInvestmentsService} from '../../../main/investment-history/logic/list-investments.service';
import {PrismaService} from '../../../prisma/prisma.service';
import {createInvestmentPrismaMock, InvestmentPrismaMock} from '../mocks/investment-prisma.mock';

describe('ListInvestmentService', () => {
    let service: ListInvestmentsService;
    let prisma: InvestmentPrismaMock;

    beforeEach(() => {
        prisma = createInvestmentPrismaMock();

        service = new ListInvestmentsService(
            prisma as unknown as PrismaService,
        );

    });

    it('should return a list of investments for the given userId', async () => {
        const userId = 'user-123';

        const investments = [
            { boughtDate: new Date('2022-03-16'), id: 'investment-1', userId, name: 'Infineon'},
            { boughtDate: new Date('2022-03-15'), id: 'investment-2', userId, name: 'Apple' },
        ];

        prisma.investment.findMany.mockResolvedValue(investments);

        const result = await service.execute(userId);

        expect(prisma.investment.findMany).toHaveBeenCalledWith({
            where: { userId},
             orderBy: { boughtDate: 'desc' },
        });
        expect(result).toEqual(investments);
    }); 



})