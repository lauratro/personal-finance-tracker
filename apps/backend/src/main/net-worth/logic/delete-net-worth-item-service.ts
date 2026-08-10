import { Injectable } from "@nestjs/common";    
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class DeleteNetWorthItemService {
    constructor(private readonly prisma: PrismaService) {}

    async execute( itemId: string) {
        return this.prisma.netWorthItem.delete({
            where: { id: itemId },   
        })
    }
}   