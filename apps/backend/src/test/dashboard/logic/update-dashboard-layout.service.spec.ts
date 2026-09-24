import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateDashboardLayoutService } from '../../../main/dashboard/logic/update-dashboard-layout.service';

describe('UpdateDashboardLayoutService', () => {
  const dto = {
    widgets: [
      { id: 'widget-1', x: 0, y: 1, width: 6, height: 4 },
      { id: 'widget-2', x: 6, y: 1, width: 6, height: 4 },
    ],
  };
  let prisma: any;
  let service: UpdateDashboardLayoutService;

  beforeEach(() => {
    prisma = {
      dashboard: { findUnique: jest.fn() },
      dashboardWidget: {
        count: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(async (operation) => operation(prisma)),
    };
    service = new UpdateDashboardLayoutService(
      prisma as unknown as PrismaService,
    );
  });

  it('updates the complete layout inside one transaction', async () => {
    prisma.dashboard.findUnique.mockResolvedValue({ id: 'dashboard-1' });
    prisma.dashboardWidget.count.mockResolvedValue(2);
    prisma.dashboardWidget.update.mockResolvedValue({});
    prisma.dashboardWidget.findMany.mockResolvedValue(['updated-layout']);

    await expect(service.update('user-1', dto)).resolves.toEqual([
      'updated-layout',
    ]);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.dashboardWidget.update).toHaveBeenCalledTimes(2);
    expect(prisma.dashboardWidget.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'widget-1' },
      data: { x: 0, y: 1, width: 6, height: 4 },
    });
  });

  it('rejects the whole update when any widget is not owned by the user', async () => {
    prisma.dashboard.findUnique.mockResolvedValue({ id: 'dashboard-1' });
    prisma.dashboardWidget.count.mockResolvedValue(1);

    await expect(service.update('user-1', dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.dashboardWidget.update).not.toHaveBeenCalled();
  });
});
