import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test-utils';
import { DashboardPage } from '@/pages/dashboard-page/dashboard-page';

const authContext = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock('@/pages-apis/auth/auth-context', () => authContext);
vi.mock('@/pages/dashboard-page/parts/dashboard-component', () => ({
  DashboardComponent: () => <div>Dashboard content</div>,
}));

const mockUser = (firstName: string | null) => {
  authContext.useAuth.mockReturnValue({
    user: { id: 'user-1', firstName, email: 'laura@example.com' },
    logout: vi.fn(),
  });
};

const renderDashboardPage = () =>
  renderWithProviders(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser('Laura');
  });

  it('should have a single level-1 heading', () => {
    renderDashboardPage();

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName('Dashboard');
  });

  it('should greet the user by first name', () => {
    renderDashboardPage();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Welcome back, Laura' }),
    ).toBeInTheDocument();
  });

  it("should greet the user as 'Investor' when the first name is missing", () => {
    mockUser(null);

    renderDashboardPage();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Welcome back, Investor' }),
    ).toBeInTheDocument();
  });
});
