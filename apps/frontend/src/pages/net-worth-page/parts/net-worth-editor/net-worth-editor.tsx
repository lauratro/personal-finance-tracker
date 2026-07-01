import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
  createNetWorthSnapshot,
  getNetWorthSnapshot,
  updateNetWorthSnapshot,
} from '../../../../pages-apis/net-worth';
import { NetWorthItemEditor } from '../net-worth-item-editor';
import {
  NetWorthEditorFormValues,
  NetWorthSnapshotProps,
} from './net-worth-editor.types';

const emptyValues: NetWorthEditorFormValues = {
  monthStart: '',
  items: [],
};

export const NetWorthEditor = ({
  id,
  setShowEditor,
  showEditor,
  editorMode,
  onSaved,
}: NetWorthSnapshotProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);

  const formik = useFormik<NetWorthEditorFormValues>({
    initialValues: emptyValues,
    validate: (values) => {
      if (editorMode === 'create' && values.items.length === 0) {
        return { items: 'Add at least one item to the snapshot' };
      }
      return {};
    },
    onSubmit: async (values) => {
      setSaveError(null);

      try {
        if (editorMode === 'create') {
          await createNetWorthSnapshot({
            monthStart: values.monthStart,
            items: values.items,
          });
        } else if (id) {
          await updateNetWorthSnapshot(id, {
            monthStart: values.monthStart,
          });
        }

        setShowEditor(false);
        formik.resetForm();
        onSaved?.();
      } catch (error) {
        console.error('Error saving net worth snapshot:', error);
        setSaveError('Unable to save the net worth snapshot.');
      }
    },
  });

  useEffect(() => {
    if (!showEditor) return;

    setSaveError(null);

    if (editorMode !== 'edit' || !id) {
      formik.resetForm();
      return;
    }

    const fetchSnapshot = async () => {
      try {
        const snapshot = await getNetWorthSnapshot(id);
        formik.setValues({
          monthStart: snapshot.monthStart.slice(0, 10),
          items: [],
        });
      } catch (error) {
        console.error('Error loading net worth snapshot:', error);
        setSaveError('Unable to load the net worth snapshot.');
      }
    };

    void fetchSnapshot();
  }, [editorMode, id, showEditor]);

  const closeEditor = () => {
    setShowEditor(false);
    setSaveError(null);
    formik.resetForm();
  };

  return (
    <Modal
      opened={showEditor}
      onClose={closeEditor}
      title={editorMode === 'edit' ? 'Edit Net Worth Snapshot' : 'Create Net Worth Snapshot'}
      size="lg"
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          {saveError && <Alert color="red">{saveError}</Alert>}

          <TextInput
            name="monthStart"
            type="date"
            label="Month Start"
            value={formik.values.monthStart}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />

          {editorMode === 'create' && (
            <>
              <Group justify="space-between">
                <Text fw={600}>Items</Text>
                <NetWorthItemEditor
                  onAdd={(item) => {
                    void formik.setFieldValue('items', [...formik.values.items, item]);
                    void formik.setFieldTouched('items', true);
                  }}
                />
              </Group>

              {formik.values.items.length === 0 ? (
                <Text c="dimmed" size="sm">
                  No items added yet.
                </Text>
              ) : (
                <Stack gap="xs">
                  {formik.values.items.map((item, index) => (
                    <Group key={`${item.name}-${index}`} justify="space-between">
                      <div>
                        <Text fw={500}>{item.name}</Text>
                        <Text c="dimmed" size="sm">
                          {item.category} · {item.value.toFixed(2)}
                        </Text>
                      </div>
                      <Button
                        type="button"
                        color="red"
                        variant="subtle"
                        onClick={() => {
                          void formik.setFieldValue(
                            'items',
                            formik.values.items.filter((_, itemIndex) => itemIndex !== index),
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </Group>
                  ))}
                </Stack>
              )}

              {formik.touched.items && typeof formik.errors.items === 'string' && (
                <Text c="red" size="sm">
                  {formik.errors.items}
                </Text>
              )}
            </>
          )}

          <Button type="submit" loading={formik.isSubmitting}>
            Save snapshot
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
