export interface AuthResponse {
  token: string;
  refreshToken?: string;
  role: Role;
  userId: number;
  username: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}