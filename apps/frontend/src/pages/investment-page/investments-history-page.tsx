import { PageContainer } from '../../containers/page-container/page-container';
import { InvestmentCreateButton } from './parts/investment-create-button/investment-create-button';
import { InvestmentTable } from './parts/investment-table/investment-table';
import {
  InvestmentHistory,
  getInvestmentHistories,
} from '../../pages-apis/investment-history';
import { useState, useEffect } from 'react';

export const InvestmentsHistoryPage = () => {
  const [investments, setInvestments] = useState<InvestmentHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await getInvestmentHistories();
      setInvestments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);
  return (
    <PageContainer
      title="Investments History"
      description="Track your investment performance over time."
    >
      <InvestmentCreateButton onCreated={fetchInvestments}/>
      <InvestmentTable investments={investments} onDeleted={fetchInvestments} isLoading={loading}/>
    </PageContainer>
  );
};
