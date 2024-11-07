import { BaseService } from './base.service';
import { LoginForm, AuthResponse } from '../../types';

class AuthService extends BaseService {
  private readonly AUTH_KEY = 'auth';
  private readonly TOKEN_KEY = 'token';

  async login(credentials: LoginForm): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>('/auth/login', credentials);
      this.setSession(response);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authResponse));
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getCurrentUser(): AuthResponse | null {
    const auth = localStorage.getItem(this.AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}

export const authService = new AuthService();