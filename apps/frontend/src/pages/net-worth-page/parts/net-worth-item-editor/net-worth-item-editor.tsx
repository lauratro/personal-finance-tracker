import { ActionIcon, Alert, Button, Modal, NumberInput, Select, TextInput } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
  createNetWorthItem,
  getNetWorthItem,
  updateNetWorthItem,
} from '../../../../pages-apis/net-worth';
import {
  CreateNetWorthItemPayload,
  NetWorthCategory,
} from '../../../../pages-apis/net-worth/net-worth.types';

type EditorMode = 'create' | 'edit';

type NetWorthItemEditorProps = {
  snapshotId?: string;
  itemId?: string;
  editorMode?: EditorMode;
  onAdd?: (item: CreateNetWorthItemPayload) => void;
  onSaved?: () => void;
};

type FormValues = {
  name: string;
  category: NetWorthCategory | '';
  value: number | string;
};

const emptyValues: FormValues = {
  name: '',
  category: '',
  value: '',
};

const categoryOptions = [
  { value: NetWorthCategory.CHECKING_ACCOUNT, label: 'Checking account' },
  { value: NetWorthCategory.SAVINGS_ACCOUNT, label: 'Savings account' },
  { value: NetWorthCategory.INVESTMENTS, label: 'Investments' },
  { value: NetWorthCategory.CASH, label: 'Cash' },
  { value: NetWorthCategory.CRYPTO, label: 'Crypto' },
  { value: NetWorthCategory.REAL_ESTATE, label: 'Real estate' },
  { value: NetWorthCategory.OTHER, label: 'Other' },
];

export const NetWorthItemEditor = ({
  snapshotId,
  itemId,
  editorMode = 'create',
  onAdd,
  onSaved,
}: NetWorthItemEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: emptyValues,
    validate: (values) => {
      const errors: Partial<Record<keyof FormValues, string>> = {};

      if (!values.name.trim()) errors.name = 'Name is required';
      if (!values.category) errors.category = 'Category is required';
      if (values.value === '' || Number(values.value) < 0) {
        errors.value = 'Value must be zero or greater';
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (!values.category) return;

      setIsLoading(true);
      setError(null);

      const payload = {
        name: values.name.trim(),
        category: values.category,
        value: Number(values.value),
      };

      try {
        if (onAdd) {
          onAdd(payload);
          setIsOpen(false);
          formik.resetForm();
          return;
        }

        if (!snapshotId) {
          setError('The snapshot id is required to save an item.');
          return;
        }

        if (editorMode === 'edit') {
          if (!itemId) {
            setError('The item id is required to edit an item.');
            return;
          }
          await updateNetWorthItem(snapshotId, itemId, payload);
        } else {
          await createNetWorthItem(snapshotId, payload);
        }

        setIsOpen(false);
        formik.resetForm();
        onSaved?.();
      } catch (saveError) {
        console.error('Error saving net worth item:', saveError);
        setError('Unable to save the net worth item.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    setError(null);

    if (editorMode !== 'edit' || !itemId || !snapshotId) {
      formik.resetForm();
      return;
    }

    const loadItem = async () => {
      setIsLoading(true);
      try {
        const item = await getNetWorthItem(snapshotId, itemId);
        formik.setValues({
          name: item.name,
          category: item.category,
          value: Number(item.value),
        });
      } catch (loadError) {
        console.error('Error loading net worth item:', loadError);
        setError('Unable to load the net worth item.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadItem();
  }, [editorMode, isOpen, itemId, snapshotId]);

  const closeEditor = () => {
    setIsOpen(false);
    setError(null);
    formik.resetForm();
  };

  return (
    <>

<ActionIcon onClick={()=>setIsOpen(true)} variant="light" color="light blue" size="sm">
  {editorMode === 'edit' ?  <IconEdit color="blue" size={18} /> : <IconPlus color="blue" size={18} />}
</ActionIcon>
      <Modal
        opened={isOpen}
        onClose={closeEditor}
        title={editorMode === 'edit' ? 'Edit Net Worth Item' : 'Add Net Worth Item'}
      >
        <form onSubmit={formik.handleSubmit}>
          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <TextInput
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            disabled={isLoading}
            required
          />

          <Select
            name="category"
            label="Category"
            data={categoryOptions}
            value={formik.values.category || null}
            onChange={(value) => formik.setFieldValue('category', value ?? '')}
            onBlur={() => formik.setFieldTouched('category', true)}
            error={formik.touched.category && formik.errors.category}
            disabled={isLoading}
            mt="sm"
            required
          />

          <NumberInput
            name="value"
            label="Value"
            value={formik.values.value}
            onChange={(value) => formik.setFieldValue('value', value)}
            onBlur={() => formik.setFieldTouched('value', true)}
            error={formik.touched.value && formik.errors.value}
            min={0}
            decimalScale={2}
            fixedDecimalScale
            disabled={isLoading}
            mt="sm"
            required
          />

          <Button type="submit" loading={isLoading} mt="md">
            Save
          </Button>
        </form>
      </Modal>
    </>
  );
};
