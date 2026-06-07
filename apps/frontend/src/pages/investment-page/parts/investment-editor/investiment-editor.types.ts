export type EditorMode = 'create' | 'edit';

export interface InvestmentEditorProps {
  id: string | null;
  setShowEditor: (show: boolean) => void;
  showEditor: boolean;
  editorMode: EditorMode;
  onSaved?: () => void;
}
