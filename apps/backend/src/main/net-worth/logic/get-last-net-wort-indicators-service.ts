import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetLastNetWorthIndicatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const lastSnapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: { userId },
      orderBy: { monthStart: 'desc' },
      include: { items: true },
    });

    if (!lastSnapshot) {
      return {
        lastSnapshot: null,
        previousSnapshot: null,
      };
    }

    const lastTotal = lastSnapshot.items.reduce(
      (sum, item) => sum + Number(item.value),
      0,
    );

    const previousSnapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        userId,
        monthStart: {
          lt: lastSnapshot.monthStart,
          gte: new Date(
            lastSnapshot.monthStart.getFullYear(),
            lastSnapshot.monthStart.getMonth() - 1,
            1,
          ),
        },
      },
      orderBy: { monthStart: 'desc' },
      include: { items: true },
    });

    const previousTotal = previousSnapshot
      ? previousSnapshot.items.reduce(
          (sum, item) => sum + Number(item.value),
          0,
        )
      : null;
    return {
      lastSnapshot: {
        ...lastSnapshot,
        total: lastTotal,
      },
      previousSnapshot: previousSnapshot
        ? {
            ...previousSnapshot,
            total: previousTotal,
          }
        : null,
    };
  }
}