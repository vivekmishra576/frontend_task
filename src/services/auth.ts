import api from './api';
import { LoginCredentials, LoginResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse['data']> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const resData = response.data;
    const isSuccess =
      resData &&
      (resData.status === 'success' || resData.success === true || (resData.data && !!resData.data.token));

    if (isSuccess && resData.data) {
      const { token, user } = resData.data;
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', JSON.stringify({ userId: credentials.userId }));
      }
      return resData.data;
    } else {
      throw new Error(resData?.message || 'Login failed');
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default authService;
