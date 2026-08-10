import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetNetWorthBasedOnYearService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    year: number,
    includePreviousYear: boolean,
  ) {
    const yearStart = new Date(year, 0, 1);
    const nextYearStart = new Date(year + 1, 0, 1);

    const snapshots = await this.prisma.netWorthSnapshot.findMany({
      where: {
        userId,
        monthStart: {
          gte: yearStart,
          lt: nextYearStart,
        },
      },
      orderBy: {
        monthStart: 'asc',
      },
      include: {
        items: true,
      },
    });

    if (!includePreviousYear) {
      return {
        previousSnapshot: null,
        snapshots,
      };
    }

    const previousSnapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        userId,
        monthStart: {
          lt: yearStart,
          gte: new Date(year - 1, 0, 1),
        },
      },
      orderBy: {
        monthStart: 'desc',
      },
      include: {
        items: true,
      },
    });

    return {
      previousSnapshot,
      snapshots,
    };
  }
}