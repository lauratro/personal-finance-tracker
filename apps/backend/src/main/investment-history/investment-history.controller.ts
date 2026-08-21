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
} from '@nestjs/common';
import { CreateInvestmentHistoryDto } from './dto/create-investment-history.dto';
import { UpdateInvestmentHistoryDto } from './dto/update-investment-history.dto';
import { JwtAuthGuard } from '../../main/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../main/auth/decorators/current-user.decorator';
import { CreateInvestmentService } from './logic/create-investment.service';
import { DeleteInvestmentService } from './logic/delete-investment.service';
import { GetInvestmentService } from './logic/get-investment.service';
import { ListInvestmentsService } from './logic/list-investments.service';
import { UpdateInvestmentService } from './logic/update-investment.service';
import { SearchInvestmentByYearsService } from './logic/search-investment-by-years.service';
import { InvestmentIncomeAnalyticsService } from './logic/analytics/investment-income-analytics.service';
import { InvestmentIncomeAnalyticsQueryDto } from './dto/investment-analytics.dto';

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
    @CurrentUser('sub') userId: string,
    @Body() createInvestmentHistoryDto: CreateInvestmentHistoryDto,
  ) {
    return this.createInvestment.execute(userId, createInvestmentHistoryDto);
  }

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return this.listInvestments.execute(userId);
  }

  @Get('by-period')
  async findByPeriod(
    @CurrentUser('sub') userId: string,
    @Query('fromDate') fromDate?: string,
    @Query('untilDate') untilDate?: string,
  ) {
    const parsedFromDate = fromDate
      ? this.parseDate(fromDate, 'fromDate')
      : undefined;

    const parsedUntilDate = untilDate
      ? this.parseDate(untilDate, 'untilDate')
      : undefined;

    return this.searchInvestment.search(
      userId,
      parsedFromDate,
      parsedUntilDate,
    );
  }

  private parseDate(value: string, field: string): Date | undefined {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return undefined;
    }

    return date;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.getInvestment.execute(id, userId);
  }

  @Get('analytics/income')
  getIncomeAnalytics(
    @CurrentUser('id') userId: string,
    @Query() query: InvestmentIncomeAnalyticsQueryDto,
  ) {
    return this.investmentIncomeAnalyticsService.get(userId, query.year);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateInvestmentHistoryDto: UpdateInvestmentHistoryDto,
  ) {
    console.log('DEBUG controller update route hit', {
      id,
      userId,
      body: updateInvestmentHistoryDto,
    });
    return this.updateInvestment.execute(
      id,
      userId,
      updateInvestmentHistoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.deleteInvestment.execute(id, userId);
  }
}
