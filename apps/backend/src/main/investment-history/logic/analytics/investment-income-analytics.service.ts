import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class InvestmentIncomeAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string, selectedYear: number | undefined) {
    const parsedSelectedYear = Number(selectedYear);

    const year =
      Number.isInteger(parsedSelectedYear) && parsedSelectedYear > 0
        ? parsedSelectedYear
        : new Date().getFullYear();

    const allInvestments = await this.prisma.investment.findMany({
      where: {
        userId,
        saleDate: {
          not: null,
        },
      },
      select: {
        income: true,
        saleDate: true,
      },
      orderBy: {
        saleDate: 'asc',
      },
    });

    const yearlyIncomeMap = new Map<number, number>();
    const monthlyIncomeMap = new Map<number, number>();

    for (const investment of allInvestments) {
      if (!investment.saleDate) {
        continue;
      }

      const saleYear = investment.saleDate.getFullYear();
      const saleMonth = investment.saleDate.getMonth() + 1;
      const income = Number(investment.income ?? 0);

      yearlyIncomeMap.set(
        saleYear,
        (yearlyIncomeMap.get(saleYear) ?? 0) + income,
      );

      if (saleYear === year) {
        monthlyIncomeMap.set(
          saleMonth,
          (monthlyIncomeMap.get(saleMonth) ?? 0) + income,
        );
      }
    }

    const yearlyIncome = Array.from(yearlyIncomeMap.entries()).map(
      ([year, income]) => ({
        year,
        income,
      }),
    );

    const monthlyIncome = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;

      return {
        month,
        income: monthlyIncomeMap.get(month) ?? 0,
      };
    });

    return {
      selectedYear: year,
      yearlyIncome,
      monthlyIncome,
    };
  }
}