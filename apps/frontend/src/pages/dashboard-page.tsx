import { useAuth } from '../auth/auth-context';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <div>
          <p className="eyebrow">Authenticated area</p>
          <h1>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h1>
          <p>
            Your login and registration flow is working. This page is the next hand-off point for the
            real dashboard modules.
          </p>
        </div>

        <dl className="profile-list">
          <div>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{user?.role ?? 'USER'}</dd>
          </div>
          <div>
            <dt>2FA</dt>
            <dd>{user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</dd>
          </div>
        </dl>

        <button className="button-secondary" onClick={logout}>
          Log out locally
        </button>
      </section>
    </main>
  );
}
