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
import { InvestmentHistoryService } from './investment-history.service';
import { CreateInvestmentHistoryDto } from './dto/create-investment-history.dto';
import { UpdateInvestmentHistoryDto } from './dto/update-investment-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('investment-history')
@UseGuards(JwtAuthGuard)
export class InvestmentHistoryController {
  constructor(private readonly investmentHistoryService: InvestmentHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('sub') userId: string,
    @Body() createInvestmentHistoryDto: CreateInvestmentHistoryDto,
  ) {
    return this.investmentHistoryService.create(userId, createInvestmentHistoryDto);
  }

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return this.investmentHistoryService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.investmentHistoryService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateInvestmentHistoryDto: UpdateInvestmentHistoryDto,
  ) {
    return this.investmentHistoryService.update(
      id,
      userId,
      updateInvestmentHistoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.investmentHistoryService.delete(id, userId);
  }
}
