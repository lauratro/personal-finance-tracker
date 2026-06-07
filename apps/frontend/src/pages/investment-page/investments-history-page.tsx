import { PageContainer } from '../../containers/page-container/page-container';
import { InvestmentCreateButton } from './parts/investment-create-button/investment-create-button';
import { InvestmentTable } from './parts/investment-table/investment-table';

export const InvestmentsHistoryPage = () => {
  return (
    <PageContainer
      title="Investments History"
      description="Track your investment performance over time."
    >
      <InvestmentCreateButton/>
      <InvestmentTable/>
    </PageContainer>
  );
};
