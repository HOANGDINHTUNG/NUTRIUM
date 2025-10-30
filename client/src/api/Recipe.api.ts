import type { IRecipe } from "@/utils/interface/Recipes";
import { axiosInstance } from "../utils/axiosInstance";

export async function createRecipe(payload: IRecipe) {
  const response = await axiosInstance.post("recipes", payload);
  return response.data as IRecipe;
}
