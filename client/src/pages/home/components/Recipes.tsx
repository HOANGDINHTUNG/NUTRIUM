import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpNarrowWide, Check, PencilLine, Plus } from "lucide-react";
import Pagination from "./Pagination";
import { useAppDispatch, useAppSelector } from "../../../hook/UseCustomeRedux";
import { getAllFoods } from "../../../api/Food.api";
import { getAllMacronutrients } from "../../../api/Macronutrient.api";
import { getAllCategory } from "../../../api/Category.api";
import Card from "./Card";

import type { IRecipe } from "../../../utils/interface/Recipes";
import SkeletonCard from "./SkeletonCard";
import { getAllRecipes } from "../../../stores/slices/recipeSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { getAllMicronutrients } from "../../../api/Micronutrient.api";
import { getAllIngredients } from "../../../api/Ingredient.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { getAllUsers, updateUser } from "../../../api/User.api";
import { StyledWrapper7 } from "@/pages/auth/ui/StyledWrapper";
import { VideoText } from "@/components/ui/video-text";
import { CardUi } from "../ui/CardUi";
import GoldCosmicSearch from "../ui/GoldCosmicSearch";

// 🔧 CSS masonry helper (nếu chưa có, thêm vào globals.css theo snippet ở dưới):
// .card-masonry { column-gap: 1.5rem; }
// .card-masonry-item { break-inside: avoid; margin-bottom: 1.5rem; }

// Optional: nếu muốn khoảng cách khác: thay 1.5rem bằng giá trị bạn muốn.

type NutrientSortField = "energy" | "fat" | "carbohydrates" | "protein";
type SortField = "" | NutrientSortField;

export default function Recipes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mode } = useAppSelector((state) => state.darkMode);

  // Redux states
  const { list, loading: recipesLoading } = useAppSelector((s) => s.recipe);
  const { listFoods, loading: foodsLoading } = useAppSelector((s) => s.food);
  const { listMacronutrients, loading: macrosLoading } = useAppSelector(
    (s) => s.macronutrient
  );
  const { listMicronutrients, loading: microsLoading } = useAppSelector(
    (s) => s.micronutrient
  );
  const { listCategory, loading: categoryLoading } = useAppSelector(
    (s) => s.category
  );
  const { listIngredients, loading: ingredientLoading } = useAppSelector(
    (s) => s.ingredient
  );
  const { currentUser } = useAppSelector((s) => s.auth);
  const { listUsers, loading: userLoading } = useAppSelector((s) => s.user);

  // Fetch data
  useEffect(() => {
    dispatch(getAllRecipes());
    dispatch(getAllFoods());
    dispatch(getAllMacronutrients());
    dispatch(getAllMicronutrients());
    dispatch(getAllCategory());
    dispatch(getAllIngredients());
    dispatch(getAllUsers());
  }, [dispatch]);

  const user = useMemo(() => {
    if (!Array.isArray(listUsers) || !currentUser?.username)
      return currentUser ?? null;
    return (
      listUsers.find((u) => u.username === currentUser?.username) ??
      currentUser ??
      null
    );
  }, [listUsers, currentUser]);

  const favoriteRecipeIds = useMemo(() => {
    if (!Array.isArray(user?.favorites)) return [];
    const uniqueFavorites = Array.from(new Set(user.favorites));
    if (!Array.isArray(list)) return uniqueFavorites;

    const validIds = new Set(list.map((recipe) => recipe.id));
    return uniqueFavorites.filter((id) => validIds.has(id));
  }, [user?.favorites, list]);

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [sortField, setSortField] = useState<SortField>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortOrderToggle = () => {
    if (!sortField) return;
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSortFieldChange = (value: SortField) => {
    setSortField(value);
    if (value) {
      setSortOrder("desc");
    }
  };

  const getMacronutrientValue = useCallback(
    (recipe: IRecipe, field: NutrientSortField): number => {
      if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0)
        return 0;
      if (!Array.isArray(listFoods) || !Array.isArray(listMacronutrients))
        return 0;

      const firstFoodId = recipe.ingredients[0];
      const firstFood = listFoods.find((food) => food.id === firstFoodId);
      if (!firstFood) return 0;

      const macro = listMacronutrients.find(
        (item) => item.id === firstFood.macronutrientsId
      );
      const value = macro?.[field];
      return typeof value === "number" ? value : 0;
    },
    [listFoods, listMacronutrients]
  );

  const processedRecipes: IRecipe[] = useMemo(() => {
    const items: IRecipe[] = Array.isArray(list) ? list : [];
    const searchValue = searchTerm.trim().toLowerCase();
    const categoryId =
      typeof selectedCategory === "number" ? selectedCategory : null;

    let result: IRecipe[] = items;

    if (searchValue) {
      result = result.filter((recipe) =>
        recipe.name?.toLowerCase().includes(searchValue)
      );
    }

    if (categoryId !== null) {
      result = result.filter(
        (recipe) =>
          Array.isArray(recipe.category) && recipe.category.includes(categoryId)
      );
    }

    result = [...result];

    if (sortField) {
      const field = sortField as NutrientSortField;
      result.sort((a, b) => {
        const valueA = getMacronutrientValue(a, field);
        const valueB = getMacronutrientValue(b, field);
        if (valueA === valueB) return 0;
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
    }

    return result;
  }, [
    list,
    searchTerm,
    selectedCategory,
    sortField,
    sortOrder,
    getMacronutrientValue,
  ]);

  const totalItems = processedRecipes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortField, sortOrder]);

  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedRecipes.slice(start, end);
  }, [processedRecipes, currentPage, pageSize]);

  // Loading
  const isLoading =
    recipesLoading ||
    foodsLoading ||
    macrosLoading ||
    microsLoading ||
    categoryLoading ||
    ingredientLoading ||
    userLoading ||
    !list ||
    !listFoods ||
    !listMacronutrients ||
    !listCategory ||
    !listMicronutrients ||
    !listIngredients ||
    !listUsers;

  const handleToggleFavorite = async (recipeId: number) => {
    const user = currentUser;
    if (!user) return;

    const isFavorite = favoriteRecipeIds.includes(recipeId);

    const updatedUser = {
      ...user,
      favorites: isFavorite
        ? favoriteRecipeIds.filter((id) => id !== recipeId)
        : [...favoriteRecipeIds, recipeId],
    };

    try {
      await dispatch(updateUser(updatedUser));
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  return (
    <div
      className={`h-full py-6 px-4 transition-colors duration-300 ${
        mode ? "bg-[#0B0B0C]" : "bg-gray-200"
      }`}
    >
      <div
        className={`flex flex-col rounded-lg p-4 shadow-sm transition-colors duration-300 ${
          mode ? "bg-[#111216] text-[#F2F2F2]" : "bg-white/95"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {mode ? (
              <div className="relative h-[80px] w-[300px] overflow-hidden">
                <VideoText src="https://res.cloudinary.com/di8ege413/video/upload/v1761825539/13763614_2160_3840_30fps_z2mvy0.mp4">
                  RECIPES
                </VideoText>
              </div>
            ) : (
              <div
                className={`text-2xl font-light ${
                  mode ? "text-[#E8C971]" : "text-slate-800"
                }`}
              >
                Recipes
              </div>
            )}
            {mode ? (
              <div className={`mb-4 text-lg text-yellow-500`}>
                Search, check and create new recipes
              </div>
            ) : (
              <div
                className={`mb-4 text-sm font-light ${
                  mode ? "text-[#C9C9CF]" : "text-slate-500"
                }`}
              >
                Search, check and create new recipes
              </div>
            )}
          </div>
          <Plus
            className={`${
              mode ? "text-[#D4AF37]" : "text-slate-800"
            } cursor-pointer`}
            onClick={() =>
              navigate(mode ? ROUTES.RECIPE_EFFECT : ROUTES.RECIPE_INFOR)
            }
          />
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-3">
          {mode ? (
            <GoldCosmicSearch
              className="flex-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your favorite recipes…"
            />
          ) : (
            <input
              type="text"
              placeholder="Search recipe"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`flex-3 rounded-md border px-3 py-2 text-sm transition-colors placeholder:text-sm ${
                mode
                  ? "border-[#24262D] bg-black text-[#d3a50c] placeholder-[#7C828C] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.28)]"
                  : "text-slate-700 border-slate-200 bg-white placeholder:text-slate-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300/60"
              }`}
            />
          )}
          <div
            className={`flex flex-1 overflow-hidden rounded-md border ${
              mode ? "border-[#24262D]" : "border-slate-200"
            }`}
          >
            <div
              className={`flex items-center justify-center border-r px-2 ${
                mode
                  ? "border-[#2E3139] text-[#C9C9CF] bg-black"
                  : "border-slate-200 text-slate-500"
              } ${
                sortField ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
              onClick={handleSortOrderToggle}
              role="button"
              title="Toggle sort order"
              aria-label="Toggle sort order"
              aria-pressed={sortOrder === "asc"}
              aria-disabled={!sortField}
            >
              <ArrowUpNarrowWide
                className={`h-[18px] w-[18px] transform transition-transform duration-200 ${
                  mode
                    ? sortField
                      ? "text-[#D4AF37]"
                      : ""
                    : sortField
                    ? "text-[#08ba46]"
                    : ""
                } ${sortField && sortOrder === "asc" ? "rotate-180" : ""} ${
                  !sortField ? "opacity-50" : ""
                }`}
              />
            </div>
            <select
              name="sort"
              id="sort"
              className={`flex-1 appearance-none px-2 text-sm outline-none ${
                mode ? "text-[#d3a50c] bg-black" : "text-slate-600"
              }`}
              value={sortField}
              onChange={(event) =>
                handleSortFieldChange(event.target.value as SortField)
              }
            >
              <option value="">Sort by nutrient</option>
              <option value="energy">Energy</option>
              <option value="fat">Fat</option>
              <option value="carbohydrates">Carbohydrate</option>
              <option value="protein">Protein</option>
            </select>
          </div>
          <select
            name="category"
            id="category"
            className={`flex-1 rounded-md border px-3 py-2 text-sm appearance-none ${
              mode
                ? "border-[#24262D] bg-black text-[#d3a50c] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.28)]"
                : "text-slate-600 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300/60 border-slate-200 bg-white"
            }`}
            value={selectedCategory === "" ? "" : String(selectedCategory)}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value ? Number(event.target.value) : ""
              )
            }
          >
            <option value="">All categories</option>
            {Array.isArray(listCategory) &&
              listCategory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          {mode ? (
            <div
              onClick={() => {
                navigate(ROUTES.HOME);
              }}
            >
              <StyledWrapper7>
                <button className="button flex items-center">
                  <FontAwesomeIcon icon={faHeart} id="icon_font" />
                  <span
                    className={`${mode ? "text-[#F2F2F2]" : "text-slate-800"}`}
                  >
                    Favorites
                  </span>
                  <span
                    className={`${mode ? "text-[#F2F2F2]" : "text-slate-800"}`}
                  >
                    {favoriteRecipeIds.length}
                  </span>
                </button>
              </StyledWrapper7>
            </div>
          ) : (
            <div
              className={`px-3 py-2 flex gap-2 border rounded-lg items-center cursor-pointer  ${
                mode
                  ? "border-[rgba(232,201,113,0.3)] hover:bg-[rgba(232,201,113,0.08)]"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => {
                navigate(ROUTES.HOME);
              }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={`${mode ? "text-[#B9384F]" : "text-red-600"}`}
              />
              <span className={`${mode ? "text-[#F2F2F2]" : "text-slate-800"}`}>
                Favorites
              </span>
              <span className={`${mode ? "text-[#F2F2F2]" : "text-slate-800"}`}>
                {favoriteRecipeIds.length}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-blue-600">
            <Check />
            <PencilLine className="w-4 h-4" />
            <span className="font-medium">My recipes</span>
          </div>
        </div>

        {/* Grid */}
        <div
          className={`mb-6 ${
            mode
              ? "card-masonry columns-1 sm:columns-2 xl:columns-3"
              : "grid grid-cols-2 gap-6"
          }`}
        >
          {(isLoading
            ? Array.from({ length: pageSize }).map((_, i) => ({
                type: "skeleton" as const,
                key: `skeleton-${i}`,
              }))
            : paginatedRecipes.map((recipe: IRecipe, index) => ({
                type: "recipe" as const,
                data: recipe,
                key: recipe.id ?? `recipe-${index}`,
              }))
          ).map((item) => {
            if (item.type === "skeleton") {
              return mode ? (
                <div key={item.key} className="card-masonry-item">
                  <SkeletonCard />
                </div>
              ) : (
                <SkeletonCard key={item.key} />
              );
            }

            const recipe = item.data;
            const firstFoodId = recipe.ingredients?.[0];
            const firstFood = listFoods.find((f) => f.id === firstFoodId);
            const macro = firstFood
              ? listMacronutrients.find(
                  (m) => m.id === firstFood.macronutrientsId
                )
              : undefined;
            const micro = firstFood
              ? listMicronutrients.find(
                  (m) => m.id === firstFood.micronutrientsId
                )
              : undefined;
            const isFavorite = favoriteRecipeIds.includes(recipe.id);
            const numberFavorite = (): number =>
              Array.isArray(listUsers)
                ? listUsers.reduce(
                    (count, item) =>
                      Array.isArray(item.favorites) &&
                      item.favorites.includes(recipe.id)
                        ? count + 1
                        : count,
                    0
                  )
                : 0;

            const Effect = mode ? (
              <CardUi
                id={recipe.id}
                recipe={recipe}
                macronutrients={macro}
                micronutrients={micro}
                listCategory={listCategory ?? []}
                listIngredients={listIngredients ?? []}
                listFoods={listFoods ?? []}
                favorite={isFavorite}
                numberFavorite={numberFavorite()}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ) : (
              <Card
                id={recipe.id}
                recipe={recipe}
                macronutrients={macro}
                micronutrients={micro}
                listCategory={listCategory ?? []}
                listIngredients={listIngredients ?? []}
                listFoods={listFoods ?? []}
                favorite={isFavorite}
                numberFavorite={numberFavorite()}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            );
            return mode ? (
              <div key={item.key} className="card-masonry-item">
                {Effect}
              </div>
            ) : (
              <div key={item.key}>{Effect}</div>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          boundaryCount={1}
        />
      </div>
    </div>
  );
}
