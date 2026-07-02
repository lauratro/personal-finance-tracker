export interface DefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  question: string;
  onAccept: () => void;
  onCancel: () => void;
}   