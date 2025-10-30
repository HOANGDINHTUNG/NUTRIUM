export interface RecipeIngredient {
  foodId: number;
  quantity: number; 
  unit: string; 
  grams: number; 
  note?: string; 
  equivalents?: {
    foodId: number; 
    grams: number;
    note?: string;
  }[];
}

interface CookingMethod {
  step: number;
  content: string;
}

export interface IRecipe {
  id: number;
  coverSrc: string | null;
  name: string;
  description: string;
  author: string;
  totalTime: string;
  preparationTime: string;
  finalWeight: string;
  portions: number;
  ingredients: number[];
  cookingMethods: CookingMethod[];
  category: number[];
  image?: string;
  imageUrl?: string;
  imageOptimized?: string;
  ingredientsV2: RecipeIngredient[];
}
