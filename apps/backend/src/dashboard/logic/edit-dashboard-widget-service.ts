import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DashboardWidgetDto } from "../dto/dashboard-widget.dto";

@Injectable()
export class EditDashboardWidgetService {
    constructor(private readonly prisma: PrismaService) {}

    async edit(userId: string, widgetId: string, dto: DashboardWidgetDto) {
        const widget = await this.prisma.dashboardWidget.findFirst({
     where: {
    id: widgetId,
    dashboard: {
      userId,
    },
  },
});

if (!widget) {
  throw new NotFoundException('Widget not found');
}

return this.prisma.dashboardWidget.update({
      where: {
    id: widget.id,
  },
      data: {
    x: dto.x,
    y: dto.y,
    width: dto.width,
    height: dto.height,
  },
});
    }

}