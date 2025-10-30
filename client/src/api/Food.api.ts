import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";

export const getAllFoods = createAsyncThunk("foods/getAllFoods", async () => {
  const response = await axiosInstance.get("foods");
  return response.data;
});
