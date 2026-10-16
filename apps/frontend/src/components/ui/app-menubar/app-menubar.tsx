import { Link } from 'react-router-dom';
import { useAuth } from '../../../pages-apis/auth/auth-context';
import { routePaths } from '../../../navigation/main-navigation';
import { IconUserEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { IconMenu2 } from '@tabler/icons-react';

const navLinkClassName =
  'mx-1 cursor-pointer rounded-[14px] border border-[#5f9ea0]/40 bg-blue-50 px-4 py-3 font-bold text-[#5f9ea0] transition-[background] duration-200 ease-[ease] hover:bg-slate-50 hover:no-underline';

export function AppMenubar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed z-[100] w-full border-b border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="m-3 block md:hidden"
      >
        <IconMenu2 color={'var(--primary)'} />
      </button>
      <div className="hidden md:block">
        <div className="mx-2.5 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <nav className="app-menubar-links">
            <Link to={routePaths.dashboard} className={navLinkClassName}>
              Dashboard
            </Link>
            <Link
              to={routePaths.investmentsHistory}
              className={navLinkClassName}
            >
              Investments History
            </Link>
            <Link to={routePaths.netWorth} className={navLinkClassName}>
              Net Worth
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to={routePaths.profile}
              className="mr-3 flex items-center justify-center rounded-[14px] border-2 border-[var(--primary)] p-2.5 font-bold text-slate-700 no-underline hover:text-[var(--primary)] hover:no-underline"
            >
              <span>{user?.firstName || user?.email}</span>
              <IconUserEdit
                className="ml-3"
                stroke={2}
                width={18}
                height={18}
              />
            </Link>
            <button
              type="button"
              className="cursor-pointer rounded-[14px] border border-[#5f9ea0]/40 bg-[var(--primary)] px-4 py-3 font-bold text-white"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <MobileMenu
          isMenuOpen={isMobileMenuOpen}
          setIsMenuOpen={setIsMobileMenuOpen}
        />
      )}
    </header>
  );
}
