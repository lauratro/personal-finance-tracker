import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListInvestmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { boughtDate: 'desc' },
    });
  }
}
