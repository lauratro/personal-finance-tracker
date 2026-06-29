import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNetWorthItemDto } from '../dto/create-net-worth.dto';

@Injectable()
export class CreateNetWorthItemService {
    constructor(private readonly prisma: PrismaService) {}

async execute(userId: string, netWorthSnapshotId: string, dto: CreateNetWorthItemDto) {
    return this.prisma.netWorthItem.create({
            data: {
                snapshotId: netWorthSnapshotId,
                name: dto.name,
                value: new Prisma.Decimal(dto.value),
                category: dto.category,
                }
            },
        )
    }

}