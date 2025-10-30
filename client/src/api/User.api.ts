import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";
import type { IUser } from "../utils/interface/Users";

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
  const response = await axiosInstance.get("users");
  return response.data;
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (newUser: IUser) => {
    const response = await axiosInstance.post("users", newUser);
    return response.data;
  }
);

export const updateUser = createAsyncThunk<IUser, Partial<IUser>>(
  "users/updateUser",
  async (editUser: Partial<IUser>) => {
    const response = await axiosInstance.patch(
      `users/${editUser.id}`,
      editUser
    );
    return response.data;
  }
);
