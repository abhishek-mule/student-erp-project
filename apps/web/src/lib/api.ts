import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle Token Refresh
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { accessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
          setTokens(accessToken, newRefreshToken);
          
          // Retry original request
          return apiRequest(endpoint, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
      } catch (_) {
        clearTokens();
        window.location.href = '/login';
      }
    }
    
    // Final fail
    if (typeof window !== 'undefined' && !endpoint.includes('/auth/login')) {
      clearTokens();
      window.location.href = '/login';
    }
  }

  return response;
}
