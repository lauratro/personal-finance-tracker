import { DashboardWidgetType } from "../../../dashboard-widgets/dashboard-widget.registry";
export type AddWidgetSelectorProps = {
  onAdd: (
    type: DashboardWidgetType,
  ) => Promise<void>;
};