import {NetWorthDeleteButtonProps} from "./net-worth-delete-button.types";
import {IconTrash} from "@tabler/icons-react";
import {DefaultModal} from "@/components/ui/default-modal";
import { useState } from "react";

export const NetWorthDeleteButton = ({ snapshotId, onDeleted }: NetWorthDeleteButtonProps) => {
const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDelete = async () => {      
        try {
            const response = await fetch(`/api/net-worth/${snapshotId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete net worth snapshot');
            }

            console.log('Net worth snapshot deleted successfully');
            if (onDeleted) {
                onDeleted();
            }
        } catch (error) {
            console.error('Error deleting net worth snapshot:', error);
        }
    }

    return (
        <>
            <IconTrash color="red" onClick={() => setIsModalOpen(true)} />
            <DefaultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Delete"
                question="Are you sure you want to delete this net worth snapshot?"
                onAccept={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );  
}