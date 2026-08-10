import { Injectable } from "@nestjs/common";                
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateNetWorthDto } from "../dto/update-net-worth.dto";


@Injectable()
export class UpdateNetWorthService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(snapshotId: string
        , dto: UpdateNetWorthDto) {
        return this.prisma.netWorthSnapshot.update({
            where: { id: snapshotId },
            data: {
                monthStart: new Date(dto.monthStart!),
                updatedAt: new Date(),
            }
        })
    }
}