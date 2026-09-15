import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateNetWorthDto } from '../dto/update-net-worth.dto';

@Injectable()
export class UpdateNetWorthService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, snapshotId: string, dto: UpdateNetWorthDto) {
    const snapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        id: snapshotId,
        userId,
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Net worth snapshot not found');
    }
    return this.prisma.netWorthSnapshot.update({
      where: { id: snapshotId },
      data: {
        monthStart: new Date(dto.monthStart!),
        updatedAt: new Date(),
      },
    });
  }
}
