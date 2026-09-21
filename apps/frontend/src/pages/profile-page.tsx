import { FormEvent, useEffect, useState } from 'react';
import { PageContainer } from '../containers/page-container';
import { TextInput } from '../components/text-input';
import { useAuth } from '../pages-apis/auth/auth-context';
import { TwoFactorSettings } from './security-page';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Profile"
      description="Manage your personal information and account security."
    >
      <div className="mx-auto grid max-w-3xl gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Personal information</h2>

          <form className="auth-form mt-4" onSubmit={handleSubmit}>
            <div className="two-columns">
              <TextInput
                label="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                minLength={2}
              />
              <TextInput
                label="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                minLength={2}
              />
            </div>

            <TextInput
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {error ? <div className="form-error">{error}</div> : null}
            {success ? <p className="text-green-700">{success}</p> : null}

            <button className="button-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </section>

        <TwoFactorSettings />
      </div>
    </PageContainer>
  );
}
