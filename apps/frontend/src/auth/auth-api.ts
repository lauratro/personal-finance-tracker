import { http } from '../api/http';
import { AuthResponse, LoginPayload, RegisterPayload, SafeUser } from './auth-types';
import { getAuthSession } from './auth-storage';

export function registerUser(payload: RegisterPayload) {
  return http<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload: LoginPayload) {
  return http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function getCurrentUser(token?: string) {
  const session = getAuthSession();
  const authToken = token ?? session?.accessToken;
  
  return http<SafeUser>('/auth/me', {
    method: 'GET',
    token: authToken || undefined,
  });
}
