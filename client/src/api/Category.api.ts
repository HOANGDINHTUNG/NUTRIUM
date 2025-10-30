import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axiosInstance";

export const getAllCategory = createAsyncThunk(
  "categories/getAllCategory",
  async () => {
    const response = await axiosInstance.get("categories");
    return response.data;
  }
);
