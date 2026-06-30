import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import {getNetWorthSnapshot, updateNetWorthSnapshot} from '../../../../pages-apis/net-worth';
import { NetWorthEditorFormValues, NetWorthSnapshotProps,  } from './net-worth-editor.types';
export const NetWorthEditor = ({ id, setShowEditor, showEditor, editorMode, onSaved }: NetWorthSnapshotProps) => {

    const formik = useFormik<NetWorthEditorFormValues>({
        initialValues: {
          monthStart: ''
        }, 
        onSubmit: (values) => {
            values.monthStart && updateNetWorthSnapshot(id, { monthStart: values.monthStart });
        }
    });

    useEffect(() => {
        const fetchSnapshot = async () => {
            const snapshot = await getNetWorthSnapshot(id);
            formik.setValues({ monthStart: snapshot.monthStart });
        };
        fetchSnapshot();
    }, [id, showEditor]);

    return (<div>
  <Modal
      opened={showEditor}
      onClose={() => setShowEditor(false)}
      title={editorMode === 'edit' ? 'Edit Investment' : 'Create Investment'}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          name="monthStart"
          label="Month Start"
          value={formik.values.monthStart}
          onChange={formik.handleChange}
          required
        />
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  </div>
  );
}