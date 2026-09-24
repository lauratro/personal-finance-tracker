import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { DashboardComponent } from '@/pages/dashboard-page/parts/dashboard-component/dashboard-component';

const dashboardApi = vi.hoisted(() => ({
  getDashboard: vi.fn(),
  createDashboard: vi.fn(),
}));

vi.mock('@/pages-apis/dashboard', () => dashboardApi);
vi.mock(
  '@/pages/dashboard-page/parts/dashboard-widgets-grid',
  () => ({ DashboardWidgetsGrid: () => <div>Widget grid</div> }),
);

describe('DashboardComponent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows a recoverable loading error', async () => {
    dashboardApi.getDashboard
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ id: 'dashboard-1' });

    renderWithProviders(<DashboardComponent />);

    expect(
      await screen.findByText('The dashboard could not be loaded.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.getByText('Widget grid')).toBeInTheDocument();
    });
    expect(dashboardApi.getDashboard).toHaveBeenCalledTimes(2);
  });
});
