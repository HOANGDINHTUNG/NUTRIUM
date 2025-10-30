import { Heart, TicketPlus, Users } from "lucide-react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { useLocation } from "react-router-dom";
import type {
  IRecipe,
  RecipeIngredient,
} from "../../../utils/interface/Recipes";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { IFood } from "../../../utils/interface/Foods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

type NavState = {
  recipe: IRecipe;
  macronutrients: IMacronutrient;
  micronutrients: IMicronutrient;
  categoryNames: string[];
  ingredients: RecipeIngredient[];
  foods: IFood[];
  favorite: number;
};

export default function DetailRecipe() {
  const { mode } = useAppSelector((state) => state.darkMode);
  const location = useLocation();
  const {
    recipe,
    macronutrients,
    categoryNames,
    micronutrients,
    ingredients,
    foods,
    favorite,
  } = (location.state as NavState) || {};

  const chart = [
    { name: "Fat", value: macronutrients.fat },
    { name: "Carbohydrate", value: macronutrients.carbohydrates },
    { name: "Protein", value: macronutrients.protein },
  ];

  const COLORS = ["#DB4965", "#EA9F77", "#1AB394"];

  const formatIngredient = (item: RecipeIngredient, foods: IFood[]) => {
    const food = foods.find((f) => f.id === item.foodId);
    const foodName = food?.name || "Unknown";
    const note = item.note ? `, ${item.note}` : "";
    const grams = item.grams ? ` (${item.grams} g)` : "";
    return `${item.quantity} ${item.unit} of ${foodName}${note}${grams}`;
  };


  return (
    <div
      className={`h-[100vh] py-6 px-4 transition-colors duration-300 ${
        mode ? "dark:bg-slate-900" : "bg-gray-200"
      }`}
    >
      {/* Upload image */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-4 flex-3/2">
          <div
            className="px-6 py-8 flex flex-col justify-between bg-white rounded-lg h-[300px] relative overflow-hidden bg-center bg-cover"
            style={{ backgroundImage: `url("${recipe?.coverSrc}")` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400 border border-gray-300 rounded-lg shadow-xl px-2 py-1 bg-white">
                <Users className="w-3 h-3" />
                <span className="font-medium text-xs">Community Recipes</span>
              </div>
              <div
                className={`px-1 flex items-center gap-4 border rounded-lg bg-white ${
                  mode ? "dark:border-slate-700" : "border-gray-400"
                }`}
              >
                <Heart className="text-black w-3 h-3" />
                <span
                  className={`${
                    mode ? "dark:text-slate-200" : "text-slate-600"
                  }`}
                >
                  {favorite}
                </span>
              </div>
            </div>

            <div className="flex">
              <div className="flex items-center gap-2 text-orange-400 border border-gray-300 shadow-xl px-2 py-1 bg-white rounded-lg">
                <TicketPlus className="w-3 h-3" />
                <span className="text-black text-xs">
                  {categoryNames.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex items-center gap-1 border bg-white border-gray-300 px-2 py-1 rounded-lg cursor-pointer">
              <FontAwesomeIcon icon={faHeart} className="text-red-600" />
              <span>Add to favorite</span>
            </div>
          </div>
        </div>

        <div className="flex-5/2 flex flex-col gap-8">
          <div className="flex flex-col px-7 py-5 bg-white rounded-lg text-black">
            <div className="flex flex-col mb-5">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Basic information
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Check and edit recipe's basic information
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Name</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.name}
                </div>
              </div>

              <div className="flex h-[60px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Description</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.description}
                </div>
              </div>

              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Author</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.author}
                </div>
              </div>

              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Total time</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.totalTime}
                </div>
              </div>

              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Preparation time</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.preparationTime}
                </div>
              </div>

              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Final weight</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.finalWeight}
                </div>
              </div>

              <div className="flex h-[40px] border border-gray-200 text-gray-500">
                <div className="flex-1 flex items-center bg-gray-100 border-r-1 border-gray-200">
                  <div className="px-5  text-sm">Portions</div>
                </div>
                <div className="flex-3 px-3 text-xs flex items-center">
                  {recipe?.portions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-2 flex flex-col rounded-lg mt-8"
        style={{ backgroundColor: "#1AB394" }}
      >
        <span className="text-xl">Creation</span>
        <span className="text-sm font-light">
          Create the recipe and choose the ingredients
        </span>
      </div>

      <div className="flex gap-8 mt-8">
        <div className="flex-2 flex flex-col gap-8">
          <div className="p-6 flex flex-col rounded-lg bg-white">
            <div className="flex flex-col mb-6">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Ingredients
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Search and add ingredients to the recipe
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {ingredients?.length ? (
                ingredients.map((item) => (
                  <div
                    key={item.foodId}
                    className="p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    {formatIngredient(item, foods)}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 italic">
                  No ingredients added yet.
                </div>
              )}
            </div>
          </div>

          <div className="p-6 flex flex-col rounded-lg bg-white">
            <div className="flex flex-col mb-6">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Cooking method
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Give instructions to prepare this recipe
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col gap-4">
                {recipe.cookingMethods.length > 0 &&
                  recipe.cookingMethods.map((item) => (
                    <div
                      className="flex border border-gray-200 flex-1"
                      key={item.step}
                    >
                      <div className="flex items-center bg-gray-100 border-r-1 border-gray-200">
                        <div className="px-5 bg-gray text-black">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1 px-3 text-gray-500 text-sm">
                        {item.content}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex-col">
          <div className="flex flex-col mb-8 p-6 bg-white rounded-lg">
            <div className="flex flex-col mb-4">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Global analysis
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Energy, macronutrients and fiber distribution
              </div>
            </div>

            <div className="border-b-1 border-gray-200 flex items-center justify-between text-gray-500 mb-7">
              <div className="text-sm">Energy</div>
              <div>
                <span className="font-medium text-black">
                  {macronutrients?.energy}
                </span>{" "}
                kcal
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full h-12 w-12 text-black flex items-center justify-center text-sm"
                  style={{ border: "4px solid #DB4965" }}
                >
                  {macronutrients?.fat}g
                </div>
                <div className="text-xs text-gray-500">Fat</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full h-12 w-12 text-black flex items-center justify-center text-sm "
                  style={{ border: "4px solid #EA9F77" }}
                >
                  {macronutrients?.carbohydrates}g
                </div>
                <div className="text-xs text-gray-500">Carbohydrate</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full h-12 w-12 text-black flex items-center justify-center text-sm "
                  style={{ border: "4px solid #1AB394" }}
                >
                  {macronutrients.protein}g
                </div>
                <div className="text-xs text-gray-500">Protein</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full h-12 w-12 text-black flex items-center justify-center text-sm "
                  style={{ border: "4px solid #6A7D93" }}
                >
                  {micronutrients.fiber}g
                </div>
                <div className="text-xs text-gray-500">Fiber</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-8 p-6 bg-white rounded-lg">
            <div className="flex flex-col mb-2">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Macronutrients
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Macronutrients distribution of the recipe
              </div>
            </div>

            <div className="flex flex-col items-start justify-c">
              <PieChart width={300} height={300}>
                <Pie
                  data={chart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          <div className="flex flex-col mb-8 p-6 bg-white rounded-lg">
            <div className="flex flex-col mb-2">
              <div
                className={`text-2xl font-light ${
                  mode ? "dark:text-white" : "text-slate-800"
                }`}
              >
                Micronutrients
              </div>
              <div
                className={`text-sm font-light ${
                  mode ? "dark:text-slate-300" : "text-slate-500"
                }`}
              >
                Micronutrients distribution of the recipe
              </div>
            </div>

            <div className="flex flex-col">
              {Object.entries(micronutrients)
                .filter(([key]) => key !== "id") // bỏ id ra
                .map(([key, value], index) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between text-gray-500 p-2 ${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <span>{key}</span>
                    <div>
                      <span className="font-medium">
                        {value !== null ? value : "—"}
                      </span>{" "}
                      ug
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
