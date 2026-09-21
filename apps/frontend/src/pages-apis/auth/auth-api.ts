import { http } from '../../api/http';
import {
  AuthResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  SafeUser,
  VerifyTwoFactorPayload,
  TwoFactorSetupResponse,
  RecoveryCodesResponse,
  UpdateProfilePayload,
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

export function verifyTwoFactorCode(payload: VerifyTwoFactorPayload) {
  return http<AuthResponse>('/auth/2fa/verify', {
    method: 'POST',
    body: payload,
    skipAuthRefresh: true,
  });
}

export function setupTwoFactor() {
  return http<TwoFactorSetupResponse>('/auth/2fa/setup', {
    method: 'POST',
  });
}

export function enableTwoFactor(code: string) {
  return http<{ success: boolean } & RecoveryCodesResponse>('/auth/2fa/enable', {
    method: 'POST',
    body: { code },
  });
}

export function regenerateRecoveryCodes() {
  return http<RecoveryCodesResponse>('/auth/2fa/recovery-codes/regenerate', {
    method: 'POST',
  });
}

export function disableTwoFactor() {
  return http<{ success: boolean }>('/auth/2fa/disable', {
    method: 'POST',
  });
}

export function getCurrentUser(token?: string) {
  return http<SafeUser>('/auth/me', {
    method: 'GET',
    token,
  });
}

export function updateCurrentUser(payload: UpdateProfilePayload) {
  return http<SafeUser>('/auth/me', {
    method: 'PATCH',
    body: payload,
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
