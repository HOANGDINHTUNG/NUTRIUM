import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import darkModeSlice from "./slices/darkModelSlice";
import languageSlice from "./slices/languageSlice";
import foodSlice from "./slices/foodSlice";
import recipeSlice from "./slices/recipeSlice";
import macronutrientSlice from "./slices/macronutrientSlice";
import micronutrientSlice from "./slices/micronutrientSlice";
import categorySlice from "./slices/categorySlice";
import ingredientSlice from "./slices/ingredientSlice";
export const stores = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    darkMode: darkModeSlice,
    language: languageSlice,
    food: foodSlice,
    macronutrient: macronutrientSlice,
    micronutrient: micronutrientSlice,
    recipe: recipeSlice,
    category: categorySlice,
    ingredient: ingredientSlice,
    // nova: novaSlice,
  },
});

export type RootState = ReturnType<typeof stores.getState>;

export type AppDispatch = typeof stores.dispatch;
