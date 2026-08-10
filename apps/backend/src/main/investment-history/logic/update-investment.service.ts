import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { calculateInvestmentIncome } from '../utils/calculate-investment-income';
import { UpdateInvestmentHistoryDto } from '../dto/update-investment-history.dto';

@Injectable()
export class UpdateInvestmentService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string, dto: UpdateInvestmentHistoryDto) {
    const investment = await this.prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const data: Prisma.InvestmentUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.assetType !== undefined) data.assetType = dto.assetType;
    if (dto.boughtDate !== undefined) data.boughtDate = new Date(dto.boughtDate);
    if (dto.totalAmountInvested !== undefined) {
      data.totalAmountInvested = new Prisma.Decimal(dto.totalAmountInvested);
    }
    if (dto.costSingleStock !== undefined) {
      data.costSingleStock = new Prisma.Decimal(dto.costSingleStock);
    }
    if (dto.quantity !== undefined) {
      data.quantity = new Prisma.Decimal(dto.quantity);
    }
    if (dto.plannedPriceToSell !== undefined) {
      data.plannedPriceToSell = new Prisma.Decimal(dto.plannedPriceToSell);
    }

    const saleDate =
      dto.saleDate !== undefined
        ? dto.saleDate
          ? new Date(dto.saleDate)
          : null
        : investment.saleDate;
    const salePrice =
      dto.salePrice !== undefined
        ? dto.salePrice !== null
          ? new Prisma.Decimal(dto.salePrice)
          : null
        : investment.salePrice;
    const taxes =
      dto.taxes !== undefined
        ? dto.taxes !== null
          ? new Prisma.Decimal(dto.taxes)
          : null
        : investment.taxes;

    if (dto.saleDate !== undefined) data.saleDate = saleDate;
    if (dto.salePrice !== undefined) data.salePrice = salePrice;
    if (dto.taxes !== undefined) data.taxes = taxes;

    if (saleDate && salePrice) {
      const quantity =
        dto.quantity !== undefined
          ? new Prisma.Decimal(dto.quantity)
          : investment.quantity;
      const totalAmountInvested =
        dto.totalAmountInvested !== undefined
          ? new Prisma.Decimal(dto.totalAmountInvested)
          : investment.totalAmountInvested;
      const income = calculateInvestmentIncome(
        quantity,
        salePrice,
        totalAmountInvested,
      );

      data.income = income.income;
      data.percentageIncome = income.percentageIncome;
    } else {
      data.income = null;
      data.percentageIncome = null;
    }

    return this.prisma.investment.update({
      where: { id },
      data,
    });
  }
}
