const STORAGE_KEY = 'personal-finance-auth';

export type StoredAuthSession = {
  accessToken: string;
};

type AuthSessionListener = (session: StoredAuthSession | null) => void;

let currentSession: StoredAuthSession | null = null;

const listeners = new Set<AuthSessionListener>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(currentSession));
};

export function saveAuthSession(session: StoredAuthSession) {
  currentSession = {
    accessToken: session.accessToken,
  };

  notifyListeners();
}

export function getAuthSession() {
  return currentSession;
}

export function getAccessToken() {
  return currentSession?.accessToken ?? null;
}

export function clearAuthSession() {
  currentSession = null;
  notifyListeners();
}

export function subscribeToAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
