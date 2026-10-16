import { vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test-utils';
import { PageContainer } from '@/containers/page-container';

const authContext = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock('@/pages-apis/auth/auth-context', () => authContext);

const renderPageContainer = (description?: string) =>
  renderWithProviders(
    <MemoryRouter>
      <PageContainer title="Dashboard" description={description}>
        <div>Page content</div>
      </PageContainer>
    </MemoryRouter>,
  );

const getPageHeader = () =>
  screen.getByRole('heading', { level: 1, name: 'Dashboard' })
    .parentElement as HTMLElement;

describe('PageContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authContext.useAuth.mockReturnValue({
      user: { id: 'user-1', firstName: 'Laura', email: 'laura@example.com' },
      logout: vi.fn(),
    });
  });

  it('should show the title as the page heading', () => {
    renderPageContainer();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument();
  });

  it('should show the description below the title when provided', () => {
    renderPageContainer('Welcome to your dashboard!');

    expect(within(getPageHeader()).getByRole('paragraph')).toHaveTextContent(
      'Welcome to your dashboard!',
    );
  });

  it('should not render a description when none is provided', () => {
    renderPageContainer();

    expect(
      within(getPageHeader()).queryByRole('paragraph'),
    ).not.toBeInTheDocument();
  });

  it('should render the children inside the main content area', () => {
    renderPageContainer();

    expect(
      within(screen.getByRole('main')).getByText('Page content'),
    ).toBeInTheDocument();
  });

  it('should include the app menubar', () => {
    renderPageContainer();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should include the AI assistant', () => {
    renderPageContainer();

    expect(
      screen.getByRole('button', { name: 'Open AI Assistant' }),
    ).toBeInTheDocument();
  });
});
