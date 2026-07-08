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
  Query
} from '@nestjs/common';
import { CreateNetWorthDto } from './../dto/create-net-worth.dto'; 
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
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
        @CurrentUser('sub') userId: string,
        @Body() createNetWorthDto: CreateNetWorthDto,
    ) {
        return this.createNetWorth.execute(userId, createNetWorthDto);
    }

@Get()
async findAll(
  @CurrentUser('sub') userId: string,
  @Query('sortDirection') sortDirection?: string,
) {
  const safeSortDirection : SortDirectionType =
    sortDirection === "asc"|| sortDirection === "desc"
      ? sortDirection
      : "desc";

  return this.getNetWorths.execute(userId, safeSortDirection);
}

    @Get('years-list')
    async findYearsList(
        @CurrentUser('sub') userId: string,
    ) {
        return this.getNetWorthYearsList.getListOfYears(userId);
    }

    @Get('by-year/:year/:includePreviousYear?')
    async findAllBasedOnYear(
        @CurrentUser('sub') userId: string,
        @Param('year', ParseIntPipe) year: number,
        @Param('includePreviousYear') includePreviousYear: boolean,
    ) {
        return this.getNetWorthBasedOnYear.execute(userId, year, includePreviousYear);
    }
    

    @Get("latest")
    async findLastIndicators(
        @CurrentUser('sub') userId: string,
    ) {
        return this.getLastNetWorthIndicators.get(userId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNetWorthDto: UpdateNetWorthDto,
    ) {
        return this.updateNetWorth.execute(id, updateNetWorthDto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string
    ) {
        return this.deleteNetWorth.execute(id);
    }   

}
