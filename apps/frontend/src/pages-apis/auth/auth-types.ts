export type SafeUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  twoFactorEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthTokens = {
  accessToken: string;
};

export type AuthenticatedResponse = AuthTokens & {
  user: SafeUser;
  requiresTwoFactor?: false;
};

export type TwoFactorChallengeResponse = {
  requiresTwoFactor: true;
  twoFactorToken: string;
  message: string;
};

export type AuthResponse = AuthenticatedResponse | TwoFactorChallengeResponse;

export type RegisterPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyTwoFactorPayload = {
  twoFactorToken: string;
  code: string;
};

export type TwoFactorSetupResponse = {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
};

export type RecoveryCodesResponse = {
  recoveryCodes: string[];
};

export type UpdateProfilePayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
};
export interface PageContainerProps {
    children: any;
    title: string;
}
