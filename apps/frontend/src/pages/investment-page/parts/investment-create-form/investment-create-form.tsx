import { Button , Input, Select} from '@mantine/core';
import { useState } from 'react';
import {
  createInvestmentHistory,
  AssetType,
} from '../../../../investment-history';


export const InvestmentCreateForm = () => {
  const [showForm, setShowForm] = useState(false);

const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };
  return    (
  <div className="mb-6">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Investment'}
        </Button>


         {showForm && (
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <h2 className="text-xl font-bold mb-4">Add New Investment</h2>
                  <form onSubmit={handleCreate}>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Investment Name"
                        required
                        className="border p-2 rounded"
                      />
                      <select
                        name="assetType"
                        required
                        className="border p-2 rounded"
                      >
                        <option value="">Select Type</option>
                        {Object.values(AssetType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <Input
                        type="date"
                        name="boughtDate"
                        required
                        className="border p-2 rounded"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        name="totalAmountInvested"
                        placeholder="Total Amount Invested"
                        required
                        className="border p-2 rounded"
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        name="costSingleStock"
                        placeholder="Cost per Unit"
                        required
                        className="border p-2 rounded"
                      />
                      <Input
                        type="number"
                        step="0.00000001"
                        name="quantity"
                        placeholder="Quantity"
                        required
                        className="border p-2 rounded"
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        name="plannedPriceToSell"
                        placeholder="Planned Price to Sell (Optional)"
                        className="border p-2 rounded"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Create Investment
                    </Button>
                  </form>
                </div>
              )}
 </div>)
}