import {NetWorthItemDeleteButtonProps} from "./net-worth-item-delete-button.types";
import { deleteNetWorthItem } from "@/pages-apis/net-worth";
import { IconTrash } from '@tabler/icons-react';
export const NetWorthItemDeleteButton = ({ itemId, snapshotId }: NetWorthItemDeleteButtonProps ) => {

  const deleteItem = async (itemId: string, snapshotId: string) => {
      await deleteNetWorthItem(snapshotId, itemId);
       }

    return (
     <div>
   <IconTrash onClick={() => deleteItem(itemId, snapshotId)} className="cursor-pointer text-red-500 hover:text-red-700" / >
    </div>
      )
    }         