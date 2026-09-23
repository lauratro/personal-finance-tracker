import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateNetWorthDto } from '../dto/update-net-worth.dto';

@Injectable()
export class UpdateNetWorthService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, snapshotId: string, dto: UpdateNetWorthDto) {
    const inputDate = new Date(dto.monthStart);

    const normalizedMonthStart = new Date(
      Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), 1),
    );
    const existingSnapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        userId,
        monthStart: normalizedMonthStart,
        NOT: { id: snapshotId },
      },
    });

    if (existingSnapshot) {
      throw new ConflictException(
        'A net worth snapshot already exists for this month',
      );
    }
    const snapshot = await this.prisma.netWorthSnapshot.findFirst({
      where: {
        id: snapshotId,
        userId,
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Net worth snapshot not found');
    }
    return this.prisma.netWorthSnapshot.update({
      where: { id: snapshotId },
      data: {
        monthStart: normalizedMonthStart,
        updatedAt: new Date(),
      },
    });
  }
}
