import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateNetWorthItemDto } from '../dto/update-net-worth.dto';

@Injectable()
export class UpdateNetWorthItemService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, itemId: string, dto: UpdateNetWorthItemDto) {
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

    return this.prisma.netWorthItem.update({
      where: { id: itemId },
      data: {
        name: dto.name,
        value: dto.value,
        category: dto.category,
        updatedAt: new Date(),
      },
    });
  }
}
