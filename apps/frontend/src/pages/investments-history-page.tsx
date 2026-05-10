import { PageContainer } from '../containers/page-container/page-container';

// Mock data for investments history
const mockInvestments = [
  {
    id: 1,
    name: 'Apple Inc.',
    boughtDate: '2023-01-15',
    totalAmountInvested: 5000,
    costSingleStock: 150,
    plannedPriceToSell: 180,
    soldDate: '2023-06-20',
    soldAtPrice: 175,
    earningsAmount: 250,
    earningsPercentage: 5.0,
  },
  {
    id: 2,
    name: 'Tesla Inc.',
    boughtDate: '2023-02-10',
    totalAmountInvested: 3000,
    costSingleStock: 200,
    plannedPriceToSell: 250,
    soldDate: null,
    soldAtPrice: null,
    earningsAmount: null,
    earningsPercentage: null,
  },
  // Add more mock data as needed
];

export const InvestmentsHistoryPage = () => {
  return (
    <PageContainer title="Investments History" description="Track your investment performance over time.">
      <div className="investments-table-container">
        <table className="investments-table">
          <thead>
            <tr>
              <th>Name Stock test</th>
              <th>Bought Date</th>
              <th>Total Amount Invested</th>
              <th>Cost Single Stock/Action</th>
              <th>Planned Price to Sell</th>
              <th>Sold Date</th>
              <th>Sold at Price</th>
              <th>Earnings Amount</th>
              <th>Earnings Percentage</th>
            </tr>
          </thead>
          <tbody>
            {mockInvestments.map((investment) => (
              <tr key={investment.id}>
                <td>{investment.name}</td>
                <td>{investment.boughtDate}</td>
                <td>${investment.totalAmountInvested}</td>
                <td>${investment.costSingleStock}</td>
                <td>${investment.plannedPriceToSell}</td>
                <td>{investment.soldDate || '-'}</td>
                <td>{investment.soldAtPrice ? `$${investment.soldAtPrice}` : '-'}</td>
                <td>{investment.earningsAmount ? `$${investment.earningsAmount}` : '-'}</td>
                <td>{investment.earningsPercentage ? `${investment.earningsPercentage}%` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
