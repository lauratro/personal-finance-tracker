import { FormEvent, useState } from 'react';
import { TextInput } from '../components/text-input';
import {
  disableTwoFactor,
  enableTwoFactor,
  regenerateRecoveryCodes,
  setupTwoFactor,
} from '../pages-apis/auth/auth-api';
import { useAuth } from '../pages-apis/auth/auth-context';
import type { TwoFactorSetupResponse } from '../pages-apis/auth/auth-types';

export function TwoFactorSettings() {
  const { user, refreshCurrentUser } = useAuth();
  const [setup, setSetup] = useState<TwoFactorSetupResponse | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const beginSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      setSetup(await setupTwoFactor());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const confirmSetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await enableTwoFactor(code);
      setRecoveryCodes(result.recoveryCodes);
      await refreshCurrentUser();
      setSetup(null);
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const regenerateCodes = async () => {
    if (!window.confirm('Replace all existing recovery codes?')) return;
    setLoading(true);
    setError(null);

    try {
      const result = await regenerateRecoveryCodes();
      setRecoveryCodes(result.recoveryCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to regenerate codes');
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    if (!window.confirm('Disable two-factor authentication?')) return;
    setLoading(true);
    setError(null);

    try {
      await disableTwoFactor();
      await refreshCurrentUser();
      setRecoveryCodes(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const downloadCodes = () => {
    if (!recoveryCodes) return;
    const blob = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personal-finance-tracker-recovery-codes.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Two-factor authentication</h2>

        {recoveryCodes ? (
          <div className="mt-4">
            <p className="font-semibold text-amber-800">
              Save these recovery codes now. They will not be shown again.
            </p>
            <div className="my-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-4 font-mono">
              {recoveryCodes.map((recoveryCode) => (
                <code key={recoveryCode}>{recoveryCode}</code>
              ))}
            </div>
            <button className="button-primary" type="button" onClick={downloadCodes}>
              Download codes
            </button>{' '}
            <button
              className="button-secondary"
              type="button"
              onClick={() => setRecoveryCodes(null)}
            >
              I saved them
            </button>
          </div>
        ) : user?.twoFactorEnabled ? (
          <div className="mt-3">
            <p className="text-green-700">
              Two-factor authentication is enabled for your account.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="button-secondary"
                type="button"
                disabled={loading}
                onClick={regenerateCodes}
              >
                Regenerate recovery codes
              </button>
              <button
                className="button-secondary"
                type="button"
                disabled={loading}
                onClick={disable}
              >
                Disable and reset 2FA
              </button>
            </div>
          </div>
        ) : setup ? (
          <div className="mt-4">
            <ol className="list-decimal space-y-2 pl-5 text-slate-700">
              <li>Scan this QR code with your authenticator app.</li>
              <li>Enter the six-digit code shown by the app.</li>
            </ol>

            <img
              className="mx-auto my-5 h-56 w-56"
              src={setup.qrCodeDataUrl}
              alt="QR code for authenticator app setup"
            />

            <p className="mb-5 break-all text-sm text-slate-600">
              Manual setup key: <code>{setup.secret}</code>
            </p>

            <form className="auth-form" onSubmit={confirmSetup}>
              <TextInput
                label="Authentication code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                }
                required
                minLength={6}
                maxLength={6}
                pattern="[0-9]{6}"
              />

              <button
                className="button-primary"
                type="submit"
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Enabling...' : 'Enable two-factor authentication'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-3">
            <p className="mb-4 text-slate-600">
              Use Google Authenticator, Microsoft Authenticator, 1Password, or
              another compatible app to generate sign-in codes.
            </p>
            <button
              className="button-primary"
              type="button"
              disabled={loading}
              onClick={beginSetup}
            >
              {loading ? 'Preparing...' : 'Set up authenticator app'}
            </button>
          </div>
        )}

        {error ? <div className="form-error mt-4">{error}</div> : null}
      </section>
  );
}
