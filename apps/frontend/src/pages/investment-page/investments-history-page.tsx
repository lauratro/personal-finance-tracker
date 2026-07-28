import { PageContainer } from '../../containers/page-container/page-container';
import { InvestmentCreateButton } from './parts/investment-create-button/investment-create-button';
import { InvestmentTable } from './parts/investment-table/investment-table';
import {
  InvestmentHistory,
  searchInvestmentHistories,
} from '../../pages-apis/investment-history';
import { useState, useEffect } from 'react';
import { useInvestmentHistoryFilter } from './investments-context/investment-history-filter-context';
import { YearFilters } from './parts/filters/year-filters';
import { TotalIncomeDisplayer } from './parts/total-income-displayer';
import { RealizedIncomeByYearChart } from './parts/charts/realized-income-by-year';

export const InvestmentsHistoryPage = () => {
  const [investments, setInvestments] = useState<InvestmentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const {filters} = useInvestmentHistoryFilter()

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await searchInvestmentHistories(filters.fromDate, filters.untilDate);
      setInvestments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments()
    ;
  }, [filters]);

  return (
    <PageContainer
      title="Investments History"
      description="Track your investment performance over time."
    >
      <TotalIncomeDisplayer investments ={investments}/>
      <RealizedIncomeByYearChart/>
      <InvestmentCreateButton onCreated={fetchInvestments}/>
      <YearFilters/>
      <InvestmentTable investments={investments} onRefetch={fetchInvestments} isLoading={loading}/>
    </PageContainer>
  );
};
