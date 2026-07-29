import { DashboardWidgetType } from './parts/dashboard-widgets/dashboard-widget.registry';

export type DashboardWidget = {
  id: string;
  type?: DashboardWidgetType;
};

export type DashboardLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
};