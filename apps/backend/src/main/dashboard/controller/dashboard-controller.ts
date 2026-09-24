import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import { CreateDashboardService } from '../logic/create-dashboard-service';
import { GetDashboardService } from '../logic/get-dashboard-service';
import { UpdateDashboardLayoutService } from '../logic/update-dashboard-layout.service';
import { UpdateDashboardLayoutDto } from '../dto/update-dashboard-layout.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly createDashboardService: CreateDashboardService,
    private readonly getDashboardService: GetDashboardService,
    private readonly updateDashboardLayoutService: UpdateDashboardLayoutService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUserId() userId: string) {
    return this.createDashboardService.create(userId);
  }

  @Get()
  async get(@CurrentUserId() userId: string) {
    return this.getDashboardService.get(userId);
  }

  @Put('layout')
  async updateLayout(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateDashboardLayoutDto,
  ) {
    return this.updateDashboardLayoutService.update(userId, dto);
  }
}
