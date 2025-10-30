import { createSlice } from "@reduxjs/toolkit";
import { getAllMicronutrients } from "../../api/Micronutrient.api";
import type { IMicronutrient } from "@/utils/interface/Micronutrients";

interface MicronutrientState {
  loading: boolean;
  listMicronutrients: IMicronutrient[];
  error: string | null;
}

const initialState: MicronutrientState = {
  loading: false,
  listMicronutrients: [],
  error: null,
};

const micronutrientSlice = createSlice({
  name: "micronutrients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMicronutrients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMicronutrients.fulfilled, (state, action) => {
        state.loading = false;
        state.listMicronutrients = action.payload;
      })
      .addCase(getAllMicronutrients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});
export default micronutrientSlice.reducer;
