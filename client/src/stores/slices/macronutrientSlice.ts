import { createSlice } from "@reduxjs/toolkit";
import type { IMacronutrient } from "../../utils/interface/Macronutrients";
import { getAllMacronutrients } from "../../api/Macronutrient.api";

interface MacronutrientState {
  loading: boolean;
  listMacronutrients: IMacronutrient[];
  error: string | null;
}

const initialState: MacronutrientState = {
  loading: false,
  listMacronutrients: [],
  error: null,
};

const macronutrientSlice = createSlice({
  name: "macronutrients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMacronutrients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMacronutrients.fulfilled, (state, action) => {
        state.loading = false;
        state.listMacronutrients = action.payload;
      })
      .addCase(getAllMacronutrients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});
export default macronutrientSlice.reducer;
