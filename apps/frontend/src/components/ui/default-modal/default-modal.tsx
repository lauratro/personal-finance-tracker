import { Modal } from '@mantine/core';
import { DefaultModalProps } from './default-modal.types';

export const DefaultModal = ({ isOpen, onClose, title, onAccept, onCancel, question }: DefaultModalProps) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title={title} centered>
      <div>
        <p className="text-lg font-bold mb-4">{question}</p>
        <div>
            <button onClick={onAccept} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Accept
            </button>
            <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2">
              Cancel
            </button>
        </div>
      </div>
    </Modal>
  );
};