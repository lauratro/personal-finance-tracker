import { DateTimePicker } from '@mantine/dates';

import { useInvestmentHistoryFilter } from '@/pages/investment-page/investments-context/investment-history-filter-context';

export const YearFilters = () => {
  const { filters, setFilters } = useInvestmentHistoryFilter();

  return (
    <div>
      <DateTimePicker
        label="From"
        placeholder="Select start date"
        value={filters.fromDate ?? undefined}
        onChange={(value) =>
          setFilters((previousFilters) => ({
            ...previousFilters,
            fromDate: value ?? undefined,
          }))
        }
        valueFormat="DD MMM YYYY"
        clearable
      />

      <DateTimePicker
        label="Until"
        placeholder="Select end date"
        value={filters.untilDate ?? undefined}
        onChange={(value) =>
          setFilters((previousFilters) => ({
            ...previousFilters,
            untilDate: value ?? undefined,
          }))
        }
        valueFormat="DD MMM YYYY"
        clearable
      />
    </div>
  );
};