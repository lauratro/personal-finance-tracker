import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import {getNetWorthSnapshot, updateNetWorthSnapshot, createNetWorthSnapshot} from '../../../../pages-apis/net-worth';
import { NetWorthEditorFormValues, NetWorthSnapshotProps,  } from './net-worth-editor.types';
export const NetWorthEditor = ({ id, setShowEditor, showEditor, editorMode, onSaved }: NetWorthSnapshotProps) => {

    const formik = useFormik<NetWorthEditorFormValues>({
        initialValues: {
          monthStart: ''
        }, 
        onSubmit: (values) => {
            if (editorMode === 'create') {
                console.log('Creating new net worth snapshot with values:', values);
                createNetWorthSnapshot({ monthStart: values.monthStart, items: [] });
            } else {
                values.monthStart && id && updateNetWorthSnapshot(id, { monthStart: values.monthStart });
            }
            onSaved && onSaved();
        }
    });

    useEffect(() => {
        if(id && editorMode === 'edit' && showEditor) {
        const fetchSnapshot = async () => {
            const snapshot =  await getNetWorthSnapshot(id);
            formik.setValues({ monthStart: snapshot.monthStart });
        };
        fetchSnapshot();}
    }, [id, showEditor]);

    return (<div>
  <Modal
      opened={showEditor}
      onClose={() => setShowEditor(false)}
      title={editorMode === 'edit' ? 'Edit Net Worth Snapshot' : 'Create Net Worth Snapshot'}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          name="monthStart"
          type="date"
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