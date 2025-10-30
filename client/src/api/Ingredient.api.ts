import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";

export const getAllIngredients = createAsyncThunk("ingredients/getAllIngredients", async () => {
  const response = await axiosInstance.get("ingredients");
  return response.data;
});
