import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type AuthUser,
  getStoredUser,
  clearStoredUser,
} from "../services/apiAuth";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearStoredUser();
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
