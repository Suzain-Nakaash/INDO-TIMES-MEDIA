import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { useAuthStore } from '@/store/useStore';
import type { LoginInput } from '../types';

export const authKeys = {
  profile: ['auth', 'profile'] as const,
};

export function useLogin() {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.admin, data.refreshToken);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Even if API call fails, clear local state
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    retry: false,
  });
}
