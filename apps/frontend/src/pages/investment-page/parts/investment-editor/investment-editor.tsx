import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import {
  AssetType,
  createInvestmentHistory,
  getInvestmentHistory,
  updateInvestmentHistory,
} from '../../../../investment-history';
import { InvestmentEditorProps } from './investiment-editor.types';

type FormState = {
  name: string;
  assetType: AssetType;
  boughtDate: string;
  totalAmountInvested: number;
  costSingleStock: number;
  quantity: number;
  plannedPriceToSell?: number | string;
  saleDate: string;
  salePrice?: number | string;
  taxes?: number | string;
};

const emptyValues: FormState = {
  name: '',
  assetType: '' as AssetType,
  boughtDate: '',
  totalAmountInvested: 0,
  costSingleStock: 0,
  quantity: 0,
  plannedPriceToSell: undefined,
  saleDate: '',
  salePrice: undefined,
  taxes: undefined,
};

const optionalNumber = (value: number | string | undefined) =>
  value === undefined || value === '' ? undefined : Number(value);

export const InvestmentEditor = ({
  id,
  setShowEditor,
  showEditor,
  editorMode,
  onSaved,
}: InvestmentEditorProps) => {
  const formik = useFormik<FormState>({
    initialValues: emptyValues,
    validate: (values) => {
      if (editorMode !== 'edit') return {};

      const errors: Partial<Record<keyof FormState, string>> = {};
      const hasSaleDate = Boolean(values.saleDate);
      const hasSalePrice =
        values.salePrice !== undefined && values.salePrice !== '';

      if (hasSaleDate && !hasSalePrice) {
        errors.salePrice = 'Sale price is required when sale date is set';
      }
      if (hasSalePrice && !hasSaleDate) {
        errors.saleDate = 'Sale date is required when sale price is set';
      }

      return errors;
    },
    onSubmit: async (values) => {
      const commonPayload = {
        name: values.name,
        assetType: values.assetType,
        boughtDate: new Date(values.boughtDate).toISOString(),
        totalAmountInvested: Number(values.totalAmountInvested),
        costSingleStock: Number(values.costSingleStock),
        quantity: Number(values.quantity),
        plannedPriceToSell: optionalNumber(values.plannedPriceToSell),
        taxes: optionalNumber(values.taxes) ?? null,
      };

      try {
        if (editorMode === 'edit') {
          if (!id) return;
          await updateInvestmentHistory(id, {
            ...commonPayload,
            saleDate: values.saleDate
              ? new Date(values.saleDate).toISOString()
              : null,
            salePrice: optionalNumber(values.salePrice) ?? null,
          });
        } else {
          await createInvestmentHistory(commonPayload);
        }

        setShowEditor(false);
        onSaved?.();
      } catch (error) {
        console.error('Error saving investment:', error);
      }
    },
  });

  useEffect(() => {
    if (editorMode !== 'edit' || !id || !showEditor) {
      formik.setValues(emptyValues);
      return;
    }

    const loadInvestment = async () => {
      try {
        const investment = await getInvestmentHistory(id);

        formik.setValues({
          name: investment.name,
          assetType: investment.assetType,
          boughtDate: investment.boughtDate.slice(0, 10),
          totalAmountInvested: investment.totalAmountInvested,
          costSingleStock: investment.costSingleStock,
          quantity: investment.quantity,
          plannedPriceToSell: investment.plannedPriceToSell ?? undefined,
          saleDate: investment.saleDate?.slice(0, 10) ?? '',
          salePrice: investment.salePrice ?? undefined,
          taxes: investment.taxes ?? undefined,
        });
      } catch (error) {
        console.error('Error loading investment:', error);
      }
    };

    void loadInvestment();
  }, [id, editorMode, showEditor]);

  return (
    <Modal
      opened={showEditor}
      onClose={() => setShowEditor(false)}
      title={editorMode === 'edit' ? 'Edit Investment' : 'Create Investment'}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          name="name"
          label="Investment Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          required
        />

        <Select
          name="assetType"
          label="Asset Type"
          data={Object.values(AssetType)}
          value={formik.values.assetType}
          onChange={(value) => formik.setFieldValue('assetType', value)}
          required
        />

        <TextInput
          type="date"
          label="Bought Date"
          name="boughtDate"
          value={formik.values.boughtDate}
          onChange={formik.handleChange}
          required
        />

        <TextInput
          type="number"
          label="Total Amount Invested"
          name="totalAmountInvested"
          value={formik.values.totalAmountInvested}
          onChange={formik.handleChange}
          required
        />

        <TextInput
          type="number"
          label="Cost per Unit"
          name="costSingleStock"
          value={formik.values.costSingleStock}
          onChange={formik.handleChange}
          required
        />

        <TextInput
          type="number"
          label="Quantity"
          name="quantity"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          required
        />

        <TextInput
          type="number"
          label="Planned Price to Sell"
          name="plannedPriceToSell"
          value={formik.values.plannedPriceToSell ?? ''}
          onChange={formik.handleChange}
        />

        {editorMode === 'edit' && (
          <>
            <TextInput
              type="date"
              label="Sale Date"
              name="saleDate"
              value={formik.values.saleDate}
              onChange={formik.handleChange}
              error={formik.touched.saleDate && formik.errors.saleDate}
            />

            <TextInput
              type="number"
              label="Sale Price"
              name="salePrice"
              value={formik.values.salePrice ?? ''}
              onChange={formik.handleChange}
              error={formik.touched.salePrice && formik.errors.salePrice}
            />

                 <TextInput
              type="number"
              label="Taxes"
              name="taxes"
              value={formik.values.taxes ?? ''}
              onChange={formik.handleChange}
              error={formik.touched.taxes && formik.errors.taxes}
            />
          </>
        )}

        <Button type="submit" mt="md">
          Save
        </Button>
      </form>
    </Modal>
  );
};
