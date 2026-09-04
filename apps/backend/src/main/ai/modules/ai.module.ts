import { Module } from '@nestjs/common';

import { AiService } from '../logic/ai.service';
import { AiController } from '../controller/ai.controller';
import { FinancialAgentService } from '../logic/financial-agent.service';
import { NetWorthModule } from '../../net-worth/modules/net-worth-module';
import { InvestmentHistoryModule } from '../../investment-history/modules/investment-history.module';

@Module({
  imports: [NetWorthModule, InvestmentHistoryModule],
  controllers: [AiController],
  providers: [AiService, FinancialAgentService],
  exports: [AiService],
})
export class AiModule {}
