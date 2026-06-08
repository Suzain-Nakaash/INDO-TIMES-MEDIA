import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('indo-times-auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {
        // silently ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & auto-refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login or refresh-token endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh-token')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const stored = localStorage.getItem('indo-times-auth');
        if (!stored) throw new Error('No auth data');
        
        const parsed = JSON.parse(stored);
        const refreshToken = parsed?.state?.refreshToken;
        
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (newAccessToken) {
          // Update stored tokens
          parsed.state.accessToken = newAccessToken;
          if (newRefreshToken) {
            parsed.state.refreshToken = newRefreshToken;
          }
          localStorage.setItem('indo-times-auth', JSON.stringify(parsed));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state on refresh failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('indo-times-auth');
          // Redirect to login if on admin page
          if (window.location.pathname.startsWith('/admin') && 
              !window.location.pathname.includes('/login')) {
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
