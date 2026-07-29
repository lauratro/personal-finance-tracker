import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { InvestmentsHistoryPage } from './pages/investment-page/investments-history-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { routePaths } from './navigation/main-navigation';
import { NetWorthPage } from './pages/net-worth-page/net-worth-page';

export default function App() {
  return (
    <Routes>
      <Route path={routePaths.root} element={<Navigate to={routePaths.login} replace />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.register} element={<RegisterPage />} />
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
    </Routes>
  );
}
