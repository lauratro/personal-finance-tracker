import { useEffect, useState } from 'react';
import { PageContainer } from '../../containers/page-container/page-container';
import {
  getInvestmentHistories,
  createInvestmentHistory,
  updateInvestmentHistory,
  deleteInvestmentHistory,
  AssetType,
} from '../../investment-history';
import { Button, Card, TextInput } from '@mantine/core';
import { InvestmentCreateForm } from './parts/investment-create-form';

export const InvestmentsHistoryPage = () => {
  const [investments, setInvestments] = useState<InvestmentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await getInvestmentHistories();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

/*   const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: CreateInvestmentHistoryPayload = {
      name: formData.get('name') as string,
      assetType: formData.get('assetType') as AssetType,
      boughtDate: formData.get('boughtDate') as string,
      totalAmountInvested: parseFloat(formData.get('totalAmountInvested') as string),
      costSingleStock: parseFloat(formData.get('costSingleStock') as string),
      quantity: parseFloat(formData.get('quantity') as string),
      plannedPriceToSell: formData.get('plannedPriceToSell')
        ? parseFloat(formData.get('plannedPriceToSell') as string)
        : undefined,
    };

    try {
      await createInvestmentHistory(payload);
      setShowForm(false);
      fetchInvestments();
    } catch (error) {
      console.error('Error creating investment:', error);
    }
  }; */

  const handleMarkAsSold = async (id: string, salePrice: string, saleDate: string = new Date().toISOString().split('T')[0]
  ) => {
    try {
      await updateInvestmentHistory(id, {
        saleDate: saleDate,
        salePrice: parseFloat(salePrice),
      });
      fetchInvestments();
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      try {
        await deleteInvestmentHistory(id);
        fetchInvestments();
      } catch (error) {
        console.error('Error deleting investment:', error);
      }
    }
  };

  if (loading) {
    return (
      <PageContainer
        title="Investments History"
        description="Track your investment performance over time."
      >
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Investments History"
      description="Track your investment performance over time."
    >
 {/*      <div className="mb-6">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Investment'}
        </Button>
      </div> */}
     <InvestmentCreateForm/>
              

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Bought Date</th>
              <th className="border p-2 text-right">Amount Invested</th>
              <th className="border p-2 text-right">Cost per Unit</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Planned Price</th>
              <th className="border p-2 text-left">Sale Date</th>
              <th className="border p-2 text-right">Sale Price</th>
              <th className="border p-2 text-right">Income</th>
              <th className="border p-2 text-right">Income %</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="border p-2">{inv.name}</td>
                <td className="border p-2">{inv.assetType}</td>
                <td className="border p-2">
                  {new Date(inv.boughtDate).toLocaleDateString()}
                </td>
                <td className="border p-2 text-right">€{inv.totalAmountInvested}</td>
                <td className="border p-2 text-right">€{inv.costSingleStock}</td>
                <td className="border p-2 text-right">{inv.quantity}</td>
                <td className="border p-2 text-right">
                  {inv.plannedPriceToSell ? `€${inv.plannedPriceToSell}` : '-'}
                </td>
                <td className="border p-2">
                  {inv.saleDate ? new Date(inv.saleDate).toLocaleDateString() : '-'}
                </td>
                <td className="border p-2 text-right">
                  {inv.salePrice ? `€${inv.salePrice}` : '-'}
                </td>
                <td className="border p-2 text-right">
                  {inv.income ? `€${Number(inv.income).toFixed(2)}` : '-'}
                </td>
                <td className="border p-2 text-right">
                  {inv.percentageIncome ? `${Number(inv.percentageIncome).toFixed(2)}%` : '-'}
                </td>
                <td className="border p-2 text-center space-x-2">
                  {!inv.saleDate && (
                    <button
                      onClick={() => {
                        const price = prompt('Sale price:');
                        if (price) handleMarkAsSold(inv.id, price);
                      }}
                      className="text-sm px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Sell
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {investments.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No investments yet. Add one to get started!</p>
      )}
    </PageContainer>
  );
};

