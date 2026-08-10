import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './main/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { InvestmentHistoryModule } from './main/investment-history/investment-history.module';
import { NetWorthModule } from './main/net-worth/modules/net-worth-module';
import { DashboardModule } from './main/dashboard/modules/dashboard-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    InvestmentHistoryModule,
    NetWorthModule,
    DashboardModule
  ],
})
export class AppModule {}
