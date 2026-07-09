import { Link } from 'react-router-dom';
import { AuthLayoutProps } from './auth-layout.types';
import { CardContainer, Wrapper, TitleText } from './auth-layout.styles';

export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthLayoutProps) {
  return (
    <Wrapper>
      <CardContainer>
        <header className="mb-5">
          <TitleText>Personal Finance Tracker</TitleText>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {children}

        <div className="mt-5">
          <p>
            {footerText}{' '}
            <Link to={footerHref}>{footerLinkText}</Link>
          </p>
        </div>
      </CardContainer>
    </Wrapper>
  );
}
