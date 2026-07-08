import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";    
import { SortDirectionType } from "../schema/types/sortDirectionTypes";

@Injectable()
export class GetNetWorthsService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(userId: string, sortDirection: SortDirectionType) {
        return this.prisma.netWorthSnapshot.findMany({
            where: { userId },
            orderBy: {monthStart: sortDirection},
            include: {
                items: true,
            }
        })
    }
}                              