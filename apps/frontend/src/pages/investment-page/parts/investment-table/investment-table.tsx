import { useEffect, useState } from 'react';
import {
  getInvestmentHistories,
  updateInvestmentHistory,
  deleteInvestmentHistory,
} from '../../../../investment-history';
import { Button, Card, TextInput } from '@mantine/core';
export const InvestmentTable = () => {

const [investments, setInvestments] = useState<InvestmentHistory[]>([]);
  const [isLoading, setLoading] = useState(true);
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


    return (

            <div className="p-4">
     <div className="overflow-x-auto">
        {loading ?    <p>Loading...</p> : investments.length > 0 ? (
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
                    <Button
                      onClick={() => {
                        const price = prompt('Sale price:');
                        if (price) handleMarkAsSold(inv.id, price);
                      }}
                      className="text-sm px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Sell
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(inv.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> ) : 
        <p className="text-center text-gray-500 mt-4">
            No investments yet. Add one to get started !</p>
            
            
            }
      </div>
 </div>
    )


}