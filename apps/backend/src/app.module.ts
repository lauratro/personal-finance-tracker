import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { InvestmentHistoryModule } from './investment-history/investment-history.module';
import { NetWorthModule } from './net-worth/modules/net-worth-module';
import { DashboardModule } from './dashboard/modules/dashboard-module';

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
