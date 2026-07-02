import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { deleteNetWorthItem } from '@/pages-apis/net-worth';
import { NetWorthItemDeleteButtonProps } from './net-worth-item-delete-button.types';
import { DefaultModal } from '@/components/ui/default-modal';

export const NetWorthItemDeleteButton = ({
  itemId,
  snapshotId,
  onDeleted,
}: NetWorthItemDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);  
  const handleDelete = async () => {
    try {
      await deleteNetWorthItem(snapshotId, itemId);

      onDeleted?.();
    } catch (error) {
      console.error('Error deleting net worth item', error);
    }
  };

  return (
    <div>
    <IconTrash
      onClick={() => setIsOpen(true)}
      className="cursor-pointer text-red-500 hover:text-red-700"
    />
    <DefaultModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Confirm Delete"
                question="Are you sure you want to delete this net worth item?"
                onAccept={handleDelete}
                onCancel={() => setIsOpen(false)}
            />
    </div>
  );
};
