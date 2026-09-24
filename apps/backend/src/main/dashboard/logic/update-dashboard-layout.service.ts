import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateDashboardLayoutDto } from '../dto/update-dashboard-layout.dto';

@Injectable()
export class UpdateDashboardLayoutService {
  constructor(private readonly prisma: PrismaService) {}

  async update(userId: string, dto: UpdateDashboardLayoutDto) {
    return this.prisma.$transaction(async (transaction) => {
      const dashboard = await transaction.dashboard.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!dashboard) {
        throw new NotFoundException('Dashboard not found');
      }

      const widgetIds = dto.widgets.map((widget) => widget.id);
      const ownedWidgetCount = await transaction.dashboardWidget.count({
        where: {
          id: { in: widgetIds },
          dashboardId: dashboard.id,
        },
      });

      if (ownedWidgetCount !== widgetIds.length) {
        throw new NotFoundException('One or more widgets were not found');
      }

      await Promise.all(
        dto.widgets.map((widget) =>
          transaction.dashboardWidget.update({
            where: { id: widget.id },
            data: {
              x: widget.x,
              y: widget.y,
              width: widget.width,
              height: widget.height,
            },
          }),
        ),
      );

      return transaction.dashboardWidget.findMany({
        where: { dashboardId: dashboard.id },
      });
    });
  }
}
