"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useStore';
import { authService } from '@/lib/services/auth-service';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      if (isAuthenticated) {
        try {
          await authService.getProfile();
        } catch {
          // Token expired or invalid — clear auth
          clearAuth();
        }
      }
      setChecked(true);
    }
    verifyAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!checked) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry 401/403 errors
          if (error && typeof error === 'object' && 'response' in error) {
            const status = (error as { response?: { status?: number } }).response?.status;
            if (status === 401 || status === 403) return false;
          }
          return failureCount < 2;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
