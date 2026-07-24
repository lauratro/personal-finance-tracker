import { useState } from "react";
import { Button } from "@mantine/core";
import { NetWorthEditor } from "../net-worth-editor/net-worth-editor";

type CreateNetWorthButtonProps = {
  onCreated?: () => void;
};

export const CreateNetWorthButton = ({ onCreated }: CreateNetWorthButtonProps) => {
    const [showForm, setShowForm] = useState(false);
    return (
         <div className="mb-0 mt-6 md:mt-0 md:mb-6">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 button-primary text-white rounded"
                >
                  {showForm ? 'Cancel' : 'Add Net Worth Snapshot'}
                </Button>
                <NetWorthEditor setShowEditor={setShowForm} showEditor={showForm}
                  editorMode="create" onSaved={() => {
                    setShowForm(false);
                    onCreated?.();
                  }}/>
                </div>
  );
}
