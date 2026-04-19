import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
};

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
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Personal Finance Tracker</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {children}

        <p className="auth-footer">
          {footerText} <Link to={footerHref}>{footerLinkText}</Link>
        </p>
      </section>
    </div>
  );
}
