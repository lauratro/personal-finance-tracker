import { useCallback, useEffect, useState } from 'react';
import {
  createDashboard,
  getDashboard,
} from '@/pages-apis/dashboard';
import { DashboardWidgetsGrid } from '../dashboard-widgets-grid';

export const DashboardComponent = () => {
  const [dashboardId, setDashboardId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const initializeDashboard = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(undefined);

        const dashboard = await getDashboard();

        if (dashboard) {
          setDashboardId(dashboard.id);
          return;
        }

        const createdDashboard = await createDashboard();
        setDashboardId(createdDashboard.id);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('The dashboard could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void initializeDashboard();
  }, [initializeDashboard]);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="form-error" role="alert">
        <span>{error}</span>{' '}
        <button type="button" onClick={() => void initializeDashboard()}>
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardId) {
    return <div>Dashboard not available.</div>;
  }

  return <DashboardWidgetsGrid />;
};
