import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SearchInvestmentByYearsService {
    constructor (private readonly prisma: PrismaService ) {}

async search(
  userId: string,
  fromDate?: Date,
  untilDate?: Date,
) {
  const where: Prisma.InvestmentWhereInput = {
    userId,
  };

  if (fromDate || untilDate) {
    where.boughtDate = {
      ...(fromDate && { gte: fromDate }),
      ...(untilDate && { lt: untilDate }),
    };
  }

  return this.prisma.investment.findMany({
    where,
    orderBy: {
      boughtDate: 'asc',
    },
  });
}
}