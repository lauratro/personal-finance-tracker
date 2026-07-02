import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getCurrentUser, loginUser, registerUser } from './auth-api';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  subscribeToAuthSession,
} from './auth-storage';
import { AuthResponse, LoginPayload, RegisterPayload, SafeUser } from './auth-types';

type AuthContextValue = {
  user: SafeUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = subscribeToAuthSession((session) => {
      setAccessToken(session?.accessToken ?? null);
      setRefreshToken(session?.refreshToken ?? null);

      if (!session) setUser(null);
    });

    const restoreSession = async () => {
      const session = getAuthSession();

      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      setAccessToken(session.accessToken);
      setRefreshToken(session.refreshToken ?? null);

      try {
        // http() refreshes an expired access token and retries this request.
        const currentUser = await getCurrentUser(session.accessToken);
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled && !getAuthSession()) {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const persistSession = (session: AuthResponse) => {
    saveAuthSession(session);
    setUser(session.user);
  };

  const login = async (payload: LoginPayload) => {
    const session = await loginUser(payload);

    if (session.requiresTwoFactor) {
      return session;
    }

    persistSession(session);
    return session;
  };

  const register = async (payload: RegisterPayload) => {
    const session = await registerUser(payload);
    persistSession(session);
    return session;
  };

  const logout = () => {
    clearAuthSession();
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      login,
      register,
      logout,
    }),
    [user, accessToken, refreshToken, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
