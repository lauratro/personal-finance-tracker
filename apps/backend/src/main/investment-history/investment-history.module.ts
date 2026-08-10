import { Module } from '@nestjs/common';
import { InvestmentHistoryController } from './investment-history.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CreateInvestmentService } from './logic/create-investment.service';
import { DeleteInvestmentService } from './logic/delete-investment.service';
import { GetInvestmentService } from './logic/get-investment.service';
import { ListInvestmentsService } from './logic/list-investments.service';
import { UpdateInvestmentService } from './logic/update-investment.service';
import { SearchInvestmentByYearsService } from './logic/search-investment-by-years.service';
import { InvestmentIncomeAnalyticsService } from './logic/analytics/investment-income-analytics.service';

@Module({
  imports: [PrismaModule],
  controllers: [InvestmentHistoryController],
  providers: [
    CreateInvestmentService,
    DeleteInvestmentService,
    GetInvestmentService,
    ListInvestmentsService,
    UpdateInvestmentService,
    SearchInvestmentByYearsService,
    InvestmentIncomeAnalyticsService
  ],
})
export class InvestmentHistoryModule {}
