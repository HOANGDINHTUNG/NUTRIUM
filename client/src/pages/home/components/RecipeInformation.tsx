import {
  ArrowUpNarrowWide,
  ChevronUp,
  Heart,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  TicketPlus,
  Trash,
  Users,
  X,
} from "lucide-react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hook/UseCustomeRedux";
import { getAllFoods } from "../../../api/Food.api";
import { getAllCategory } from "../../../api/Category.api";
import { getAllMacronutrients } from "../../../api/Macronutrient.api";
import { getAllMicronutrients } from "../../../api/Micronutrient.api";
import { getAllIngredients } from "../../../api/Ingredient.api";
import Pagination from "./Pagination";
import { postImageCloudinary, cldUrl } from "../../../utils/cloudinary";
import { createRecipe } from "../../../api/Recipe.api";
import { getAllRecipes } from "../../../stores/slices/recipeSlice";
import { ROUTES } from "../../../constants/routes";
import type { RecipeCategory } from "../../../utils/interface/RecipeCategory";
import type { IFood } from "../../../utils/interface/Foods";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { RecipeIngredient } from "../../../utils/interface/Recipes";
type BasicField =
  | "name"
  | "description"
  | "totalTime"
  | "preparationTime"
  | "finalWeight"
  | "portions";

type FieldErrors = Partial<Record<BasicField, string>>;

type StepItem = {
  id: number;
  content: string;
};

type StepErrors = Record<number, string>;

const INGREDIENTS_PER_PAGE = 6;
const MACRO_COLORS = ["#DB4965", "#EA9F77", "#1AB394"];
type MicroFieldKey = Exclude<keyof IMicronutrient, "id">;
const MICRO_FIELD_META: Array<{
  key: MicroFieldKey;
  label: string;
  unit: string;
}> = [
  { key: "sodium", label: "Sodium", unit: "mg" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "water", label: "Water", unit: "g" },
  { key: "vitaminA", label: "Vitamin A", unit: "ug" },
  { key: "vitaminB6", label: "Vitamin B6", unit: "mg" },
  { key: "vitaminB12", label: "Vitamin B12", unit: "ug" },
  { key: "vitaminC", label: "Vitamin C", unit: "mg" },
  { key: "vitaminD", label: "Vitamin D", unit: "IU" },
  { key: "vitaminE", label: "Vitamin E", unit: "mg" },
  { key: "vitaminK", label: "Vitamin K", unit: "ug" },
  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "magnesium", label: "Magnesium", unit: "mg" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "zinc", label: "Zinc", unit: "mg" },
  { key: "copper", label: "Copper", unit: "mg" },
  { key: "selenium", label: "Selenium", unit: "ug" },
  { key: "thiamin", label: "Thiamin (B1)", unit: "mg" },
  { key: "riboflavin", label: "Riboflavin (B2)", unit: "mg" },
  { key: "niacin", label: "Niacin (B3)", unit: "mg" },
  { key: "pantothenicAcid", label: "Pantothenic Acid (B5)", unit: "mg" },
  { key: "folateTotal", label: "Folate Total", unit: "ug" },
  { key: "folicAcid", label: "Folic Acid", unit: "ug" },
  { key: "chloride", label: "Chloride", unit: "mg" },
  { key: "starch", label: "Starch", unit: "g" },
  { key: "lactose", label: "Lactose", unit: "g" },
  { key: "sugars", label: "Sugars", unit: "g" },
  { key: "alcohol", label: "Alcohol", unit: "g" },
  { key: "caffeine", label: "Caffeine", unit: "mg" },
  { key: "fluoride", label: "Fluoride", unit: "mg" },
  { key: "manganese", label: "Manganese", unit: "mg" },
  { key: "fattyAcidsTotalTrans", label: "Trans Fat", unit: "g" },
  { key: "fattyAcidsTotalSaturated", label: "Saturated Fat", unit: "g" },
  {
    key: "fattyAcidsTotalMonounsaturated",
    label: "Monounsaturated Fat",
    unit: "g",
  },
  {
    key: "fattyAcidsTotalPolyunsaturated",
    label: "Polyunsaturated Fat",
    unit: "g",
  },
];

const initialBasicValues: Record<BasicField, string> = {
  name: "",
  description: "",
  totalTime: "",
  preparationTime: "",
  finalWeight: "",
  portions: "",
};

const createStep = (): StepItem => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  content: "",
});

const buildMacroMap = (items: IMacronutrient[] | undefined | null) => {
  const map = new Map<number, IMacronutrient>();
  if (!Array.isArray(items)) return map;
  items.forEach((item) => {
    map.set(item.id, item);
  });
  return map;
};

const buildMicroMap = (items: IMicronutrient[] | undefined | null) => {
  const map = new Map<number, IMicronutrient>();
  if (!Array.isArray(items)) return map;
  items.forEach((item) => {
    map.set(item.id, item);
  });
  return map;
};
export default function RecipeInformation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mode } = useAppSelector((state) => state.darkMode);
  const { listFoods, loading: foodsLoading } = useAppSelector(
    (state) => state.food
  );
  const { listCategory } = useAppSelector((state) => state.category);
  const { listMacronutrients } = useAppSelector((state) => state.macronutrient);
  const { listMicronutrients } = useAppSelector((state) => state.micronutrient);
  const { listIngredients } = useAppSelector((state) => state.ingredient);
  const { currentUser } = useAppSelector((state) => state.auth);

  const [changeMode, setChangeMode] = useState<boolean>(true);
  const [formValues, setFormValues] =
    useState<Record<BasicField, string>>(initialBasicValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientPage, setIngredientPage] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [latestIngredientId, setLatestIngredientId] = useState<number | null>(
    null
  );

  const [steps, setSteps] = useState<StepItem[]>(() => [createStep()]);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [cookingError, setCookingError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageOptimized, setImageOptimized] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(getAllFoods());
    dispatch(getAllCategory());
    dispatch(getAllMacronutrients());
    dispatch(getAllMicronutrients());
    dispatch(getAllIngredients());
  }, [dispatch]);

  const macrosMap = useMemo(
    () => buildMacroMap(listMacronutrients),
    [listMacronutrients]
  );
  const microsMap = useMemo(
    () => buildMicroMap(listMicronutrients),
    [listMicronutrients]
  );

  const foods = useMemo(() => {
    if (!Array.isArray(listFoods)) return [];
    const search = ingredientSearch.trim().toLowerCase();
    if (!search) return listFoods;
    return listFoods.filter((food) => food.name.toLowerCase().includes(search));
  }, [ingredientSearch, listFoods]);

  const totalIngredientPages = Math.max(
    1,
    Math.ceil(foods.length / INGREDIENTS_PER_PAGE)
  );

  useEffect(() => {
    setIngredientPage(1);
  }, [ingredientSearch]);

  const paginatedFoods = useMemo(() => {
    const start = (ingredientPage - 1) * INGREDIENTS_PER_PAGE;
    return foods.slice(start, start + INGREDIENTS_PER_PAGE);
  }, [foods, ingredientPage]);
  const selectedFoods = useMemo(() => {
    if (!Array.isArray(listFoods)) return [];
    return selectedIngredients
      .map((id) => listFoods.find((food) => food.id === id) ?? null)
      .filter((item): item is IFood => item !== null);
  }, [listFoods, selectedIngredients]);

  const latestSelectedFood = useMemo(() => {
    if (!latestIngredientId) return null;
    return listFoods?.find((food) => food.id === latestIngredientId) ?? null;
  }, [latestIngredientId, listFoods]);

  const aggregatedMacros = useMemo(() => {
    return selectedFoods.reduce(
      (acc, food) => {
        const macro = macrosMap.get(food.macronutrientsId);
        if (!macro) return acc;
        return {
          energy: acc.energy + (macro.energy ?? 0),
          carbohydrates: acc.carbohydrates + (macro.carbohydrates ?? 0),
          fat: acc.fat + (macro.fat ?? 0),
          protein: acc.protein + (macro.protein ?? 0),
        };
      },
      { energy: 0, carbohydrates: 0, fat: 0, protein: 0 }
    );
  }, [macrosMap, selectedFoods]);

  const macroChartData = useMemo(
    () => [
      { name: "Fat", value: Math.max(aggregatedMacros.fat, 0) },
      {
        name: "Carbohydrate",
        value: Math.max(aggregatedMacros.carbohydrates, 0),
      },
      { name: "Protein", value: Math.max(aggregatedMacros.protein, 0) },
    ],
    [
      aggregatedMacros.carbohydrates,
      aggregatedMacros.fat,
      aggregatedMacros.protein,
    ]
  );

  const latestMicro = useMemo(() => {
    if (!latestSelectedFood) return null;
    return microsMap.get(latestSelectedFood.micronutrientsId) ?? null;
  }, [latestSelectedFood, microsMap]);

  const handleInputChange =
    (field: BasicField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setIsUploadingImage(true);
    try {
      const uploadedUrl = await postImageCloudinary(file);
      const optimizedUrl = cldUrl(uploadedUrl);
      setImageUrl(uploadedUrl);
      setImageOptimized(optimizedUrl);
    } catch (error) {
      console.error(error);
      setImageError("Tai anh len that bai. Vui long thu lai.");
      setImageUrl("");
      setImageOptimized("");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const toggleCategoryPicker = () => {
    setCategoryPickerOpen((prev) => !prev);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const selectedCategoryEntities = useMemo(() => {
    if (!Array.isArray(listCategory)) return [];
    const map = new Map<number, RecipeCategory>();
    listCategory.forEach((item) => map.set(item.id, item));
    return selectedCategories
      .map((id) => map.get(id))
      .filter((item): item is RecipeCategory => Boolean(item));
  }, [listCategory, selectedCategories]);

  const handleAddIngredient = useCallback((foodId: number) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(foodId)) return prev;
      setLatestIngredientId(foodId);
      return [...prev, foodId];
    });
  }, []);

  const handleRemoveIngredient = (foodId: number) => {
    setSelectedIngredients((prev) => {
      const next = prev.filter((id) => id !== foodId);
      if (latestIngredientId === foodId) {
        setLatestIngredientId(next.length > 0 ? next[next.length - 1] : null);
      }
      return next;
    });
  };

  const handleStepChange = (stepId: number, value: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, content: value } : step
      )
    );
    setStepErrors((prev) => ({ ...prev, [stepId]: "" }));
    setCookingError(null);
  };

  const handleStepKeyDown =
    (stepId: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const step = steps.find((item) => item.id === stepId);
      if (!step) return;
      if (!step.content.trim()) {
        setStepErrors((prev) => ({
          ...prev,
          [stepId]: "Vui long nhap noi dung truoc khi tao buoc moi.",
        }));
        return;
      }
      setSteps((prev) => {
        const index = prev.findIndex((item) => item.id === stepId);
        const next = [...prev];
        next.splice(index + 1, 0, createStep());
        return next;
      });
    };

  const handleRemoveStep = (stepId: number) => {
    if (steps.length === 1) {
      setSteps([createStep()]);
      setCookingError("Can it nhat 1 buoc nau.");
      return;
    }
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[stepId];
      return next;
    });
  };
  const validateForm = () => {
    const nextFieldErrors: FieldErrors = {};
    if (!formValues.name.trim()) {
      nextFieldErrors.name = "Vui long nhap ten mon an.";
    }
    if (!formValues.description.trim()) {
      nextFieldErrors.description = "Vui long mo ta ngan gon mon an.";
    }
    if (!formValues.totalTime.trim()) {
      nextFieldErrors.totalTime = "Tong thoi gian la bat buoc.";
    }
    if (!formValues.preparationTime.trim()) {
      nextFieldErrors.preparationTime = "Thoi gian chuan bi la bat buoc.";
    }
    if (!formValues.finalWeight.trim()) {
      nextFieldErrors.finalWeight = "Khoi luong sau khi nau la bat buoc.";
    }
    if (!formValues.portions.trim()) {
      nextFieldErrors.portions = "So khau phan la bat buoc.";
    } else if (Number.isNaN(Number(formValues.portions))) {
      nextFieldErrors.portions = "So khau phan phai la so.";
    }

    setFieldErrors(nextFieldErrors);

    const nextStepErrors: StepErrors = {};
    const trimmedSteps = steps.map((step) => step.content.trim());
    trimmedSteps.forEach((content, index) => {
      if (!content) {
        nextStepErrors[steps[index].id] = "Noi dung buoc khong duoc de trong.";
      }
    });
    if (trimmedSteps.filter(Boolean).length === 0) {
      setCookingError("Can it nhat 1 buoc nau.");
    } else {
      setCookingError(null);
    }
    setStepErrors(nextStepErrors);

    const hasFieldError = Object.values(nextFieldErrors).some(Boolean);
    const hasStepError =
      Object.values(nextStepErrors).some(Boolean) ||
      trimmedSteps.filter(Boolean).length === 0;

    return !(hasFieldError || hasStepError);
  };

  const mapIngredientsV2 = (): RecipeIngredient[] => {
    if (!Array.isArray(listIngredients)) {
      return selectedIngredients.map((foodId) => ({
        foodId,
        quantity: 1,
        unit: "portion",
        grams: 0,
      }));
    }
    return selectedIngredients.map((foodId) => {
      const match = listIngredients.find((item) => item.foodId === foodId);
      if (!match) {
        return {
          foodId,
          quantity: 1,
          unit: "portion",
          grams: 0,
        };
      }
      return { ...match };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    if (!imageOptimized) {
      setImageError("Vui long tai len anh cua mon an.");
      window.alert("Ban phai tai anh len truoc khi luu.");
      return;
    }

    if (selectedIngredients.length === 0) {
      window.alert("Hay them it nhat 1 nguyen lieu cho mon an.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanSteps = steps
        .map((step) => step.content.trim())
        .filter(Boolean)
        .map((content, index) => ({
          step: index + 1,
          content: `STEP ${index + 1} ${content}`,
        }));

      const payload = {
        id: Date.now(),
        coverSrc: imageOptimized,
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        author: currentUser?.username ?? "Anonymous",
        totalTime: formValues.totalTime.trim(),
        preparationTime: formValues.preparationTime.trim(),
        finalWeight: formValues.finalWeight.trim(),
        portions: Number(formValues.portions),
        ingredients: selectedIngredients,
        cookingMethods: cleanSteps,
        category: selectedCategories,
        image: imageUrl,
        imageUrl,
        imageOptimized,
        ingredientsV2: mapIngredientsV2(),
      };

      await createRecipe(payload);
      await dispatch(getAllRecipes());
      window.alert("Tao cong thuc thanh cong!");
      navigate(ROUTES.RECIPE);
    } catch (error) {
      console.error(error);
      setSubmitError(
        "Khong the tao cong thuc ngay luc nay. Vui long thu lai sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-[100vh] py-6 px-4 transition-colors duration-300 ${
        mode ? "bg-[#0B0B0C] text-[#F2F2F2]" : "bg-gray-200"
      }`}
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex gap-8">
          <div
            className={`px-8 py-9 flex flex-col justify-between bg-white rounded-lg w-[320px] h-[350px] relative overflow-visible border ${
              mode ? "border-[#24262D]" : "border-transparent"
            }`}
            style={
              imageOptimized
                ? {
                    backgroundImage: `url(${imageOptimized})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {imageOptimized ? (
              <div className="absolute inset-0 bg-black/40" />
            ) : null}
            <div className="relative flex items-center justify-between">
              {changeMode ? (
                <div
                  className="flex items-center gap-2 text-blue-600 border border-gray-300 rounded-lg shadow-xl px-2 py-1 cursor-pointer bg-white/90"
                  onClick={() => setChangeMode(false)}
                >
                  <PencilLine className="w-4 h-4" />
                  <span className="font-medium">My recipes</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 text-orange-400 border border-gray-300 rounded-lg shadow-xl px-2 py-1 cursor-pointer bg-white/90"
                  onClick={() => setChangeMode(true)}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Community Recipes</span>
                </div>
              )}
              <div
                className={`px-2 py-1 flex items-center gap-4 border rounded-lg ${
                  mode ? "border-[#24262D] bg-black/30" : "border-gray-400"
                }`}
              >
                <Heart className="text-black h-4" />
                <span
                  className={`${mode ? "text-[#C9C9CF]" : "text-slate-600"}`}
                >
                  0
                </span>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={handleOpenFileDialog}
                className="flex items-center gap-2 text-orange-400 border border-gray-300 rounded-lg shadow-xl px-3 py-2 bg-white/90"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                ) : (
                  <PencilLine className="w-4 h-4" />
                )}
                <span className="text-black">
                  {imageOptimized ? "Change image" : "Upload image"}
                </span>
              </button>
              {imageError ? (
                <p className="text-xs text-red-500 text-center bg-white/90 px-2 py-1 rounded">
                  {imageError}
                </p>
              ) : null}
            </div>

            <div className="relative flex flex-col gap-3">
              <div
                className="flex w-40 items-center gap-2 text-orange-400 border border-gray-300 rounded-lg shadow-xl px-2 py-1 bg-white/90 cursor-pointer select-none"
                onDoubleClick={toggleCategoryPicker}
                title="Double click đe chon category"
              >
                <TicketPlus />
                <span className="text-black ">New category</span>
              </div>

              {categoryPickerOpen ? (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-40 overflow-auto z-10">
                  {Array.isArray(listCategory) && listCategory.length > 0 ? (
                    listCategory.map((category) => {
                      const checked = selectedCategories.includes(category.id);
                      return (
                        <label
                          key={category.id}
                          className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <span>{category.name}</span>
                          <input
                            type="checkbox"
                            className="accent-emerald-500"
                            checked={checked}
                            onChange={() => handleSelectCategory(category.id)}
                          />
                        </label>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Khong co category nao.
                    </div>
                  )}
                </div>
              ) : null}

              {selectedCategoryEntities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryEntities.map((category) => (
                    <span
                      key={category.id}
                      className="bg-emerald-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        className="hover:text-gray-200"
                        onClick={() => handleSelectCategory(category.id)}
                        aria-label={`Remove ${category.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between px-7 py-5 bg-white rounded-lg text-black shadow-sm">
              <div className="flex flex-col">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Publish recipe
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Publish your recipe on your website or share it with the
                  Nutrium community
                </div>
              </div>
              <button
                type="submit"
                className="p-2 rounded-lg text-white flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "#1AB394" }}
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : null}
                <span>Publish</span>
              </button>
            </div>

            <div className="flex flex-col px-7 py-5 bg-white rounded-lg text-black gap-4 shadow-sm">
              <div className="flex flex-col">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Basic information
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Check and edit recipe&apos;s basic information
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div
                  className={`flex h-[48px] border ${
                    fieldErrors.name ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 text-black">Name</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-gray-700 outline-none"
                      placeholder="Recipe name"
                      value={formValues.name}
                      onChange={handleInputChange("name")}
                    />
                  </div>
                </div>
                {fieldErrors.name ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.name}
                  </p>
                ) : null}

                <div
                  className={`flex h-[120px] border ${
                    fieldErrors.description
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 py-3 text-black">Description</div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="h-full w-full px-3 py-3 text-gray-700 resize-none outline-none"
                      placeholder="Describe your recipe"
                      value={formValues.description}
                      onChange={handleInputChange("description")}
                    />
                  </div>
                </div>
                {fieldErrors.description ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.description}
                  </p>
                ) : null}

                <div
                  className={`flex h-[48px] border ${
                    fieldErrors.totalTime ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 text-black">Total time</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-gray-700 outline-none"
                      placeholder="hh:mm"
                      value={formValues.totalTime}
                      onChange={handleInputChange("totalTime")}
                    />
                  </div>
                </div>
                {fieldErrors.totalTime ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.totalTime}
                  </p>
                ) : null}

                <div
                  className={`flex h-[48px] border ${
                    fieldErrors.preparationTime
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 text-black">Preparation time</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-gray-700 outline-none"
                      placeholder="hh:mm"
                      value={formValues.preparationTime}
                      onChange={handleInputChange("preparationTime")}
                    />
                  </div>
                </div>
                {fieldErrors.preparationTime ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.preparationTime}
                  </p>
                ) : null}

                <div
                  className={`flex h-[48px] border ${
                    fieldErrors.finalWeight
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 text-black">Final weight</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-gray-700 outline-none"
                      placeholder="e.g. 300 grams"
                      value={formValues.finalWeight}
                      onChange={handleInputChange("finalWeight")}
                    />
                  </div>
                </div>
                {fieldErrors.finalWeight ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.finalWeight}
                  </p>
                ) : null}

                <div
                  className={`flex h-[48px] border ${
                    fieldErrors.portions ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center bg-gray-100 w-[200px] border-r border-gray-200">
                    <div className="px-5 text-black">Portions</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      className="h-full w-full px-3 text-gray-700 outline-none"
                      placeholder="Number of servings"
                      value={formValues.portions}
                      onChange={handleInputChange("portions")}
                      min={1}
                    />
                  </div>
                </div>
                {fieldErrors.portions ? (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.portions}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {submitError ? (
          <div className="px-6 py-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {submitError}
          </div>
        ) : null}

        <div
          className="px-6 py-4 flex flex-col rounded-lg mt-2 text-white shadow"
          style={{ backgroundColor: "#1AB394" }}
        >
          <span className="text-xl">Creation</span>
          <span className="text-sm font-light">
            Create the recipe and choose the ingredients
          </span>
        </div>

        <div className="flex gap-8 xl:flex-row">
          <div className="flex-2 flex flex-col gap-8">
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col mb-2">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Selected ingredients
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Nguyen lieu ban da them se hien thi tai day
                </div>
              </div>

              {selectedFoods.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg px-4 py-6 text-sm text-gray-500 text-center">
                  Chua co nguyen lieu nao duoc chon.
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[320px] overflow-auto pr-2">
                  {selectedFoods.map((food) => {
                    const macro = macrosMap.get(food.macronutrientsId);
                    return (
                      <div
                        key={food.id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-gray-800">
                              {food.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {food.quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(food.id)}
                            className="text-red-400 hover:text-red-500"
                            title="Xoa nguyen lieu"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                        {macro ? (
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <span>Energy: {macro.energy} kcal</span>
                            <span>Carbs: {macro.carbohydrates} g</span>
                            <span>Protein: {macro.protein} g</span>
                            <span>Fat: {macro.fat} g</span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col rounded-lg bg-white shadow-sm">
              <div className="flex flex-col mb-6">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Ingredients
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Search and add ingredients to the recipe
                </div>
              </div>

              <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-200 bg-gray-100">
                  <div className="px-4 py-3 flex items-center gap-2 flex-1">
                    <ChevronUp className="text-emerald-500" />
                    <input
                      type="text"
                      className="h-9 flex-1 bg-white border border-gray-200 rounded px-3 text-gray-600 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Search food"
                      value={ingredientSearch}
                      onChange={(event) =>
                        setIngredientSearch(event.target.value)
                      }
                    />
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2 border-l border-gray-200">
                    <ArrowUpNarrowWide className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {foods.length} items
                    </span>
                  </div>
                </div>

                <div className="bg-white">
                  {foodsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {paginatedFoods.map((food) => {
                        const macro = macrosMap.get(food.macronutrientsId);
                        return (
                          <div
                            key={food.id}
                            className="border border-gray-200 rounded-lg p-4 relative group hover:shadow transition-shadow"
                          >
                            <button
                              type="button"
                              onClick={() => handleAddIngredient(food.id)}
                              className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-500 text-emerald-500 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Them nguyen lieu"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col gap-1 pr-8">
                              <h4 className="text-base font-semibold text-gray-800">
                                {food.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {food.quantity}
                              </p>
                              <p className="text-xs text-gray-400">
                                Source: {food.source}
                              </p>
                              {macro ? (
                                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                                  <span>Energy: {macro.energy} kcal</span>
                                  <span>Carbs: {macro.carbohydrates} g</span>
                                  <span>Protein: {macro.protein} g</span>
                                  <span>Fat: {macro.fat.toFixed(1)} g</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                      {paginatedFoods.length === 0 && !foodsLoading ? (
                        <div className="col-span-full text-center text-sm text-gray-500 py-10">
                          Khong tim thay thuc pham phu hop.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Da chon: {selectedIngredients.length} nguyen lieu
                  </div>
                  <Pagination
                    currentPage={ingredientPage}
                    totalPages={totalIngredientPages}
                    onPageChange={setIngredientPage}
                    siblingCount={1}
                    boundaryCount={1}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col rounded-lg bg-white shadow-sm">
              <div className="flex flex-col mb-6">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Cooking method
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Give instructions to prepare this recipe
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col gap-1">
                    <div
                      className={`flex h-[48px] border ${
                        stepErrors[step.id]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center bg-gray-100 border-r border-gray-200 min-w-[56px] justify-center text-sm text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          className="h-full w-full px-3 text-gray-700 outline-none"
                          placeholder="Add new cooking method"
                          value={step.content}
                          onChange={(event) =>
                            handleStepChange(step.id, event.target.value)
                          }
                          onKeyDown={handleStepKeyDown(step.id)}
                        />
                      </div>
                      <div className="px-2 border-l bg-gray-100 border-gray-200 flex items-center gap-2">
                        <Pencil className="text-emerald-400 w-4 h-4" />
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(step.id)}
                          className="text-red-400 hover:text-red-500"
                          title="Xoa buoc"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {stepErrors[step.id] ? (
                      <p className="text-xs text-red-500 px-2">
                        {stepErrors[step.id]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              {cookingError ? (
                <p className="text-xs text-red-500 mt-2">{cookingError}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Enter de them buoc moi sau khi nhap noi dung.
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col  p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col mb-2">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Global analysis
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Energy, macronutrients and fiber distribution
                </div>
              </div>

              <div className="border-b border-gray-200 flex items-center justify-between text-gray-500 mb-4 pb-3">
                <div className="text-sm">Energy</div>
                <div>
                  <span className="font-medium text-black">
                    {aggregatedMacros.energy}
                  </span>{" "}
                  kcal
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full border-4 border-gray-300 h-12 w-12 text-black flex items-center justify-center text-sm">
                    {aggregatedMacros.fat} g
                  </div>
                  <div>Fat</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full border-4 border-amber-500 h-12 w-12 text-black flex items-center justify-center text-sm">
                    {aggregatedMacros.carbohydrates} g
                  </div>
                  <div>Carbohydrate</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full border-4 border-gray-300 h-12 w-12 text-black flex items-center justify-center text-sm">
                    {aggregatedMacros.protein} g
                  </div>
                  <div>Protein</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full border-4 border-gray-900 h-12 w-12 text-black flex items-center justify-center text-sm">
                    {selectedFoods.length}
                  </div>
                  <div>Ingredients</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col  p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col mb-2">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Macronutrients
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Ty le macronutrients cua cong thuc
                </div>
              </div>

              <div className="flex justify-center">
                <PieChart width={270} height={270}>
                  <Pie
                    data={macroChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    dataKey="value"
                  >
                    {macroChartData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={MACRO_COLORS[index % MACRO_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>

            <div className="flex flex-col  p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col mb-2">
                <div
                  className={`text-2xl font-light ${
                    mode ? "text-[#E8C971]" : "text-slate-800"
                  }`}
                >
                  Latest ingredient
                </div>
                <div
                  className={`text-sm font-light ${
                    mode ? "text-[#C9C9CF]" : "text-slate-500"
                  }`}
                >
                  Thong tin chi tiet cua nguyen lieu vua them
                </div>
              </div>

              {latestSelectedFood && latestMicro ? (
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {latestSelectedFood.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {latestSelectedFood.quantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {MICRO_FIELD_META.map(({ key, label, unit }) => {
                      const raw = latestMicro[key];
                      const displayValue =
                        raw === null || raw === undefined || Number.isNaN(raw)
                          ? "-"
                          : raw;
                      return (
                        <span key={key}>
                          {label}: {displayValue} {unit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 text-center rounded-lg">
                  Chon nguyen lieu de xem thong tin chi tiet tai day.
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
