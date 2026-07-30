import { DashboardWidget } from "@/pages/dashboard-page/parts/dashboard-widgets/dashboard-widget";
import { DashboardWidgetType } from "@/pages/dashboard-page/parts/dashboard-widgets/dashboard-widget.registry";
export type DashboardUser = {
  id: string,
  userId :string,
  createdAt: string,
  updatedAt: string,
}
export type DashboardWidgetBase = {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};

export type DashboardWidgetItem = DashboardWidgetBase & {
  id: string;
  dashboardId: string;
    type: DashboardWidgetType;
};

export type CreateDashboardWidgetItem =
  DashboardWidgetBase & {
type: DashboardWidgetType;
  }


