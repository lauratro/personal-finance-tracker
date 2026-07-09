import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth-layout/auth-layout';
import { TextInput } from '../components/text-input';
import { useAuth } from '../pages-apis/auth/auth-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await login({ email, password });

      if (response.requiresTwoFactor) {
        setError(response.message ?? 'Two-factor authentication is required.');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your account to access budgets, accounts, transactions, and portfolio data."
      footerText="Need an account?"
      footerLinkText="Create one"
      footerHref="/register"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <TextInput
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />

        {error ? <div className="form-error">{error}</div> : null}

        <button className="button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="helper-text compact">
        First time here? You can also go straight to the <Link to="/register">registration form</Link>.
      </p>
    </AuthLayout>
  );
}
