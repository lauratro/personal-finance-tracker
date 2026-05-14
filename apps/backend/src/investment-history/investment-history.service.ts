import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentHistoryDto } from './dto/create-investment-history.dto';
import { UpdateInvestmentHistoryDto } from './dto/update-investment-history.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InvestmentHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateInvestmentHistoryDto) {
    return this.prisma.investment.create({
      data: {
        userId,
        name: dto.name,
        assetType: dto.assetType,
        boughtDate: new Date(dto.boughtDate),
        totalAmountInvested: new Decimal(dto.totalAmountInvested),
        costSingleStock: new Decimal(dto.costSingleStock),
        quantity: new Decimal(dto.quantity),
        plannedPriceToSell: dto.plannedPriceToSell
          ? new Decimal(dto.plannedPriceToSell)
          : null,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { boughtDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.investment.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, dto: UpdateInvestmentHistoryDto) {
    const investment = await this.prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    const data: any = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.assetType !== undefined) data.assetType = dto.assetType;
    if (dto.boughtDate !== undefined) data.boughtDate = new Date(dto.boughtDate);
    if (dto.totalAmountInvested !== undefined)
      data.totalAmountInvested = new Decimal(dto.totalAmountInvested);
    if (dto.costSingleStock !== undefined)
      data.costSingleStock = new Decimal(dto.costSingleStock);
    if (dto.quantity !== undefined) data.quantity = new Decimal(dto.quantity);
    if (dto.plannedPriceToSell !== undefined)
      data.plannedPriceToSell = dto.plannedPriceToSell
        ? new Decimal(dto.plannedPriceToSell)
        : null;

    if (dto.saleDate !== undefined) {
      data.saleDate = dto.saleDate ? new Date(dto.saleDate) : null;
    }

    if (dto.salePrice !== undefined) {
      data.salePrice = dto.salePrice !== null ? new Decimal(dto.salePrice) : null;
    }

    const saleDate = data.saleDate ?? investment.saleDate;
    const salePrice = data.salePrice ?? investment.salePrice;

    if (saleDate && salePrice) {
      const totalRevenue = new Decimal(investment.quantity).mul(salePrice);
      data.income = totalRevenue.sub(investment.totalAmountInvested);
      data.percentageIncome = data.income
        .div(investment.totalAmountInvested)
        .mul(100);
    }

    return this.prisma.investment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const investment = await this.prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    return this.prisma.investment.delete({
      where: { id },
    });
  }
}
