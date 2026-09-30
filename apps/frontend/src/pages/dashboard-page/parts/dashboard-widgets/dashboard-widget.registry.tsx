import { lazy } from 'react';

const RealizedIncomeByYearChart = lazy(() =>
  import('./../../../investment-page/parts/charts/realized-income-by-year').then(
    (module) => ({ default: module.RealizedIncomeByYearChart }),
  ),
);
const MonthlyIncomeSpecificYearChart = lazy(() =>
  import('./../../../investment-page/parts/charts/monthly-income-specific-year').then(
    (module) => ({ default: module.MonthlyIncomeSpecificYearChart }),
  ),
);
const NetWorthTrendChart = lazy(() =>
  import('./../../../net-worth-page/parts/net-worth-charts/net-worth-trends-chart').then(
    (module) => ({ default: module.NetWorthTrendChart }),
  ),
);

export const dashboardWidgetRegistry = {
  yearlyIncome: {
    label: 'Realized income by year',
    component: RealizedIncomeByYearChart,
  },
  monthlyIncome: {
    label: 'Realized income by month',
    component: MonthlyIncomeSpecificYearChart,
  },
  netWorthTrend: {
    label: 'Networth Trends',
    component: NetWorthTrendChart,
  },
} as const;

export type DashboardWidgetType = keyof typeof dashboardWidgetRegistry;
