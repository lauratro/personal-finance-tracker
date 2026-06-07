import { Module } from '@nestjs/common';
import { InvestmentHistoryController } from './investment-history.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateInvestmentService } from './application/create-investment.service';
import { DeleteInvestmentService } from './application/delete-investment.service';
import { GetInvestmentService } from './application/get-investment.service';
import { ListInvestmentsService } from './application/list-investments.service';
import { UpdateInvestmentService } from './application/update-investment.service';

@Module({
  imports: [PrismaModule],
  controllers: [InvestmentHistoryController],
  providers: [
    CreateInvestmentService,
    DeleteInvestmentService,
    GetInvestmentService,
    ListInvestmentsService,
    UpdateInvestmentService,
  ],
})
export class InvestmentHistoryModule {}
