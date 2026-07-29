import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDashboardWidgetDto } from "../dto/dashboard-widget.dto";

@Injectable()
export class CreateDashboardWidget {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateDashboardWidgetDto) {
      const dashboard = await this.prisma.dashboard.findUnique({
          where: {
          userId: userId
        }
      })

      if(!dashboard){
          throw new NotFoundException('Dashboard not found');
      }

      return this.prisma.dashboardWidget.create({
        data: {
            dashboardId: dashboard?.id,
            type: dto.type,
            x: dto.x,
            y: dto.y,
            height: dto.height,
            width: dto.width,
            maxHeight: dto.maxHeight,
            minHeight: dto.minHeight,
            maxWidth: dto.maxWidth,
            minWidth: dto.minWidth
        }
      })
    }
}