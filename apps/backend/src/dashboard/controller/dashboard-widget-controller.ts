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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateDashboardWidget } from '../logic/create-dashboard-widget-service';
import { CreateDashboardWidgetDto, DashboardWidgetDto } from '../dto/dashboard-widget.dto';
import { EditDashboardWidgetService } from '../logic/edit-dashboard-widget-service';
import { DeleteDashboardWidget } from '../logic/delete-dashboard-widget-service';
import { GetDashboardWidgetsService } from '../logic/get-dashboard-widgets-service';


@Controller("widget")
@UseGuards(JwtAuthGuard)

export class DashboardWidgetController {
    constructor(
        private readonly createDashboardWidgetService: CreateDashboardWidget,
        private readonly getDashboardWidgetService: GetDashboardWidgetsService,
        private readonly editDashboardWidgetService: EditDashboardWidgetService,
        private readonly deleteDashboardWidgetService: DeleteDashboardWidget
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@CurrentUser("sub") userId: string,
    @Body() dto: CreateDashboardWidgetDto
    ) {
    return this.createDashboardWidgetService.create(userId, dto)
    }

    @Get()
    async get(@CurrentUser("sub") userId: string) {
        return this.getDashboardWidgetService.get(userId)
    }

    @Patch(":widgetId")
    async edit (@CurrentUser("sub") userId: string,
    @Param("widgetId") widgetId: string,
    @Body() dto : DashboardWidgetDto
    ) {
    return this.editDashboardWidgetService.edit(userId, widgetId, dto)
    }

    @Delete(":widgetId")
    async delete (
    @Param("widgetId") widgetId: string
    ) {
    return this.deleteDashboardWidgetService.delete(widgetId)
    }

}