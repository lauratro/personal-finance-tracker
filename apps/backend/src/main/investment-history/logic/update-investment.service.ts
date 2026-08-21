import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateInvestmentHistoryDto } from '../dto/update-investment-history.dto';
import { InvestmentUpdateMapper } from './mappers/investment-update.mapper';

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

    const data = InvestmentUpdateMapper.mapInvestment(investment, dto);

    return this.prisma.investment.update({
      where: { id },
      data,
    });
  }
}
