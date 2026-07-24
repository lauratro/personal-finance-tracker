import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';
import { AppMenuWrapper , InnerContainer, LogoutButton, NavLink, AppMenuUser} from './app-menubar.style';
import { IconBurger } from '@tabler/icons-react';
import { useState } from 'react';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { IconMenu2 } from '@tabler/icons-react';


export function AppMenubar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  console.log("mobile", isMobileMenuOpen);
  return (
    <AppMenuWrapper>
      <IconMenu2 color={"var(--primary)"} onClick={() => setIsMobileMenuOpen((prev) => !prev)}
         className='md:hidden m-3'/>
        <div className='hidden md:block'>
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
    <AppMenuUser>
          <span className="mr-3">{user?.firstName || user?.email}</span>
          <LogoutButton type="button" onClick={logout}>
            Logout
          </LogoutButton>
     </AppMenuUser>
      </InnerContainer>
           </div>
      {isMobileMenuOpen && <MobileMenu isMenuOpen={isMobileMenuOpen} setIsMenuOpen={setIsMobileMenuOpen}/>}
    </AppMenuWrapper>
  );
}

