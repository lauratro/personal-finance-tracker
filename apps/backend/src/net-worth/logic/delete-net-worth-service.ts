import { Injectable } from "@nestjs/common";    
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DeleteNetWorthService{
    constructor(private readonly prisma: PrismaService) {}
    async execute(snapshotId: string) {
        return this.prisma.netWorthSnapshot.delete({
            where: { id: snapshotId },   
        })
    }
}