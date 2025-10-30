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
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hook/UseCustomeRedux";
import { getAllFoods } from "../../../api/Food.api";
import { getAllCategory } from "../../../api/Category.api";
import { getAllMacronutrients } from "../../../api/Macronutrient.api";
import { getAllMicronutrients } from "../../../api/Micronutrient.api";
import { getAllIngredients } from "../../../api/Ingredient.api";
import { postImageCloudinary, cldUrl } from "../../../utils/cloudinary";
import { createRecipe } from "../../../api/Recipe.api";
import { getAllRecipes } from "../../../stores/slices/recipeSlice";
import { ROUTES } from "../../../constants/routes";
import type { RecipeCategory } from "../../../utils/interface/RecipeCategory";
import type { IFood } from "../../../utils/interface/Foods";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { RecipeIngredient } from "../../../utils/interface/Recipes";
import Pagination from "../components/Pagination";

const GOLD = "#E8C971";
const GOLD_SOFT = "#C8A95A";
const GOLD_DIM = "#8F7A39";
// const INK = "#0B0B0C";
const SLATE = "#111216";
const CARD = "rgba(20,20,24,0.8)";

const MACRO_COLORS = [GOLD, GOLD_DIM, GOLD_SOFT];

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
      return;
    }

    if (selectedIngredients.length === 0) {
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

  // ===================== UI HELPERS =====================
  const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
    className = "",
    children,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl border border-[#1f222a] shadow-[0_0_0_1px_rgba(232,201,113,0.04)] bg-[${CARD}] backdrop-blur-md ${className}`}
      style={{ background: CARD }}
    >
      {children}
    </motion.div>
  );

  const SectionTitle: React.FC<{
    title: string;
    subtitle?: string;
  }> = ({ title, subtitle }) => (
    <div className="flex flex-col mb-2">
      <h3 className="text-2xl font-semibold tracking-tight text-[${GOLD}]">
        {title}
      </h3>
      {subtitle ? <p className="text-sm text-zinc-400/90">{subtitle}</p> : null}
    </div>
  );

  // ===================== RENDER =====================
  return (
    <div
      className={`min-h-[100vh] py-8 px-4 md:px-6 lg:px-10 transition-colors duration-300 ${
        mode ? "bg-[#0B0B0C] text-[#F2F2F2]" : "bg-[#0B0B0C] text-[#F2F2F2]"
      }`}
    >
      {/* Subtle vignette background + gold glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div
          className="absolute -top-40 -left-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(closest-side, ${GOLD}22, transparent)`,
          }}
        />
        <div
          className="absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(closest-side, ${GOLD}22, transparent)`,
          }}
        />
      </div>

      <form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Cho phép Enter ở input bước nấu (gắn data-allow-enter)
            const allow = (e.target as HTMLElement)?.closest(
              "[data-allow-enter]"
            );
            if (!allow) e.preventDefault();
          }
        }}
      >
        {/* Header card */}
        <Card className="p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[rgba(232,201,113,0.12)] border border-[rgba(232,201,113,0.25)] grid place-items-center">
                <PencilLine className="w-5 h-5" color={GOLD} />
              </div>
              <div>
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: GOLD }}
                >
                  Publish recipe
                </div>
                <div className="text-sm text-zinc-400">
                  Publish your recipe on your website or share it with the
                  Nutrium community
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-black shadow-lg shadow-[rgba(232,201,113,0.15)] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: GOLD }}
              disabled={isSubmitting || isUploadingImage}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              <span className="font-semibold">Publish</span>
            </motion.button>
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          {/* Left column: cover + basic info */}
          <div className="flex gap-8 flex-shrink-0">
            {/* Cover uploader */}
            <Card className="relative overflow-hidden flex-1">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={
                  imageOptimized
                    ? { backgroundImage: `url(${imageOptimized})` }
                    : undefined
                }
              />
              <div
                className={`absolute inset-0 ${
                  imageOptimized
                    ? "bg-black/50"
                    : "bg-gradient-to-b from-zinc-900/40 to-zinc-900/70"
                }`}
              />

              <div className="relative h-full flex flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  {changeMode ? (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 text-black bg-[rgba(232,201,113,0.9)] border border-[rgba(232,201,113,0.35)] rounded-xl px-2.5 py-1 cursor-pointer backdrop-blur"
                      onClick={() => setChangeMode(false)}
                    >
                      <PencilLine className="w-4 h-4" />
                      <span className="font-medium">My recipes</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 text-[${GOLD}] border border-[rgba(232,201,113,0.35)] rounded-xl px-2.5 py-1 cursor-pointer bg-black/50 backdrop-blur"
                      onClick={() => setChangeMode(true)}
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Community Recipes</span>
                    </motion.div>
                  )}

                  <div className="px-2 py-1 flex items-center gap-3 border rounded-xl border-[rgba(232,201,113,0.25)] bg-black/40 backdrop-blur">
                    <Heart className="h-4" color={GOLD} />
                    <span className="text-zinc-300">0</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 8px 40px rgba(232,201,113,0.35)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleOpenFileDialog}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-black font-medium"
                    style={{ background: GOLD }}
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PencilLine className="w-4 h-4" />
                    )}
                    <span>
                      {imageOptimized ? "Change image" : "Upload image"}
                    </span>
                  </motion.button>
                  {imageError ? (
                    <p className="text-xs text-red-400 bg-black/50 px-2 py-1 rounded">
                      {imageError}
                    </p>
                  ) : null}
                </div>

                <div className="relative">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="inline-flex items-center gap-2 text-[${GOLD}] border border-[rgba(232,201,113,0.35)] rounded-xl px-2.5 py-1 bg-black/40 backdrop-blur cursor-pointer select-none"
                    onDoubleClick={toggleCategoryPicker}
                    title="Double click đe chon category"
                  >
                    <TicketPlus />
                    <span>New category</span>
                  </motion.div>

                  {categoryPickerOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-[#0f0f12] rounded-xl shadow-2xl border border-[rgba(232,201,113,0.25)] max-h-44 overflow-auto z-10"
                    >
                      {Array.isArray(listCategory) &&
                      listCategory.length > 0 ? (
                        listCategory.map((category) => {
                          const checked = selectedCategories.includes(
                            category.id
                          );
                          return (
                            <label
                              key={category.id}
                              className="flex items-center justify-between px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 cursor-pointer"
                            >
                              <span>{category.name}</span>
                              <input
                                type="checkbox"
                                className="accent-[${GOLD}]"
                                checked={checked}
                                onChange={() =>
                                  handleSelectCategory(category.id)
                                }
                              />
                            </label>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-zinc-400">
                          Khong co category nao.
                        </div>
                      )}
                    </motion.div>
                  ) : null}

                  {selectedCategoryEntities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCategoryEntities.map((category) => (
                        <span
                          key={category.id}
                          className="bg-[rgba(232,201,113,0.15)] text-[${GOLD}] text-xs px-2 py-1 rounded-full border border-[rgba(232,201,113,0.35)] inline-flex items-center gap-1"
                        >
                          {category.name}
                          <button
                            type="button"
                            className="hover:opacity-80"
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
            </Card>

            {/* Basic Info */}
            <Card className="p-6 flex-2">
              <SectionTitle
                title="Basic information"
                subtitle="Check and edit recipe's basic information"
              />

              <div className="flex flex-col gap-3">
                {/* Name */}
                <div
                  className={`flex h-[52px] rounded-xl border ${
                    fieldErrors.name ? "border-red-500/70" : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-center w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 text-zinc-200">Name</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                      placeholder="Recipe name"
                      value={formValues.name}
                      onChange={handleInputChange("name")}
                    />
                  </div>
                </div>
                {fieldErrors.name ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.name}
                  </p>
                ) : null}

                {/* Description */}
                <div
                  className={`flex h-[140px] rounded-xl border ${
                    fieldErrors.description
                      ? "border-red-500/70"
                      : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-start w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 py-3 text-zinc-200">Description</div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="h-full w-full px-3 py-3 text-zinc-100 bg-transparent resize-none outline-none placeholder:text-zinc-500"
                      placeholder="Describe your recipe"
                      value={formValues.description}
                      onChange={handleInputChange("description")}
                    />
                  </div>
                </div>
                {fieldErrors.description ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.description}
                  </p>
                ) : null}

                {/* Total time */}
                <div
                  className={`flex h-[52px] rounded-xl border ${
                    fieldErrors.totalTime
                      ? "border-red-500/70"
                      : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-center w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 text-zinc-200">Total time</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                      placeholder="hh:mm"
                      value={formValues.totalTime}
                      onChange={handleInputChange("totalTime")}
                    />
                  </div>
                </div>
                {fieldErrors.totalTime ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.totalTime}
                  </p>
                ) : null}

                {/* Preparation time */}
                <div
                  className={`flex h-[52px] rounded-xl border ${
                    fieldErrors.preparationTime
                      ? "border-red-500/70"
                      : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-center w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 text-zinc-200">Preparation time</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                      placeholder="hh:mm"
                      value={formValues.preparationTime}
                      onChange={handleInputChange("preparationTime")}
                    />
                  </div>
                </div>
                {fieldErrors.preparationTime ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.preparationTime}
                  </p>
                ) : null}

                {/* Final weight */}
                <div
                  className={`flex h-[52px] rounded-xl border ${
                    fieldErrors.finalWeight
                      ? "border-red-500/70"
                      : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-center w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 text-zinc-200">Final weight</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                      placeholder="e.g. 300 grams"
                      value={formValues.finalWeight}
                      onChange={handleInputChange("finalWeight")}
                    />
                  </div>
                </div>
                {fieldErrors.finalWeight ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.finalWeight}
                  </p>
                ) : null}

                {/* Portions */}
                <div
                  className={`flex h-[52px] rounded-xl border ${
                    fieldErrors.portions
                      ? "border-red-500/70"
                      : "border-white/10"
                  } bg-black/40`}
                >
                  <div className="flex items-center w-[200px] border-r border-white/10 bg-white/5 rounded-l-xl">
                    <div className="px-5 text-zinc-200">Portions</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                      placeholder="Number of servings"
                      value={formValues.portions}
                      onChange={handleInputChange("portions")}
                      min={1}
                    />
                  </div>
                </div>
                {fieldErrors.portions ? (
                  <p className="text-xs text-red-400 px-2">
                    {fieldErrors.portions}
                  </p>
                ) : null}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex items-center gap-8">
              {/* Selected ingredients */}
              <Card className="p-6 flex-1">
                <SectionTitle
                  title="Selected ingredients"
                  subtitle="Nguyen lieu ban da them se hien thi tai day"
                />

                {selectedFoods.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl px-4 py-8 text-sm text-zinc-400 text-center">
                    Chua co nguyen lieu nao duoc chon.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 max-h-[320px] overflow-auto pr-2 custom-scroll">
                    {selectedFoods.map((food) => {
                      const macro = macrosMap.get(food.macronutrientsId);
                      return (
                        <motion.div
                          key={food.id}
                          whileHover={{
                            y: -2,
                            boxShadow: "0 12px 40px rgba(232,201,113,0.12)",
                          }}
                          className="border border-white/10 rounded-xl p-4 flex flex-col gap-3 bg-white/[0.02]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4
                                className="text-base font-semibold"
                                style={{ color: GOLD }}
                              >
                                {food.name}
                              </h4>
                              <p className="text-xs text-zinc-400">
                                {food.quantity}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(food.id)}
                              className="text-red-300 hover:text-red-400"
                              title="Xoa nguyen lieu"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                          {macro ? (
                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                              <span>Energy: {macro.energy} kcal</span>
                              <span>Carbs: {macro.carbohydrates} g</span>
                              <span>Protein: {macro.protein} g</span>
                              <span>Fat: {macro.fat} g</span>
                            </div>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Cooking method */}
              <Card className="p-6 flex-1">
                <SectionTitle
                  title="Cooking method"
                  subtitle="Give instructions to prepare this recipe"
                />

                <div className="flex flex-col gap-3">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col gap-1">
                      <div
                        className={`flex h-[52px] rounded-xl border ${
                          stepErrors[step.id]
                            ? "border-red-500/70"
                            : "border-white/10"
                        } bg-black/40`}
                      >
                        <div className="flex items-center min-w-[56px] justify-center text-sm text-zinc-300 border-r border-white/10 bg-white/5 rounded-l-xl">
                          {index + 1}
                        </div>
                        <div className="flex-1 flex items-center">
                          <input
                            data-allow-enter
                            type="text"
                            className="h-full w-full px-3 text-zinc-100 bg-transparent outline-none placeholder:text-zinc-500"
                            placeholder="Add new cooking method"
                            value={step.content}
                            onChange={(event) =>
                              handleStepChange(step.id, event.target.value)
                            }
                            onKeyDown={handleStepKeyDown(step.id)}
                          />
                        </div>
                        <div className="px-2 border-l border-white/10 bg-white/5 rounded-r-xl flex items-center gap-2">
                          <Pencil className="text-[${GOLD}] w-4 h-4" />
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(step.id)}
                            className="text-red-300 hover:text-red-400"
                            title="Xoa buoc"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {stepErrors[step.id] ? (
                        <p className="text-xs text-red-400 px-2">
                          {stepErrors[step.id]}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {cookingError ? (
                  <p className="text-xs text-red-400 mt-2">{cookingError}</p>
                ) : (
                  <p className="text-xs text-zinc-500 mt-2">
                    Enter de them buoc moi sau khi nhap noi dung.
                  </p>
                )}
              </Card>
            </div>

            {/* Ingredients list + search */}
            <Card className="p-0 overflow-hidden">
              <div className="p-6 pb-3">
                <SectionTitle
                  title="Ingredients"
                  subtitle="Search and add ingredients to the recipe"
                />
              </div>

              <div className="flex flex-col border-t border-white/10">
                <div className="flex border-b border-white/10 bg-white/5">
                  <div className="px-4 py-3 flex items-center gap-2 flex-1">
                    <ChevronUp color={GOLD} />
                    <input
                      type="text"
                      className="h-10 flex-1 bg-transparent border border-white/10 rounded-lg px-3 text-zinc-200 placeholder:text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[rgba(232,201,113,0.35)]"
                      placeholder="Search food"
                      value={ingredientSearch}
                      onChange={(event) =>
                        setIngredientSearch(event.target.value)
                      }
                    />
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2 border-l border-white/10 text-zinc-400">
                    <ArrowUpNarrowWide />
                    <span className="text-sm">{foods.length} items</span>
                  </div>
                </div>

                <div>
                  {foodsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin" color={GOLD} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {paginatedFoods.map((food) => {
                        const macro = macrosMap.get(food.macronutrientsId);
                        return (
                          <motion.div
                            key={food.id}
                            whileHover={{
                              y: -2,
                              borderColor: GOLD,
                              boxShadow: "0 10px 40px rgba(232,201,113,0.10)",
                            }}
                            className="border border-white/10 rounded-xl p-4 relative group bg-white/[0.02]"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => handleAddIngredient(food.id)}
                              className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(232,201,113,0.45)] text-[${GOLD}] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Them nguyen lieu"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                            <div className="flex flex-col gap-1 pr-10">
                              <h4
                                className="text-base font-semibold"
                                style={{ color: GOLD }}
                              >
                                {food.name}
                              </h4>
                              <p className="text-xs text-zinc-400">
                                {food.quantity}
                              </p>
                              <p className="text-xs text-zinc-500">
                                Source: {food.source}
                              </p>
                              {macro ? (
                                <div className="flex flex-wrap gap-2 mt-2 text-xs text-zinc-300">
                                  <span>Energy: {macro.energy} kcal</span>
                                  <span>Carbs: {macro.carbohydrates} g</span>
                                  <span>Protein: {macro.protein} g</span>
                                  <span>Fat: {macro.fat.toFixed(1)} g</span>
                                </div>
                              ) : null}
                            </div>
                          </motion.div>
                        );
                      })}
                      {paginatedFoods.length === 0 && !foodsLoading ? (
                        <div className="col-span-full text-center text-sm text-zinc-400 py-10">
                          Khong tim thay thuc pham phu hop.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between text-zinc-300">
                  <div className="text-sm">
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
            </Card>
          </div>

          {/* Sidebar column */}
          <div className="flex-1 flex gap-8 ">
            <div className="flex flex-col gap-8 flex-1">
              {/* Global analysis */}
              <Card className="p-6">
                <SectionTitle
                  title="Global analysis"
                  subtitle="Energy, macronutrients and fiber distribution"
                />

                <div className="border-b border-white/10 flex items-center justify-between text-zinc-300 mb-4 pb-3">
                  <div className="text-sm">Energy</div>
                  <div>
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {aggregatedMacros.energy}
                    </span>{" "}
                    kcal
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center text-xs text-zinc-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full border-4 border-white/10 h-12 w-12 text-zinc-100 grid place-items-center text-sm">
                      {aggregatedMacros.fat} g
                    </div>
                    <div>Fat</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full border-4 border-[rgba(232,201,113,0.65)] h-12 w-12 text-zinc-100 grid place-items-center text-sm">
                      {aggregatedMacros.carbohydrates} g
                    </div>
                    <div>Carbohydrate</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full border-4 border-white/10 h-12 w-12 text-zinc-100 grid place-items-center text-sm">
                      {aggregatedMacros.protein} g
                    </div>
                    <div>Protein</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full border-4 border-white/20 h-12 w-12 text-zinc-100 grid place-items-center text-sm">
                      {selectedFoods.length}
                    </div>
                    <div>Ingredients</div>
                  </div>
                </div>
              </Card>

              {/* Macronutrients chart */}
              <Card className="p-6">
                <SectionTitle
                  title="Macronutrients"
                  subtitle="Ty le macronutrients cua cong thuc"
                />
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
                    <Tooltip
                      contentStyle={{
                        background: SLATE,
                        border: `1px solid ${GOLD_DIM}`,
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#e5e5e5" }} />
                  </PieChart>
                </div>
              </Card>
            </div>

            {/* Latest ingredient micro */}
            <Card className="p-6 flex-2">
              <SectionTitle
                title="Latest ingredient"
                subtitle="Thong tin chi tiet cua nguyen lieu vua them"
              />

              {latestSelectedFood && latestMicro ? (
                <div className="flex flex-col gap-3 text-sm text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {latestSelectedFood.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {latestSelectedFood.quantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {MICRO_FIELD_META.map(({ key, label, unit }) => {
                      const raw = (latestMicro as IMicronutrient)[key];
                      const displayValue =
                        raw === null || raw === undefined || Number.isNaN(raw)
                          ? "-"
                          : raw;
                      return (
                        <span key={key} className="text-zinc-300">
                          <span className="text-zinc-500">{label}:</span>{" "}
                          {displayValue} {unit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-zinc-400 text-center rounded-xl">
                  Chon nguyen lieu de xem thong tin chi tiet tai day.
                </div>
              )}
            </Card>
          </div>
        </div>

        {submitError ? (
          <div className="px-6 py-4 rounded-xl bg-red-900/20 border border-red-800/40 text-red-200 text-sm">
            {submitError}
          </div>
        ) : null}

        {/* Section divider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="px-6 py-4 rounded-2xl mt-2 text-black shadow-[0_10px_50px_rgba(232,201,113,0.25)]"
          style={{ background: GOLD }}
        >
          <span className="text-xl font-semibold">Creation</span>
          <span className="text-sm font-medium ml-2 opacity-80">
            Create the recipe and choose the ingredients
          </span>
        </motion.div>
      </form>
    </div>
  );
}
