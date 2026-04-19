import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getCurrentUser, loginUser, registerUser } from './auth-api';
import { clearAuthSession, getAuthSession, saveAuthSession } from './auth-storage';
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
    const session = getAuthSession();

    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    setUser(session.user);

    getCurrentUser(session.accessToken)
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        clearAuthSession();
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (session: AuthResponse) => {
    saveAuthSession(session);
    setUser(session.user);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
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
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
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
