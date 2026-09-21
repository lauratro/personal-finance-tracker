import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';
import {
  AppMenuWrapper,
  InnerContainer,
  LogoutButton,
  NavLink,
  AppMenuUser,
  UserProfileLink,
} from './app-menubar.style';
import { IconUserEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { IconMenu2 } from '@tabler/icons-react';

export function AppMenubar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <AppMenuWrapper>
      <IconMenu2
        color={'var(--primary)'}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="md:hidden m-3"
      />
      <div className="hidden md:block">
        <InnerContainer>
          <nav className="app-menubar-links">
            <NavLink to={routePaths.dashboard}>Dashboard</NavLink>
            <NavLink to={routePaths.investmentsHistory}>
              Investments History
            </NavLink>
            <NavLink to={routePaths.netWorth}>Net Worth</NavLink>
          </nav>
          <AppMenuUser>
            <UserProfileLink to={routePaths.profile} className="mr-3">
              <span>{user?.firstName || user?.email}</span>
              <IconUserEdit
                className="ml-3"
                stroke={2}
                width={18}
                height={18}
              />
            </UserProfileLink>
            <LogoutButton type="button" onClick={logout}>
              Logout
            </LogoutButton>
          </AppMenuUser>
        </InnerContainer>
      </div>
      {isMobileMenuOpen && (
        <MobileMenu
          isMenuOpen={isMobileMenuOpen}
          setIsMenuOpen={setIsMobileMenuOpen}
        />
      )}
    </AppMenuWrapper>
  );
}
