import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";

export const getAllMacronutrients = createAsyncThunk(
  "macronutrients/getAllMacronutrients",
  async () => {
    const response = await axiosInstance.get("macronutrients");
    return response.data;
  }
);
