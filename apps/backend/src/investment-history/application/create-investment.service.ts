import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvestmentHistoryDto } from '../dto/create-investment-history.dto';

@Injectable()
export class CreateInvestmentService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: CreateInvestmentHistoryDto) {
    return this.prisma.investment.create({
      data: {
        userId,
        name: dto.name,
        assetType: dto.assetType,
        boughtDate: new Date(dto.boughtDate),
        totalAmountInvested: new Prisma.Decimal(dto.totalAmountInvested),
        costSingleStock: new Prisma.Decimal(dto.costSingleStock),
        quantity: new Prisma.Decimal(dto.quantity),
        plannedPriceToSell:
          dto.plannedPriceToSell !== undefined
            ? new Prisma.Decimal(dto.plannedPriceToSell)
            : null,
      },
    });
  }
}
