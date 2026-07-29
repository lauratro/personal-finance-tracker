import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetDashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async get(userId: string) {
        return this.prisma.dashboard.findUnique({
            where:{
                userId: userId
            }
        })
    }
}