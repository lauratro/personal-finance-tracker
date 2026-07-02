const STORAGE_KEY = 'personal-finance-auth';

export type StoredAuthSession = {
  accessToken: string;
};

type AuthSessionListener = (session: StoredAuthSession | null) => void;

const listeners = new Set<AuthSessionListener>();

const notifyListeners = (session: StoredAuthSession | null) => {
  listeners.forEach((listener) => listener(session));
};

export function saveAuthSession(session: StoredAuthSession) {
  const storedSession: StoredAuthSession = {
    accessToken: session.accessToken,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession));
  notifyListeners(storedSession);
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
  notifyListeners(null);
}

export function subscribeToAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener(getAuthSession());
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}
