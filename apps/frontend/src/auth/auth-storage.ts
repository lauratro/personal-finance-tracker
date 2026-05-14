import { AuthResponse } from './auth-types';

const STORAGE_KEY = 'personal-finance-auth';

type StoredAuthSession = {
  accessToken: string;
  refreshToken?: string;
};

export function saveAuthSession(session: AuthResponse) {
  const storedSession: StoredAuthSession = {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession));
}

export function getAuthSession(): StoredAuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getAccessToken(): string | null {
  return getAuthSession()?.accessToken ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
}
