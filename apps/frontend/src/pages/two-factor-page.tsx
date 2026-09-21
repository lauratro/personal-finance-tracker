import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth-layout/auth-layout';
import { TextInput } from '../components/text-input';
import { useAuth } from '../pages-apis/auth/auth-context';

type TwoFactorLocationState = {
  twoFactorToken?: string;
};

export function TwoFactorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyTwoFactor } = useAuth();
  const twoFactorToken = (location.state as TwoFactorLocationState | null)
    ?.twoFactorToken;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  if (!twoFactorToken) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await verifyTwoFactor({ twoFactorToken, code });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to verify the code',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Two-factor authentication"
      subtitle="Enter the six-digit code from your authenticator app."
      footerText="Need to start again?"
      footerLinkText="Return to sign in"
      footerHref="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <TextInput
          label={useRecoveryCode ? 'Recovery code' : 'Authentication code'}
          type="text"
          inputMode={useRecoveryCode ? 'text' : 'numeric'}
          autoComplete={useRecoveryCode ? 'off' : 'one-time-code'}
          value={code}
          onChange={(event) => {
            const value = useRecoveryCode
              ? event.target.value.toUpperCase().replace(/[^A-Z2-9-]/g, '').slice(0, 11)
              : event.target.value.replace(/\D/g, '').slice(0, 6);
            setCode(value);
          }}
          required
          minLength={useRecoveryCode ? 10 : 6}
          maxLength={useRecoveryCode ? 11 : 6}
          pattern={useRecoveryCode ? '[A-Za-z2-9]{5}-?[A-Za-z2-9]{5}' : '[0-9]{6}'}
        />

        <button
          className="button-secondary"
          type="button"
          onClick={() => {
            setUseRecoveryCode((current) => !current);
            setCode('');
            setError(null);
          }}
        >
          {useRecoveryCode ? 'Use authenticator code' : 'Use a recovery code'}
        </button>

        {error ? <div className="form-error">{error}</div> : null}

        <button
          className="button-primary"
          type="submit"
          disabled={
            submitting ||
            (useRecoveryCode ? !/^[A-Z2-9]{5}-?[A-Z2-9]{5}$/.test(code) : code.length !== 6)
          }
        >
          {submitting ? 'Verifying...' : 'Verify and sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
