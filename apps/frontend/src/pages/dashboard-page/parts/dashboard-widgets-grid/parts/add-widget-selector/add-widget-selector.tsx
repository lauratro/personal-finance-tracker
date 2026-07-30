import { Button, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import {
  DashboardWidgetType,
  dashboardWidgetRegistry,
} from '../../../dashboard-widgets/dashboard-widget.registry';
import {AddWidgetSelectorProps} from "./add-widget-selector.types"


export const AddWidgetSelector = ({
  onAdd,
}: AddWidgetSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<DashboardWidgetType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const options = Object.entries(
    dashboardWidgetRegistry,
  ).map(([value, configuration]) => ({
    value,
    label: configuration.label,
  }));

  const handleAdd = async () => {
    if (!selectedType) {
      return;
    }

    try {
      setIsCreating(true);

      await onAdd(selectedType);

      setSelectedType(null);
      setIsOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        leftSection={<IconPlus size={18} />}
        onClick={() => setIsOpen(true)}
      >
        Add widget
      </Button>
    );
  }

  return (
    <div className="flex items-end gap-3">
      <Select
        label="Widget"
        placeholder="Select widget"
        data={options}
        value={selectedType}
        onChange={(value) =>
          setSelectedType(
            value as DashboardWidgetType | null,
          )
        }
      />

      <Button
        onClick={handleAdd}
        loading={isCreating}
        disabled={!selectedType}
      >
        Add
      </Button>

      <Button
        variant="default"
        onClick={() => {
          setSelectedType(null);
          setIsOpen(false);
        }}
      >
        Cancel
      </Button>
    </div>
  );
};