import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DeleteNetWorthService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(userId: string, snapshotId: string) {
    const snapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        userId: userId,
        id: snapshotId,
      },
    });

    if (!snapshot) {
      throw new NotFoundException(' Net Worth snapshot not found');
    }
    return this.prisma.netWorthSnapshot.delete({
      where: { id: snapshotId },
    });
  }
}
