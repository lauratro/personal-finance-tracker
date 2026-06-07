import { useState } from "react";
import { Button } from "@mantine/core";
import { InvestmentEditor } from "../investment-editor/investment-editor";
type InvestmentCreateButtonProps = {
  onCreated?: () => void;
};

export const InvestmentCreateButton = ({ onCreated }: InvestmentCreateButtonProps) => {
    const [showForm, setShowForm] = useState(false);
    return (
         <div className="mb-6">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {showForm ? 'Cancel' : 'Add Investment'}
                </Button>
                <InvestmentEditor id={null} setShowEditor={setShowForm} showEditor={showForm}
                  editorMode="create" onSaved={onCreated}/>
                </div>
    )
}
