import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminProfile } from '@/lib/types';

// ── App UI State ────────────────────────────────────────────

interface AppState {
  isSearchOpen: boolean;
  toggleSearch: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>((set) => ({
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

// ── Auth State ──────────────────────────────────────────────

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, admin: AdminProfile, refreshToken?: string) => void;
  setToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      admin: null,
      isAuthenticated: false,
      setAuth: (accessToken, admin, refreshToken) =>
        set({
          accessToken,
          refreshToken: refreshToken || null,
          admin,
          isAuthenticated: true,
        }),
      setToken: (accessToken) =>
        set({ accessToken }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          admin: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'indo-times-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
