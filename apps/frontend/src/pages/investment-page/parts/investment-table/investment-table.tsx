import { useEffect, useState } from 'react';
import {
  InvestmentHistory,
  getInvestmentHistories,
  deleteInvestmentHistory,
} from '../../../../investment-history';
import { Button } from '@mantine/core';
import { InvestmentEditor } from '../investment-editor';
import { TableTd , ButtonsContainer} from './investment-table.style';

export const InvestmentTable = () => {
  const [investments, setInvestments] = useState<InvestmentHistory[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);

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

  const handleEdit = (id: string) => {
    setSelectedInvestmentId(id);
    setEditorVisible(true);
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
        {
  isLoading ?    <p>Loading...</p> : investments.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Type</th>
              <th className="border p-2 text-center">Bought Date</th>
              <th className="border p-2 text-center">Amount Invested</th>
              <th className="border p-2 text-center">Cost per Unit</th>
              <th className="border p-2 text-center">Quantity</th>
              <th className="border p-2 text-center">Planned Price</th>
              <th className="border p-2 text-center">Sale Date</th>
              <th className="border p-2 text-center">Sale Price</th>
              <th className="border p-2 text-center">Income</th>
              <th className="border p-2 text-center">Income %</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <TableTd>{inv.name}</TableTd>
                <TableTd>{inv.assetType}</TableTd>
                <TableTd>
                  {new Date(inv.boughtDate).toLocaleDateString()}
                </TableTd>
                <TableTd className="text-right">€{inv.totalAmountInvested}</TableTd>
                <TableTd className="text-right">€{inv.costSingleStock}</TableTd>
                <TableTd className="text-right">{inv.quantity}</TableTd>
                <TableTd className="text-right">
                  {inv.plannedPriceToSell ? `€${inv.plannedPriceToSell}` : '-'}
                </TableTd>
                <TableTd className="border p-2 text-center">
                  {inv.saleDate ? new Date(inv.saleDate).toLocaleDateString() : '-'}
                </TableTd>
                <TableTd className="border p-2 text-right">
                  {inv.salePrice ? `€${inv.salePrice}` : '-'}
                </TableTd>
                <TableTd className="border p-2 text-right">
                  {inv.income !== null && inv.income !== undefined
                    ? `€${Number(inv.income).toFixed(2)}`
                    : '-'}
                </TableTd>
                <TableTd className="border p-2 text-right">
                  {inv.percentageIncome !== null &&
                  inv.percentageIncome !== undefined
                    ? `${Number(inv.percentageIncome).toFixed(2)}%`
                    : '-'}
                </TableTd>
                <TableTd className="border p-2 text-center">
                  <ButtonsContainer>
                    <Button
                    onClick={() => handleEdit(inv.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white mr-5 rounded "
                  >
      
                   Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(inv.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white ml-3 rounded"
                  >
                    Delete
                  </Button></ButtonsContainer>
                </TableTd>
              </tr>
            ))}
          </tbody>
        </table> ) : 
        <p className="text-center text-gray-500 mt-4">
            No investments yet. Add one to get started !</p>
            }
            <div>
              {
                isEditorVisible && <InvestmentEditor id={selectedInvestmentId}
                 setShowEditor={setEditorVisible} showEditor={isEditorVisible}
                 editorMode="edit" onSaved={fetchInvestments}/>
              }
            </div>
      </div>
 </div>
    )


}
