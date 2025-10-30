import { createSlice } from "@reduxjs/toolkit";
import type { IFood } from "../../utils/interface/Foods";
import { getAllFoods } from "../../api/Food.api";

interface FoodState {
  loading: boolean;
  listFoods: IFood[];
  error: string | null;
}

const initialState: FoodState = {
  loading: false,
  listFoods: [],
  error: null,
};

const foodSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.listFoods = action.payload;
      })
      .addCase(getAllFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});
export default foodSlice.reducer;
