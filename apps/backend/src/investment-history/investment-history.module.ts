import { Module } from '@nestjs/common';
import { InvestmentHistoryService } from './investment-history.service';
import { InvestmentHistoryController } from './investment-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvestmentHistoryController],
  providers: [InvestmentHistoryService],
})
export class InvestmentHistoryModule {}
