import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNetWorthDto } from '../dto/create-net-worth.dto';

@Injectable()
export class CreateNetWorthService {
    constructor(private readonly prisma: PrismaService) {}

    async execute(userId: string, dto: CreateNetWorthDto) {
     return this.prisma.netWorthSnapshot.create({
            data: {
                 userId
                , monthStart: new Date(dto.monthStart)
                }
            },
        )
    }
}