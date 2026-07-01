import { CreateNetWorthItemPayload } from '../../../../pages-apis/net-worth/net-worth.types';

export type EditorMode = 'create' | 'edit';

export interface NetWorthSnapshotProps {
  id?: string;
    setShowEditor: (show: boolean) => void;
    showEditor: boolean;
    editorMode: EditorMode;
    onSaved?: () => void;
}

export type NetWorthEditorFormValues = {
  monthStart: string;
  items: CreateNetWorthItemPayload[];
};
