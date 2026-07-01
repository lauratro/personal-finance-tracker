import { useState } from "react";
import { Button } from "@mantine/core";
import { NetWorthEditor } from "../net-worth-editor/net-worth-editor";

type CreateNetWorthButtonProps = {
  onCreated?: () => void;
};

export const CreateNetWorthButton = ({ onCreated }: CreateNetWorthButtonProps) => {
    const [showForm, setShowForm] = useState(false);
    return (
         <div className="mb-6">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
