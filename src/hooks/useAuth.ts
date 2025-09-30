import { useState, useEffect } from 'react';
import { AuthState } from '@/lib/types';
import { apiService } from '@/lib/api/apiServices';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    jwt: null,
    isAuthenticated: false
  });

  // Load auth from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      setAuthState(JSON.parse(stored));
    }
  }, []);

  // Save auth to storage
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState]);

  const login = async (identifier: string, password: string) => {
    const response = await apiService.login(identifier, password);
    setAuthState({
      user: response.user,
      jwt: response.jwt,
      isAuthenticated: true
    });
    return response;
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await apiService.register(username, email, password);
    setAuthState({
      user: response.user,
      jwt: response.jwt,
      isAuthenticated: true
    });
    return response;
  };

  const logout = () => {
    setAuthState({
      user: null,
      jwt: null,
      isAuthenticated: false
    });
  };

  return { authState, login, register, logout };
};