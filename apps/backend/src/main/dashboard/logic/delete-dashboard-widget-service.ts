import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";


@Injectable()
export class DeleteDashboardWidget {
    constructor(private readonly prisma: PrismaService) {}

    async delete(widgetId: string) {
        return this.prisma.dashboardWidget.delete({
            where: {
                id: widgetId
            }
        })
    }
}