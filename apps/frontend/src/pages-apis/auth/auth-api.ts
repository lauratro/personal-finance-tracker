import { http } from '../../api/http';
import {
  AuthResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  SafeUser,
} from './auth-types';
import { getAuthSession } from './auth-storage';

export function registerUser(payload: RegisterPayload) {
  return http<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    skipAuthRefresh: true,
  });
}

export function loginUser(payload: LoginPayload) {
  return http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    skipAuthRefresh: true,
  });
}

export function getCurrentUser(token?: string) {
  return http<SafeUser>('/auth/me', {
    method: 'GET',
    token,
  });
}

export function refreshAccessToken() {
  return http<AuthTokens>('/auth/refresh', {
    method: 'POST',
    skipAuthRefresh: true,
  });
}

export function logoutUser() {
  return http<{ success: boolean }>('/auth/logout', {
    method: 'POST',
  });
}
