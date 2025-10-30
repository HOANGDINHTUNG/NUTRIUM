import { createSlice } from "@reduxjs/toolkit";
import type { RecipeIngredient } from "../../utils/interface/Recipes";
import { getAllIngredients } from "../../api/Ingredient.api";

interface RecipeIngredientState {
  loading: boolean;
  listIngredients: RecipeIngredient[];
  error: string | null;
}

const initialState: RecipeIngredientState = {
  loading: false,
  listIngredients: [],
  error: null,
};

const ingredientSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.listIngredients = action.payload;
      })
      .addCase(getAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      });
  },
});
export default ingredientSlice.reducer;
