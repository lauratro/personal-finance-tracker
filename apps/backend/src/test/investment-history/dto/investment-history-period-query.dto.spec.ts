import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { InvestmentHistoryPeriodQueryDto } from '../../../main/investment-history/dto/investment-history-period-query.dto';

describe('InvestmentHistoryPeriodQueryDto', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  });
  const metadata = {
    type: 'query' as const,
    metatype: InvestmentHistoryPeriodQueryDto,
    data: undefined,
  };

  it('accepts valid optional ISO date filters', async () => {
    await expect(
      pipe.transform(
        { fromDate: '2024-01-01', untilDate: '2024-12-31' },
        metadata,
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        fromDate: '2024-01-01',
        untilDate: '2024-12-31',
      }),
    );
  });

  it.each(['not-a-date', '2024-13-01', '2024-02-30'])(
    'returns bad request for malformed date %s',
    async (value) => {
      await expect(
        pipe.transform({ fromDate: value }, metadata),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('returns bad request when fromDate is later than untilDate', async () => {
    await expect(
      pipe.transform(
        { fromDate: '2024-12-31', untilDate: '2024-01-01' },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
