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
} from '@nestjs/common';
import { CreateInvestmentHistoryDto } from './dto/create-investment-history.dto';
import { UpdateInvestmentHistoryDto } from './dto/update-investment-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateInvestmentService } from './logic/create-investment.service';
import { DeleteInvestmentService } from './logic/delete-investment.service';
import { GetInvestmentService } from './logic/get-investment.service';
import { ListInvestmentsService } from './logic/list-investments.service';
import { UpdateInvestmentService } from './logic/update-investment.service';

@Controller('investment-history')
@UseGuards(JwtAuthGuard)
export class InvestmentHistoryController {
  constructor(
    private readonly createInvestment: CreateInvestmentService,
    private readonly listInvestments: ListInvestmentsService,
    private readonly getInvestment: GetInvestmentService,
    private readonly updateInvestment: UpdateInvestmentService,
    private readonly deleteInvestment: DeleteInvestmentService,
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

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.getInvestment.execute(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateInvestmentHistoryDto: UpdateInvestmentHistoryDto,
  ) {
    return this.updateInvestment.execute(id, userId, updateInvestmentHistoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.deleteInvestment.execute(id, userId);
  }
}
