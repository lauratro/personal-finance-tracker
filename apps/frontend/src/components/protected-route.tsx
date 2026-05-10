import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../auth/auth-context';
import { routePaths } from '../navigation/main-navigation';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div className="page-center">Checking your session...</div>;
  }

  if (!accessToken) {
    return <Navigate to={routePaths.login} replace />;
  }

  return <>{children}</>;
}
