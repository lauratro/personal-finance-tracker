import { DateTimePicker } from '@mantine/dates';
import { useInvestmentHistoryFilter } from '@/pages/investment-page/investments-context/investment-history-filter-context';

export const YearFilters = () => {
  const { filters, setFilters } = useInvestmentHistoryFilter();

  return (
    <div className='px-4 flex content-center'>
     <p className='self-center font-medium'>Bought Date</p>
      <DateTimePicker
      className='mx-4'
        placeholder="From Date ..."
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
        placeholder="Until Date ..."
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