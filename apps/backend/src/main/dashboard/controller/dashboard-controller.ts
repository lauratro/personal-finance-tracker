import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';
import { CreateDashboardService } from '../logic/create-dashboard-service';
import { GetDashboardService } from '../logic/get-dashboard-service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly createDashboardService: CreateDashboardService,
    private readonly getDashboardService: GetDashboardService,
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
}
