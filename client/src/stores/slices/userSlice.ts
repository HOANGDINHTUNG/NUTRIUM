import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../utils/interface/Users";
import { createUser, getAllUsers, updateUser } from "../../api/User.api";

interface UserState {
  loading: boolean;
  listUsers: IUser[];
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  listUsers: [],
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.listUsers.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.listUsers.findIndex(
          (user) => user.id === updatedUser.id
        );

        if (index !== -1) {
          state.listUsers[index] = {
            ...state.listUsers[index],
            ...updatedUser,
          };
        } else if (updatedUser) {
          state.listUsers.push(updatedUser);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to update user";
      });
  },
});

export default userSlice.reducer;
