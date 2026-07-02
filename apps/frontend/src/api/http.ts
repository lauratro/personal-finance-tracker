import {
  clearAuthSession,
  getAccessToken,
  getAuthSession,
  saveAuthSession,
} from '../pages-apis/auth/auth-storage';
import { AuthTokens } from '../pages-apis/auth/auth-types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  skipAuthRefresh?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let refreshPromise: Promise<AuthTokens> | null = null;

const errorMessage = (data: unknown) => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data
  ) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }

  return 'Request failed';
};

const performTokenRefresh = async (): Promise<AuthTokens> => {
  const refreshToken = getAuthSession()?.refreshToken;

  if (!refreshToken) {
    clearAuthSession();
    throw new ApiError('Session expired', 401);
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : null;

  if (
    !response.ok ||
    typeof data?.accessToken !== 'string' ||
    typeof data?.refreshToken !== 'string'
  ) {
    clearAuthSession();
    throw new ApiError(errorMessage(data), response.status);
  }

  const tokens: AuthTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };

  saveAuthSession(tokens);
  return tokens;
};

const refreshTokensOnce = () => {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export async function http<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token =
    options.token !== undefined ? options.token : getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : null;

  if (response.status === 401 && !options.skipAuthRefresh) {
    const tokens = await refreshTokensOnce();

    return http<T>(path, {
      ...options,
      token: tokens.accessToken,
      skipAuthRefresh: true,
    });
  }

  if (!response.ok) {
    throw new ApiError(errorMessage(data), response.status);
  }

  return data as T;
}
