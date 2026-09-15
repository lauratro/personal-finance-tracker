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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateNetWorthDto } from './../dto/create-net-worth.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import { CreateNetWorthService } from '../logic/create-net-worth-service';
import { GetNetWorthsService } from '../logic/get-net-worths.service';
import { UpdateNetWorthDto } from '../dto/update-net-worth.dto';
import { UpdateNetWorthService } from '../logic/update-net-worth.service';
import { DeleteNetWorthService } from '../logic/delete-net-worth-service';
import { GetNetWorthBasedOnYearService } from '../logic/get-net-worth-based-on-year-service';
import { GetNetWorthYearsListService } from '../logic/get-net-worth-years-list-service';
import { GetLastNetWorthIndicatorsService } from '../logic/get-last-net-wort-indicators-service';
import { SortDirectionType } from '../schema/types/sortDirectionTypes';

@Controller('net-worth')
@UseGuards(JwtAuthGuard)
export class NetWorthController {
  constructor(
    private readonly createNetWorth: CreateNetWorthService,
    private readonly getNetWorths: GetNetWorthsService,
    private readonly updateNetWorth: UpdateNetWorthService,
    private readonly deleteNetWorth: DeleteNetWorthService,
    private readonly getNetWorthBasedOnYear: GetNetWorthBasedOnYearService,
    private readonly getNetWorthYearsList: GetNetWorthYearsListService,
    private readonly getLastNetWorthIndicators: GetLastNetWorthIndicatorsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUserId() userId: string,
    @Body() createNetWorthDto: CreateNetWorthDto,
  ) {
    return this.createNetWorth.execute(userId, createNetWorthDto);
  }

  @Get()
  async findAll(
    @CurrentUserId() userId: string,
    @Query('sortDirection') sortDirection?: string,
  ) {
    const safeSortDirection: SortDirectionType =
      sortDirection === 'asc' || sortDirection === 'desc'
        ? sortDirection
        : 'desc';

    return this.getNetWorths.execute(userId, safeSortDirection);
  }

  @Get('years-list')
  async findYearsList(@CurrentUserId() userId: string) {
    return this.getNetWorthYearsList.getListOfYears(userId);
  }

  @Get('by-year/:year/:includePreviousYear?')
  async findAllBasedOnYear(
    @CurrentUserId() userId: string,
    @Param('year', ParseIntPipe) year: number,
    @Param('includePreviousYear') includePreviousYear: boolean,
  ) {
    return this.getNetWorthBasedOnYear.execute(
      userId,
      year,
      includePreviousYear,
    );
  }

  @Get('latest')
  async findLastIndicators(@CurrentUserId() userId: string) {
    return this.getLastNetWorthIndicators.get(userId);
  }

  @Patch(':id')
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateNetWorthDto: UpdateNetWorthDto,
  ) {
    return this.updateNetWorth.execute(userId, id, updateNetWorthDto);
  }

  @Delete(':id')
  async remove(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.deleteNetWorth.execute(userId, id);
  }
}
