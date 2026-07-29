import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardController } from '../controller/dashboard-controller';
import { DashboardWidgetController } from '../controller/dashboard-widget-controller';
import { CreateDashboardService } from '../logic/create-dashboard-service';
import { CreateDashboardWidget } from '../logic/create-dashboard-widget-service';
import { DeleteDashboardWidget } from '../logic/delete-dashboard-widget-service';
import { EditDashboardWidgetService } from '../logic/edit-dashboard-widget-service';
import { GetDashboardService } from '../logic/get-dashboard-service';
import { GetDashboardWidgetsService } from '../logic/get-dashboard-widgets-service';

@Module({
    imports:[PrismaModule],
    controllers:[DashboardController, DashboardWidgetController],
    providers:[
        CreateDashboardService, 
        CreateDashboardWidget, 
        DeleteDashboardWidget, 
        EditDashboardWidgetService, 
        GetDashboardService, 
        GetDashboardWidgetsService]
}
)

export class DashboardModule {}