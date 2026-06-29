import { useEffect, useState } from 'react';
import { PageContainer } from '../containers/page-container/page-container';
import { getCurrentUser } from '../pages-apis/auth/auth-api';
import type { SafeUser } from '../pages-apis/auth/auth-types';

export const DashboardPage = () => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer title="Dashboard" description="Welcome to your personal finance dashboard!">
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="Welcome to your personal finance dashboard!">
      <h1 className="text-3xl font-bold tracking-tight">
        Ciao {user?.firstName || 'User'}!
      </h1>
    </PageContainer>
  );
}