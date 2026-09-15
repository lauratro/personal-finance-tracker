import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNetWorthItemDto } from '../dto/create-net-worth.dto';

@Injectable()
export class CreateNetWorthItemService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    netWorthSnapshotId: string,
    dto: CreateNetWorthItemDto,
  ) {
    const snapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        id: netWorthSnapshotId,
        userId,
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Net worth snapshot not found');
    }

    return this.prisma.netWorthItem.create({
      data: {
        snapshotId: netWorthSnapshotId,
        name: dto.name,
        value: new Prisma.Decimal(dto.value),
        category: dto.category,
        createdAt: new Date(),
      },
    });
  }
}
