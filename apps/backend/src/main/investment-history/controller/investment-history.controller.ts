import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateInvestmentHistoryDto } from './../dto/create-investment-history.dto';
import { UpdateInvestmentHistoryDto } from './../dto/update-investment-history.dto';
import { JwtAuthGuard } from '../../../main/auth/guards/jwt-auth.guard';
import { CreateInvestmentService } from './../logic/create-investment.service';
import { DeleteInvestmentService } from './../logic/delete-investment.service';
import { GetInvestmentService } from './../logic/get-investment.service';
import { ListInvestmentsService } from './../logic/list-investments.service';
import { UpdateInvestmentService } from './../logic/update-investment.service';
import { SearchInvestmentByYearsService } from './../logic/search-investment-by-years.service';
import { InvestmentIncomeAnalyticsService } from './../logic/analytics/investment-income-analytics.service';
import { InvestmentIncomeAnalyticsQueryDto } from './../dto/investment-analytics.dto';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import { InvestmentHistoryPeriodQueryDto } from './../dto/investment-history-period-query.dto';

@Controller('investment-history')
@UseGuards(JwtAuthGuard)
export class InvestmentHistoryController {
  constructor(
    private readonly createInvestment: CreateInvestmentService,
    private readonly listInvestments: ListInvestmentsService,
    private readonly getInvestment: GetInvestmentService,
    private readonly updateInvestment: UpdateInvestmentService,
    private readonly deleteInvestment: DeleteInvestmentService,
    private readonly searchInvestment: SearchInvestmentByYearsService,
    private readonly investmentIncomeAnalyticsService: InvestmentIncomeAnalyticsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUserId() userId: string,
    @Body() createInvestmentHistoryDto: CreateInvestmentHistoryDto,
  ) {
    return this.createInvestment.execute(userId, createInvestmentHistoryDto);
  }

  @Get()
  async findAll(@CurrentUserId() userId: string) {
    return this.listInvestments.execute(userId);
  }

  @Get('by-period')
  async findByPeriod(
    @CurrentUserId() userId: string,
    @Query() query: InvestmentHistoryPeriodQueryDto,
  ) {
    return this.searchInvestment.search(
      userId,
      query.fromDate ? new Date(query.fromDate) : undefined,
      query.untilDate ? new Date(query.untilDate) : undefined,
    );
  }

  @Get('analytics/income')
  getIncomeAnalytics(
    @CurrentUserId() userId: string,
    @Query() query: InvestmentIncomeAnalyticsQueryDto,
  ) {
    return this.investmentIncomeAnalyticsService.get(userId, query.year);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    return this.getInvestment.execute(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() userId: string,
    @Body() updateInvestmentHistoryDto: UpdateInvestmentHistoryDto,
  ) {
    return this.updateInvestment.execute(
      id,
      userId,
      updateInvestmentHistoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() userId: string,
  ) {
    return this.deleteInvestment.execute(id, userId);
  }
}
