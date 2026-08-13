import {
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react';

import {
  DashboardWidgetType,
  dashboardWidgetRegistry,
} from './dashboard-widget.registry';

type DashboardWidgetProps = {
  widgetId: string;
  type: DashboardWidgetType;
  onRemove: (widgetId: string) => void;
};

export const DashboardWidget = ({
  widgetId,
  type,
  onRemove,
}: DashboardWidgetProps) => {
  const configuration =
    dashboardWidgetRegistry[type];

  const WidgetComponent = configuration.component;

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

        <div className="flex-1 font-medium">
          {configuration.label}
        </div>

        <button
          type="button"
          onClick={() => onRemove(widgetId)}
          aria-label="Remove widget"
        >
          <IconTrash size={19} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-3">
        <WidgetComponent />
      </div>
    </div>
  );
};