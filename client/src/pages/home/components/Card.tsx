import { Tag } from "lucide-react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import { useMemo } from "react";

import type { RecipeCategory } from "../../../utils/interface/RecipeCategory";
import { useNavigate } from "react-router-dom";
import type {
  IRecipe,
  RecipeIngredient,
} from "../../../utils/interface/Recipes";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { IFood } from "../../../utils/interface/Foods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface CardProp {
  id?: number;
  recipe: IRecipe | undefined;
  macronutrients: IMacronutrient | undefined;
  micronutrients?: IMicronutrient | undefined;
  listCategory: RecipeCategory[];
  listIngredients?: RecipeIngredient[];
  listFoods?: IFood[];
  favorite: boolean;
  onToggleFavorite?: ((recipeId: number) => void) | undefined;
  numberFavorite: number;
}

export default function Card({
  id,
  recipe,
  macronutrients,
  micronutrients,
  listCategory,
  listIngredients,
  listFoods,
  favorite,
  numberFavorite,
  onToggleFavorite,
}: CardProp) {
  const { mode } = useAppSelector((state) => state.darkMode);
  const navigate = useNavigate();

  const categoryNames = useMemo(() => {
    if (!Array.isArray(listCategory)) return [];
    return listCategory
      .filter((c) => recipe?.category?.includes(c.id))
      .map((c) => c.name);
  }, [listCategory, recipe?.category]);

  const ingredients = useMemo(() => {
    if (!Array.isArray(listIngredients)) return [];
    if (!Array.isArray(recipe?.ingredients)) return [];

    // lọc các đối tượng IFood có id nằm trong danh sách recipe.ingredients
    return listIngredients.filter((food) =>
      recipe.ingredients.includes(food.foodId)
    );
  }, [listIngredients, recipe]);

  const foods = useMemo(() => {
    if (!Array.isArray(listFoods)) return [];
    if (!Array.isArray(recipe?.ingredients)) return [];

    return listFoods.filter((food) => recipe.ingredients.includes(food.id));
  }, [listFoods, recipe]);

  const handleClick = (id?: number): void => {
    if (id) {
      navigate(`/recipe/render/${id}`, {
        state: {
          recipe: recipe,
          macronutrients: macronutrients,
          micronutrients: micronutrients,
          categoryNames: categoryNames,
          ingredients: ingredients,
          foods: foods,
          favorite: numberFavorite,
          isFavorite: favorite,
        },
      });
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && id !== undefined) {
      onToggleFavorite(id);
    }
  };

  return (
    <div
      className={`max-w-2xl overflow-hidden rounded-lg bg-gradient-to-br shadow-lg  transition-colors duration-300  flex-1 ${
        id ? "cursor-pointer" : ""
      } ${
        mode
          ? "from-[#14161B] via-[#111216] to-[#0B0B0C]"
          : "from-gray-50 to-blue-50"
      }`}
      onClick={() => handleClick(id)}
    >
      <div className="flex md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-2/5">
          <img
            src={recipe?.coverSrc ?? undefined}
            alt="Turmeric Roasted Cauliflower Salad"
            className="w-full h-full object-cover object-center"
          />
          <div
            className={`absolute left-4 top-4 flex items-center gap-2 rounded-full  px-3 py-1.5 text-sm font-medium  shadow-sm backdrop-blur-sm  ${
              mode
                ? "border border-[rgba(232,201,113,0.25)] bg-[rgba(20,22,27,0.85)] text-[#E8C971]"
                : "text-orange-500 bg-white/90"
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Community Recipes
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`flex flex-1 flex-col  p-4 transition-colors duration-300  ${
            mode ? "bg-[#14161B]" : "bg-white/90"
          }`}
        >
          <div className="h-[180px] flex flex-col">
            <div className="mb-4 flex-col">
              <h1
                className={`mb-2 text-xl font-bold ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                {recipe?.name}
              </h1>
              <div
                className={`flex items-center justify-between gap-4 text-sm ${
                  mode ? "text-[#C9C9CF]" : "text-slate-500"
                }`}
              >
                <p>{recipe?.author}</p>
                <div
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1  transition-colors duration-300  ${
                    mode
                      ? "border-[rgba(232,201,113,0.28)] text-[#E8C971] hover:bg-[rgba(232,201,113,0.08)]"
                      : "border-slate-200 text-slate-500"
                  }`}
                  onClick={handleHeartClick}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`${favorite ? "text-[#B9384F]" : ""}`}
                  />
                  <span className="font-medium">{numberFavorite}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm font-medium ">
              <div
                className={`flex items-center gap-2 rounded-full  px-3 py-1 ${
                  mode
                    ? "border border-[rgba(232,201,113,0.28)] bg-[rgba(232,201,113,0.12)] text-[#E8C971]"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                <Tag className="h-4 w-4" />{" "}
                <span>{categoryNames.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          <div
            className={`grid grid-cols-6 gap-2 border-t  px-4 py-3 text-xs  transition-colors duration-300 h-[60px] ${
              mode
                ? "border-[rgba(36,38,45,0.85)] text-[#C9C9CF]"
                : "border-slate-200 text-slate-500"
            }`}
          >
            <div>
              <p className="mb-1  tracking-wide">By</p>
              <p
                className={`font-semibold   ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                100g
              </p>
            </div>
            <div>
              <p className="mb-1  tracking-wide">Energy</p>
              <p
                className={`font-semibold   ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                {macronutrients?.energy}
              </p>
            </div>
            <div>
              <p className="mb-1  tracking-wide">Fat</p>
              <p
                className={`font-semibold   ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                {macronutrients?.fat}
              </p>
            </div>
            <div className="col-span-2">
              <p className="mb-1  tracking-wide">Carbohydrate</p>
              <p
                className={`font-semibold   ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                {macronutrients?.carbohydrates}
              </p>
            </div>
            <div>
              <p className="mb-1 tracking-wide">Protein</p>
              <p
                className={`font-semibold   ${
                  mode ? "text-[#F2F2F2]" : "text-slate-800"
                }`}
              >
                {macronutrients?.protein}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
