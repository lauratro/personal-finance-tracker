import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class GetNetWorthBasedOnYearService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(userId: string, year: number) {
        return this.prisma.netWorthSnapshot.findMany({
            where: {
                userId,
                monthStart: {
                    gte: new Date(year - 1, 12, 31),
                    lt: new Date(year + 1, 0, 1),
                },
            },
            orderBy: {monthStart: 'desc'},
            include: {
                items: true,
            }
        })
    }
}