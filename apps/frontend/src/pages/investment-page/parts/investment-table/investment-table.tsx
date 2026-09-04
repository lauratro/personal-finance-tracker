import { useState } from 'react';
import { deleteInvestmentHistory } from '../../../../pages-apis/investment-history';
import { InvestmentEditor } from '../investment-editor';
import {
  TableTd,
  ButtonsContainer,
  HeaderCell,
} from './investment-table.style';
import { DeleteButton } from './../../../../components/ui/delete-button';
import { IconEdit } from '@tabler/icons-react';
import { InvestmentTableProps } from './investment-table.types';

export const InvestmentTable = ({
  investments,
  isLoading,
  onRefetch,
}: InvestmentTableProps) => {
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<
    string | null
  >(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestmentHistory(id);
      onRefetch();
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedInvestmentId(id);
    setEditorVisible(true);
  };

  return (
    <div className="p-4 overflow-x-scroll">
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : investments.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <HeaderCell className="bg-green">
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
                <th className="border p-2 text-center">Taxes</th>
                <th className="border p-2 text-center">Income</th>
                <th className="border p-2 text-center">Income %</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </HeaderCell>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <TableTd>{inv.name}</TableTd>
                  <TableTd>{inv.assetType}</TableTd>
                  <TableTd>
                    {new Date(inv.boughtDate).toLocaleDateString()}
                  </TableTd>
                  <TableTd className="text-right">
                    €{inv.totalAmountInvested}
                  </TableTd>
                  <TableTd className="text-right">
                    €{inv.costSingleStock}
                  </TableTd>
                  <TableTd className="text-right">{inv.quantity}</TableTd>
                  <TableTd className="text-right">
                    {inv.plannedPriceToSell
                      ? `€${inv.plannedPriceToSell}`
                      : '-'}
                  </TableTd>
                  <TableTd className="border p-2 text-center">
                    {inv.saleDate
                      ? new Date(inv.saleDate).toLocaleDateString()
                      : '-'}
                  </TableTd>
                  <TableTd className="border p-2 text-right">
                    {inv.salePrice ? `€${inv.salePrice}` : '-'}
                  </TableTd>
                  <TableTd className="border p-2 text-right">
                    {inv.taxes !== null && inv.taxes !== undefined
                      ? `€${Number(inv.taxes).toFixed(2)}`
                      : '-'}
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
                      <IconEdit
                        onClick={() => handleEdit(inv.id)}
                        color="var(--primary)"
                      />

                      <DeleteButton
                        title={'Confirm Delete'}
                        question={
                          'Are you sure you want to delete this investment?'
                        }
                        onAccept={() => handleDelete(inv.id)}
                      />
                    </ButtonsContainer>
                  </TableTd>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No investments yet. Add one to get started !
          </p>
        )}
        <div>
          {isEditorVisible && (
            <InvestmentEditor
              id={selectedInvestmentId}
              setShowEditor={setEditorVisible}
              showEditor={isEditorVisible}
              editorMode="edit"
              onSaved={onRefetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};
