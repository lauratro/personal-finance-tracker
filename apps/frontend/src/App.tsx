import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';
import { routePaths } from './navigation/main-navigation';

const DashboardPage = lazy(() =>
  import('./pages/dashboard-page/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  })),
);
const InvestmentsHistoryPage = lazy(() =>
  import('./pages/investment-page/investments-history-page').then((module) => ({
    default: module.InvestmentsHistoryPage,
  })),
);
const LoginPage = lazy(() =>
  import('./pages/login-page').then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import('./pages/register-page').then((module) => ({
    default: module.RegisterPage,
  })),
);
const NetWorthPage = lazy(() =>
  import('./pages/net-worth-page/net-worth-page').then((module) => ({
    default: module.NetWorthPage,
  })),
);
const TwoFactorPage = lazy(() =>
  import('./pages/two-factor-page').then((module) => ({
    default: module.TwoFactorPage,
  })),
);
const ProfilePage = lazy(() =>
  import('./pages/profile-page').then((module) => ({
    default: module.ProfilePage,
  })),
);

const RouteLoadingFallback = () => (
  <main
    className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10"
    role="status"
  >
    <span className="sr-only">Loading page…</span>
    <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
    <div className="h-5 w-72 max-w-full animate-pulse rounded bg-gray-100" />
    <div className="mt-10 h-72 animate-pulse rounded-2xl bg-gray-100" />
  </main>
);

export default function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route
          path={routePaths.root}
          element={<Navigate to={routePaths.login} replace />}
        />
        <Route path={routePaths.login} element={<LoginPage />} />
        <Route path={routePaths.register} element={<RegisterPage />} />
        <Route path={routePaths.twoFactor} element={<TwoFactorPage />} />
        <Route
          path={routePaths.dashboard}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routePaths.investmentsHistory}
          element={
            <ProtectedRoute>
              <InvestmentsHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routePaths.netWorth}
          element={
            <ProtectedRoute>
              <NetWorthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routePaths.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routePaths.security}
          element={<Navigate to={routePaths.profile} replace />}
        />
      </Routes>
    </Suspense>
  );
}
