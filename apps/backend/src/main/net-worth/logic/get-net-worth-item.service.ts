import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetNetWorthItemService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, itemId: string) {
    const item = await this.prisma.netWorthItem.findFirst({
      where: {
        id: itemId,
        snapshot: {
          userId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return this.prisma.netWorthItem.findUnique({
      where: { id: itemId },
    });
  }
}
