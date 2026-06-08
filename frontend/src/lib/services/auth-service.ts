import { apiClient } from '../api';
import type { ApiResponse, AuthResponse, AdminProfile, LoginInput } from '../types';

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', input);
    return data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      '/auth/refresh-token',
      { refreshToken }
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<AdminProfile> {
    const { data } = await apiClient.get<ApiResponse<AdminProfile>>('/auth/me');
    return data.data;
  },
};
