import { Injectable } from "@nestjs/common";    
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateNetWorthItemDto } from "../dto/update-net-worth.dto";

@Injectable()
export class UpdateNetWorthItemService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(itemId: string, dto: UpdateNetWorthItemDto) { 
        return this.prisma.netWorthItem.update({
            where: { id: itemId },
            data: {
                name: dto.name,
                value: dto.value,
                category: dto.category,
                updatedAt: new Date(),
            }
        })      
    }
}