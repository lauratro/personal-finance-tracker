import { netWorthRoute } from '@/routes/net-worth.routes';
import { dashboardRoute } from '../routes/dashboard.routes';
import { investmentsHistoryRoute } from '../routes/investments-history.routes';
import { loginRoute } from '../routes/login.routes';
import { registerRoute } from '../routes/register.routes';
import { twoFactorRoute } from '../routes/two-factor.routes';
import { securityRoute } from '../routes/security.routes';
import { profileRoute } from '../routes/profile.routes';

export const routePaths = {
  root: '/',
  login: loginRoute,
  register: registerRoute,
  twoFactor: twoFactorRoute,
  security: securityRoute,
  profile: profileRoute,
  dashboard: dashboardRoute,
  investmentsHistory: investmentsHistoryRoute,
  netWorth: netWorthRoute,
};

export const protectedRoutes = [dashboardRoute, investmentsHistoryRoute];

export const defaultRoute = loginRoute;
