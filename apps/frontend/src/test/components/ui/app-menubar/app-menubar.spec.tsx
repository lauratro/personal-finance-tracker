import { vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test-utils';
import { AppMenubar } from '@/components/ui/app-menubar';
import { routePaths } from '@/navigation/main-navigation';

const authContext = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock('@/pages-apis/auth/auth-context', () => authContext);

const logout = vi.fn();

const mockUser = (user: { firstName?: string | null; email: string }) => {
  authContext.useAuth.mockReturnValue({
    user: { id: 'user-1', ...user },
    logout,
  });
};

const renderAppMenubar = () =>
  renderWithProviders(
    <MemoryRouter>
      <AppMenubar />
    </MemoryRouter>,
  );

describe('AppMenubar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser({ firstName: 'Laura', email: 'laura@example.com' });
  });

  it('should show the navigation links with their destinations', () => {
    renderAppMenubar();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      routePaths.dashboard,
    );
    expect(
      screen.getByRole('link', { name: 'Investments History' }),
    ).toHaveAttribute('href', routePaths.investmentsHistory);
    expect(screen.getByRole('link', { name: 'Net Worth' })).toHaveAttribute(
      'href',
      routePaths.netWorth,
    );
  });

  it('should show the user first name in a link to the profile page', () => {
    renderAppMenubar();

    expect(screen.getByRole('link', { name: 'Laura' })).toHaveAttribute(
      'href',
      routePaths.profile,
    );
  });

  it('should show the user email when the first name is missing', () => {
    mockUser({ firstName: null, email: 'laura@example.com' });

    renderAppMenubar();

    expect(
      screen.getByRole('link', { name: 'laura@example.com' }),
    ).toHaveAttribute('href', routePaths.profile);
  });

  it('should log out when the Logout button is clicked', async () => {
    const user = userEvent.setup();

    renderAppMenubar();

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('should keep the mobile menu closed initially', () => {
    renderAppMenubar();

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open the mobile menu with its navigation links and Logout', async () => {
    const user = userEvent.setup();

    renderAppMenubar();

    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    await user.click(menuButton);

    const dialog = await screen.findByRole('dialog');

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(
      within(dialog).getByRole('link', { name: 'Dashboard' }),
    ).toHaveAttribute('href', routePaths.dashboard);
    expect(
      within(dialog).getByRole('link', { name: 'Investments History' }),
    ).toHaveAttribute('href', routePaths.investmentsHistory);
    expect(
      within(dialog).getByRole('link', { name: 'Net Worth' }),
    ).toHaveAttribute('href', routePaths.netWorth);
    expect(
      within(dialog).getByRole('link', { name: 'Profile & Security' }),
    ).toHaveAttribute('href', routePaths.profile);
    expect(
      within(dialog).getByRole('button', { name: 'Logout' }),
    ).toBeInTheDocument();
  });

  it('should close the mobile menu when Escape is pressed', async () => {
    const user = userEvent.setup();

    renderAppMenubar();

    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    await user.click(menuButton);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should log out from the mobile menu', async () => {
    const user = userEvent.setup();

    renderAppMenubar();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const dialog = await screen.findByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: 'Logout' }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
