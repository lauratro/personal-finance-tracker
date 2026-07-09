import { Link } from 'react-router-dom';
import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';
import { AppMenuWrapper , InnerContainer, LogoutButton, NavLink} from './app-menubar.style';

export function AppMenubar() {
  const { user, logout } = useAuth();

  return (
    <AppMenuWrapper>
      <InnerContainer>
        <nav className="app-menubar-links">
          < NavLink to={routePaths.dashboard}>
            Dashboard
          </ NavLink>
          < NavLink to={routePaths.investmentsHistory}>
            Investments History
          </ NavLink>
             < NavLink to={routePaths.netWorth}>
            Net Worth
          </ NavLink>
        </nav>
        <div className="app-menubar-user">
          <span className="mr-3">{user?.firstName || user?.email}</span>
          <LogoutButton type="button" onClick={logout}>
            Logout
          </LogoutButton>
        </div>
      </InnerContainer>
    </AppMenuWrapper>
  );
}

