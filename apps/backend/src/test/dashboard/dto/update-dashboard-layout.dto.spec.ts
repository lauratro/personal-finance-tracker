import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateDashboardLayoutDto } from '../../../main/dashboard/dto/update-dashboard-layout.dto';

describe('UpdateDashboardLayoutDto', () => {
  const widget = {
    id: '11111111-1111-4111-8111-111111111111',
    x: 0,
    y: 0,
    width: 4,
    height: 4,
  };

  it('accepts a valid bulk layout', async () => {
    const dto = plainToInstance(UpdateDashboardLayoutDto, {
      widgets: [widget],
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects duplicate widget ids', async () => {
    const dto = plainToInstance(UpdateDashboardLayoutDto, {
      widgets: [widget, { ...widget, x: 4 }],
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('rejects invalid layout dimensions', async () => {
    const dto = plainToInstance(UpdateDashboardLayoutDto, {
      widgets: [{ ...widget, width: 0 }],
    });

    expect(await validate(dto)).not.toHaveLength(0);
  });
});
