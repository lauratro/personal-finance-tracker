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
  refreshToken: string;
};

export type AuthResponse = AuthTokens & {
  user: SafeUser;
  requiresTwoFactor?: boolean;
  message?: string;
};

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
export interface PageContainerProps {
    children: any;
    title: string;
}
