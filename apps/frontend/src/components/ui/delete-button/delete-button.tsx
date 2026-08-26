import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { DefaultModal } from '@/components/ui/default-modal';
import { DeleteButtonProps } from './delete-button.types';

export const DeleteButton = ({
  onAccept,
  title,
  question,
}: DeleteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <button aria-label={title} onClick={() => setIsModalOpen(true)}>
        <IconTrash color="red" />
      </button>{' '}
      <DefaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        question={question}
        onAccept={onAccept}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};
