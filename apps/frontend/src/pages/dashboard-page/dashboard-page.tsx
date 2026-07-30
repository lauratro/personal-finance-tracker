import { useAuth } from '@/pages-apis/auth/auth-context';
import { PageContainer } from '@/containers/page-container';
import { DashboardComponent } from './parts/dashboard-component';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome to your personal finance dashboard!"
    >
      <div className="px-4">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back, {user?.firstName ?? 'Investor'}
            </h1>

            <p className="mt-1 text-gray-500">
              Here is an overview of your investments.
            </p>
          </div>
     <DashboardComponent/>
      </div></div>
    </PageContainer>
  );
};