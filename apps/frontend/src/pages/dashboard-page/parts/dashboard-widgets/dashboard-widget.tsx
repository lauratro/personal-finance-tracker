import { Select } from '@mantine/core';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

import {
  DashboardWidgetType,
  dashboardWidgetRegistry,
} from './dashboard-widget.registry';

type DashboardWidgetProps = {
  widgetId: string;
  type?: DashboardWidgetType;
  onSelect: (
    widgetId: string,
    widgetType: DashboardWidgetType,
  ) => void;
  onRemove: (widgetId: string) => void;
};

export const DashboardWidget = ({
  widgetId,
  type,
  onSelect,
  onRemove,
}: DashboardWidgetProps) => {
  const WidgetComponent = type
    ? dashboardWidgetRegistry[type].component
    : null;

  const options = Object.entries(dashboardWidgetRegistry).map(
    ([value, configuration]) => ({
      value,
      label: configuration.label,
    }),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 p-3">
        <button
          type="button"
          className="dashboard-drag-handle cursor-grab"
          aria-label="Move widget"
        >
          <IconGripVertical size={20} />
        </button>

        <Select
          className="flex-1"
          placeholder="Select chart"
          data={options}
          value={type ?? null}
          onChange={(value) => {
            if (value) {
              onSelect(
                widgetId,
                value as DashboardWidgetType,
              );
            }
          }}
        />

        <button
          type="button"
          onClick={() => onRemove(widgetId)}
          aria-label="Remove widget"
        >
          <IconTrash size={19} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-3">
        {WidgetComponent ? (
          <WidgetComponent />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Select a chart to display
          </div>
        )}
      </div>
    </div>
  );
};