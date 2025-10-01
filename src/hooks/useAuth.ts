"use client";

import { useCallback, useEffect } from "react";
import { AuthState } from "@/lib/types";
import { apiService } from "@/lib/api/apiServices";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store/store";
import { authActions } from "@/lib/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hasAuth = false;

    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsedAuth = JSON.parse(stored) as AuthState;
        if (parsedAuth?.jwt && parsedAuth?.user) {
          dispatch(
            authActions.setAuth({
              user: parsedAuth.user,
              jwt: parsedAuth.jwt,
            })
          );
          hasAuth = true;
        }
      }
    } catch (error) {
      console.error("Error loading auth from storage:", error);
      localStorage.removeItem("auth");
    } finally {
      if (!hasAuth) {
        dispatch(authActions.setLoading(false));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (authState.isLoading) return;

    if (authState.isAuthenticated && authState.jwt && authState.user) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: authState.user,
          jwt: authState.jwt,
          isAuthenticated: true,
        })
      );
    } else {
      localStorage.removeItem("auth");
    }
  }, [
    authState.isAuthenticated,
    authState.jwt,
    authState.user,
    authState.isLoading,
  ]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      dispatch(authActions.setLoading(true));
      try {
        const response = await apiService.login(identifier, password);

        if (response.jwt && response.user) {
          dispatch(
            authActions.setAuth({
              user: response.user,
              jwt: response.jwt,
            })
          );
          return response;
        }

        throw new Error("Invalid response from server");
      } catch (error) {
        dispatch(authActions.setLoading(false));
        console.error("Login error:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      dispatch(authActions.setLoading(true));
      try {
        const response = await apiService.register(username, email, password);

        if (response.jwt && response.user) {
          dispatch(
            authActions.setAuth({
              user: response.user,
              jwt: response.jwt,
            })
          );
          return response;
        }

        throw new Error("Invalid response from server");
      } catch (error) {
        dispatch(authActions.setLoading(false));
        console.error("Register error:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(authActions.clearAuth());
  }, [dispatch]);

  return {
    user: authState.user,
    jwt: authState.jwt,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
  };
};