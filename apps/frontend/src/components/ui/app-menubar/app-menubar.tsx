import { Link } from 'react-router-dom';
import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';

export function AppMenubar() {
  const { user, logout } = useAuth();

  return (
    <header className="app-menubar">
      <div className="app-menubar-inner">
        <nav className="app-menubar-links">
          <Link to={routePaths.dashboard} className="nav-link">
            Dashboard
          </Link>
          <Link to={routePaths.investmentsHistory} className="nav-link">
            Investments History
          </Link>
             <Link to={routePaths.netWorth} className="nav-link">
            Net Worth
          </Link>
        </nav>
        <div className="app-menubar-user">
          <span className="app-menubar-user-text">{user?.firstName || user?.email}</span>
          <button type="button" onClick={logout} className="button-secondary nav-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

