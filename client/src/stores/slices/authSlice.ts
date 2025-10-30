import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../utils/interface/Users";
import { updateUser } from "../../api/User.api";

interface isAuthenticatedState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
}

const initialState: isAuthenticatedState = {
  currentUser: JSON.parse(sessionStorage.getItem("currentUser") || "null"),
  isAuthenticated: !!sessionStorage.getItem("currentUser"),
};

export const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("currentUser");
      localStorage.removeItem("rememberedEmail");
      // localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (state.currentUser?.id !== action.payload.id) return;

      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(state.currentUser)
      );
    });
  },
});

export default authSlices.reducer;
export const { login, logout } = authSlices.actions;
