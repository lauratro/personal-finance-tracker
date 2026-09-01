import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '../../../health/health.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { ServiceUnavailableException } from '@nestjs/common/exceptions/service-unavailable.exception';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: {
    $queryRaw: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('check', () => {
    it('should return ok when the database is available', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await controller.check();

      expect(result).toEqual({
        status: 'ok',
        database: 'up',
      });

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });
  });

  it('should throw ServiceUnavailableException when the database is unavailable', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('Database connection failed'));

    await expect(controller.check()).rejects.toThrow(
      ServiceUnavailableException,
    );

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
