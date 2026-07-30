import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CreateDashboardService {
    constructor( private readonly prisma: PrismaService) {}
  async create(userId: string) {
    return this.prisma.dashboard.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
      include: {
        widgets: true,
      },
    });
  }
}