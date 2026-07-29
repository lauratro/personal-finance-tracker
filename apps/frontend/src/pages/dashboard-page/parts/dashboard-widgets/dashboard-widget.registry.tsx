import { RealizedIncomeByYearChart } from "./../../../investment-page/parts/charts/realized-income-by-year"
import { MonthlyIncomeSpecificYearChart } from './../../../investment-page/parts/charts/monthly-income-specific-year';
import { NetWorthTrendChart } from "./../../../net-worth-page/parts/net-worth-charts/net-worth-trends-chart"

export const dashboardWidgetRegistry = {
  yearlyIncome: {
    label: 'Realized income by year',
    component: RealizedIncomeByYearChart,
  },
  monthlyIncome: {
    label: 'Realized income by month',
    component: MonthlyIncomeSpecificYearChart,
  },
  networthTrends:{
    label: "Networth Trends",
    component: NetWorthTrendChart
  }
} as const;

export type DashboardWidgetType = keyof typeof dashboardWidgetRegistry;