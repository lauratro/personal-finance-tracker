import {Injectable} from '@nestjs/common';  
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class GetNetWorthYearsListService {
  constructor(private readonly prisma: PrismaService) {}

 async getListOfYears(userId: string): Promise<number[]> {
    const allSnapshots = await this.prisma.netWorthSnapshot.findMany({
    where: {userId: userId},
    select:{monthStart: true}
    });

    const yearsList = allSnapshots.map(snapshot => snapshot.monthStart.getFullYear());
    return [...new Set(yearsList)].sort((a, b) => b - a);  
 }
}