import { http } from '../api/http';
import { AuthResponse, LoginPayload, RegisterPayload, SafeUser } from './auth-types';

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

export function getCurrentUser(token: string) {
  return http<SafeUser>('/auth/me', {
    method: 'GET',
    token,
  });
}
