import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <header className="auth-header">
          <p className="eyebrow">Personal Finance Tracker</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {children}

        <div className="auth-footer">
          <p>
            {footerText}{' '}
            <Link to={footerHref}>{footerLinkText}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
