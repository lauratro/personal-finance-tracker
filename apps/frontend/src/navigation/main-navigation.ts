import { netWorthRoute } from '@/routes/net-worth.routes';
import { dashboardRoute } from '../routes/dashboard.routes';
import { investmentsHistoryRoute } from '../routes/investments-history.routes';
import { loginRoute } from '../routes/login.routes';
import { registerRoute } from '../routes/register.routes';

export const routePaths = {
  root: '/',
  login: loginRoute,
  register: registerRoute,
  dashboard: dashboardRoute,
  investmentsHistory: investmentsHistoryRoute,
  netWorth: netWorthRoute,
};

export const protectedRoutes = [dashboardRoute, investmentsHistoryRoute];

export const defaultRoute = loginRoute;
