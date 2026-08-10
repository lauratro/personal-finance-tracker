import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hashData } from '../utils/hashData';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase();
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      data.email = email;
    }

    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.password !== undefined) {
      data.passwordHash = await hashData(dto.password);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
