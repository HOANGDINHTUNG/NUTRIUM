import { createSlice } from "@reduxjs/toolkit";
import type { RecipeCategory } from "../../utils/interface/RecipeCategory";
import { getAllCategory } from "../../api/Category.api";

interface CategoryState {
  loading: boolean;
  listCategory: RecipeCategory[];
  error: string | null;
}

const initialState: CategoryState = {
  loading: false,
  listCategory: [],
  error: null,
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.listCategory = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});

export default categorySlice.reducer;
