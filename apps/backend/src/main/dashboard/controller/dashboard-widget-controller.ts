import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDashboardWidget } from '../logic/create-dashboard-widget-service';
import {
  CreateDashboardWidgetDto,
  DashboardWidgetDto,
} from '../dto/dashboard-widget.dto';
import { EditDashboardWidgetService } from '../logic/edit-dashboard-widget-service';
import { DeleteDashboardWidget } from '../logic/delete-dashboard-widget-service';
import { GetDashboardWidgetsService } from '../logic/get-dashboard-widgets-service';
import { CurrentUserId } from '../../auth/decorators/current-user-id.decorator';

@Controller('widget')
@UseGuards(JwtAuthGuard)
export class DashboardWidgetController {
  constructor(
    private readonly createDashboardWidgetService: CreateDashboardWidget,
    private readonly getDashboardWidgetsService: GetDashboardWidgetsService,
    private readonly editDashboardWidgetService: EditDashboardWidgetService,
    private readonly deleteDashboardWidgetService: DeleteDashboardWidget,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateDashboardWidgetDto,
  ) {
    return this.createDashboardWidgetService.create(userId, dto);
  }

  @Get()
  async get(@CurrentUserId() userId: string) {
    return this.getDashboardWidgetsService.get(userId);
  }

  @Patch(':widgetId')
  async edit(
    @CurrentUserId() userId: string,
    @Param('widgetId', ParseUUIDPipe) widgetId: string,
    @Body() dto: DashboardWidgetDto,
  ) {
    return this.editDashboardWidgetService.edit(userId, widgetId, dto);
  }

  @Delete(':widgetId')
  async delete(
    @CurrentUserId() userId: string,
    @Param('widgetId', ParseUUIDPipe) widgetId: string,
  ) {
    return this.deleteDashboardWidgetService.delete(userId, widgetId);
  }
}
