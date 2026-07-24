import { Button, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import {
  createInvestmentHistory,
  AssetType,
} from '../../../../pages-apis/investment-history';
import { useFormik} from 'formik';

interface FormState {
  name: string;
  assetType: AssetType;
  boughtDate: string;
  totalAmountInvested: number;
  costSingleStock: number;
  quantity: number;
  plannedPriceToSell?: number;
}
export const InvestmentCreateForm = () => {
  const [showForm, setShowForm] = useState(false);

  const formik = useFormik<FormState>({
    initialValues: {
      name: '',
      assetType: '' as AssetType,
      boughtDate: '',
      totalAmountInvested: 0,
      costSingleStock: 0,
      quantity: 0,
      plannedPriceToSell: undefined,
    },
    onSubmit: async (values) => {
      try {
        await createInvestmentHistory(values);
        setShowForm(false);
      } catch (error) {
        console.error('Error creating investment:', error);
      }
    },
  });

  return    (
  <div className="mb-6">
        <Button
         onClick={() => setShowForm(!showForm)}
         className="button-primary"
        >
          {showForm ? 'Cancel' : 'Add Investmentt'}
        </Button>


         {showForm && (
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <h2 className="text-xl font-bold mb-4">Add New Investment</h2>
                  <form onSubmit={formik.handleSubmit}>
  <TextInput
    name="name"
    label='Investment Name'
    placeholder="Investment Name"
    value={formik.values.name}
    onChange={formik.handleChange}
    required
  />

  <Select
    name="assetType"
    label='Asset Type'
    placeholder="Select Type"
    data={Object.values(AssetType)}
    value={formik.values.assetType}
    onChange={(value) =>
      formik.setFieldValue('assetType', value)
    }
    required
  />

  <TextInput
    type="date"
    label='Bought Date'
    placeholder="Bought Date"
    name="boughtDate"
    value={formik.values.boughtDate}
    onChange={formik.handleChange}
    required
  />

  <TextInput
    type="number"
    label='Total Amount Invested'
    name="totalAmountInvested"
    value={formik.values.totalAmountInvested}
    onChange={formik.handleChange}
    required
  />

  <TextInput
    type="number"
    label='Cost per Unit'
    name="costSingleStock"
    value={formik.values.costSingleStock}
    onChange={formik.handleChange}
    required
  />

  <TextInput
    type="number"
    label='Quantity'
    name="quantity"
    value={formik.values.quantity}
    onChange={formik.handleChange}
    required
  />

  <TextInput
    type="number"
    label='Planned Price to Sell'
    name="plannedPriceToSell"
    value={formik.values.plannedPriceToSell ?? ''}
    onChange={formik.handleChange}
  />

  <Button type="submit" mt="md">
    Create Investment
  </Button>
</form>
                </div>
              )}
 </div>)
}
