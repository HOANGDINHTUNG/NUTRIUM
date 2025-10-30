import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";

export const getAllMicronutrients = createAsyncThunk(
  "micronutrients/getAllMicronutrients",
  async () => {
    const response = await axiosInstance.get("micronutrients");
    return response.data;
  }
);
