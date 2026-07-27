import { useState } from "react";
import { Button } from "@mantine/core";
import { InvestmentEditor } from "../investment-editor/investment-editor";
type InvestmentCreateButtonProps = {
  onCreated?: () => void;
};

export const InvestmentCreateButton = ({ onCreated }: InvestmentCreateButtonProps) => {
    const [showForm, setShowForm] = useState(false);
    return (
         <div className="p-4">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="button-primary"
                >
                  {showForm ? 'Cancel' : 'Add Investment'}
                </Button>
                <InvestmentEditor id={null} setShowEditor={setShowForm} showEditor={showForm}
                  editorMode="create" onSaved={onCreated}/>
                </div>
    )
}
