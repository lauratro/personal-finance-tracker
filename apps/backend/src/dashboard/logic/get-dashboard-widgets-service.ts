import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetDashboardWidgetsService {
    constructor(private readonly prisma: PrismaService) {}

    async get(userId: string) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where:{
                userId: userId
            }
        })


        if(!dashboard) {
            return null
        }
        
        
        return this.prisma.dashboardWidget.findMany({
            where:{
                dashboardId: dashboard.id
            }
        })
    }
}