import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/lib/types";

interface AuthSliceState extends AuthState {
  isLoading: boolean;
}

const initialState: AuthSliceState = {
  user: null,
  jwt: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state: AuthSliceState, action: PayloadAction<{ user: User; jwt: string }>) => {
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearAuth: (state: AuthSliceState) => {
      state.user = null;
      state.jwt = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state: AuthSliceState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
export type { AuthSliceState };
