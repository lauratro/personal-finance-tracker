import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DeleteInvestmentService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const result = await this.prisma.investment.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Investment not found');
    }
  }
}
