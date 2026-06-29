import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";    


@Injectable()
export class GetNetWorthService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(userId: string) {
        return this.prisma.netWorthSnapshot.findMany({
            where: { userId },
            orderBy: {monthStart: 'desc'},
            include: {
                items: true,
            }
        })
    }
}                              