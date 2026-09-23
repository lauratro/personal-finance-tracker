import { Injectable, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNetWorthDto } from '../dto/create-net-worth.dto';

@Injectable()
export class CreateNetWorthService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateNetWorthDto) {
    const inputDate = new Date(dto.monthStart);

    const normalizedMonthStart = new Date(
      Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), 1),
    );
    const existingSnapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        userId: userId,
        monthStart: normalizedMonthStart,
      },
    });

    if (existingSnapshot) {
      throw new ConflictException(
        'A net worth snapshot already exists for this month',
      );
    }

    return this.prisma.netWorthSnapshot.create({
      data: {
        userId,
        monthStart: normalizedMonthStart,
        items: {
          create: dto.items.map((item) => ({
            name: item.name,
            category: item.category,
            value: new Prisma.Decimal(item.value),
          })),
        },
      },
      include: { items: true },
    });
  }
}
