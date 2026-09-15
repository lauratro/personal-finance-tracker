import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DeleteDashboardWidget {
  constructor(private readonly prisma: PrismaService) {}

  async delete(userId: string, widgetId: string) {
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

    return this.prisma.dashboardWidget.delete({
      where: {
        id: widgetId,
      },
    });
  }
}
