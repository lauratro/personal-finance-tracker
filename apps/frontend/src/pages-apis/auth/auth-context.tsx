import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyTwoFactorCode,
  updateCurrentUser,
} from './auth-api';
import {
  clearAuthSession,
  saveAuthSession,
  subscribeToAuthSession,
} from './auth-storage';
import {
  AuthenticatedResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SafeUser,
  VerifyTwoFactorPayload,
  UpdateProfilePayload,
} from './auth-types';

type AuthContextValue = {
  user: SafeUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthenticatedResponse>;
  verifyTwoFactor: (
    payload: VerifyTwoFactorPayload,
  ) => Promise<AuthenticatedResponse>;
  refreshCurrentUser: () => Promise<SafeUser>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<SafeUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = subscribeToAuthSession((session) => {
      setAccessToken(session?.accessToken ?? null);

      if (!session) setUser(null);
    });

    const restoreSession = async () => {
      try {
        /*
         * There is no access token after a page reload.
         *
         * getCurrentUser() initially receives 401, then http() calls
         * /auth/refresh using the HTTP-only cookie, saves the new access
         * token in memory, and retries /auth/me.
         */
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          clearAuthSession();
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const persistSession = (session: AuthenticatedResponse) => {
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
    if (session.requiresTwoFactor) {
      throw new Error('Registration returned an unexpected 2FA challenge');
    }
    persistSession(session);
    return session;
  };

  const verifyTwoFactor = async (payload: VerifyTwoFactorPayload) => {
    const session = await verifyTwoFactorCode(payload);

    if (session.requiresTwoFactor) {
      throw new Error('Two-factor verification returned another challenge');
    }

    persistSession(session);
    return session;
  };

  const refreshCurrentUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const updatedUser = await updateCurrentUser(payload);
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuthSession();
      setUser(null);
      setAccessToken(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      register,
      verifyTwoFactor,
      refreshCurrentUser,
      updateProfile,
      logout,
    }),
    [user, accessToken, loading],
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
