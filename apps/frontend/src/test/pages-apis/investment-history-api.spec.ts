import { http } from '@/api/http';
import { searchInvestmentHistories } from '@/pages-apis/investment-history';

vi.mock('@/api/http', () => ({
  http: vi.fn(),
}));

describe('searchInvestmentHistories', () => {
  const mockedHttp = vi.mocked(http);

  beforeEach(() => {
    mockedHttp.mockReset();
  });

  it('omits absent date filters from the request', () => {
    searchInvestmentHistories();

    expect(mockedHttp).toHaveBeenCalledWith('/investment-history/by-period', {
      method: 'GET',
    });
  });

  it('only includes the date filters that are defined', () => {
    searchInvestmentHistories('2024-01-01');

    expect(mockedHttp).toHaveBeenCalledWith(
      '/investment-history/by-period?fromDate=2024-01-01',
      { method: 'GET' },
    );
  });

  it('encodes both date filters', () => {
    searchInvestmentHistories(
      '2024-01-01T00:00:00.000Z',
      '2024-12-31T23:59:59.999Z',
    );

    expect(mockedHttp).toHaveBeenCalledWith(
      '/investment-history/by-period?fromDate=2024-01-01T00%3A00%3A00.000Z&untilDate=2024-12-31T23%3A59%3A59.999Z',
      { method: 'GET' },
    );
  });
});
