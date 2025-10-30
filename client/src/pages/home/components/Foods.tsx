import { useEffect, useMemo, useState } from "react";
import { ArrowUpNarrowWide } from "lucide-react";

import Pagination from "./Pagination";
import FoodRow from "./FoodRow";
import FoodInformation, { type FoodFormSubmitPayload } from "./FoodInformation";
import AlertToast from "../../auth/features/components/login/AlertToast";

import { icon_add_food } from "../../../export/exportImage";
import { useAppDispatch, useAppSelector } from "../../../hook/UseCustomeRedux";
import { getAllFoods } from "../../../api/Food.api";
import { getAllMacronutrients } from "../../../api/Macronutrient.api";
import { getAllMicronutrients } from "../../../api/Micronutrient.api";
import { axiosInstance } from "../../../utils/axiosInstance";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { IFood } from "../../../utils/interface/Foods";
import FoodInformationUi from "../ui/FoodInformationUi";
import { VideoText } from "@/components/ui/video-text";

type ToastState = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
} | null;

const PAGE_SIZE = 10;

export default function Foods() {
  const { mode } = useAppSelector((state) => state.darkMode);
  const { listFoods, loading, error } = useAppSelector((state) => state.food);
  const { listMacronutrients } = useAppSelector((state) => state.macronutrient);
  const { listMicronutrients } = useAppSelector((state) => state.micronutrient);
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("edit");
  const [selectedFoodId, setSelectedFoodId] = useState<number | string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [alert, setAlert] = useState<ToastState>(null);

  // --- Category combobox state ---
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCatSuggest, setShowCatSuggest] = useState(false);

  const [sortKey, setSortKey] = useState<
    "" | "energy" | "fat" | "carbohydrates" | "protein"
  >("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey, sortDir]);

  useEffect(() => {
    dispatch(getAllFoods());
    dispatch(getAllMacronutrients());
    dispatch(getAllMicronutrients());
  }, [dispatch]);

  const macroById = useMemo(() => {
    const map = new Map<number | string, IMacronutrient>();
    listMacronutrients.forEach((item) => map.set(item.id, item));
    return map;
  }, [listMacronutrients]);

  const microById = useMemo(() => {
    const map = new Map<number | string, IMicronutrient>();
    listMicronutrients.forEach((item) => map.set(item.id, item));
    return map;
  }, [listMicronutrients]);

  const filteredFoods = useMemo(() => {
    const byName = !query.trim()
      ? listFoods
      : listFoods.filter((food) =>
          food.name?.toLowerCase().includes(query.toLowerCase())
        );

    if (selectedCategories.length === 0) return byName;

    // so khớp category không phân biệt hoa/thường
    const selectedNorm = selectedCategories.map((c) => c.trim().toLowerCase());

    return byName.filter((food) =>
      food.category?.some((c) => selectedNorm.includes(c.trim().toLowerCase()))
    );
  }, [listFoods, query, selectedCategories]);

  const collectUniqueCategories = (foods: IFood[]): string[] => {
    const categorySet = new Set<string>();

    foods.forEach((food) => {
      food.category.forEach((cat) => categorySet.add(cat));
    });

    return Array.from(categorySet);
  };

  const allCategories = useMemo(() => {
    return collectUniqueCategories(listFoods).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [listFoods]);

  const categorySuggestions = useMemo(() => {
    const q = categoryInput.trim().toLowerCase();
    const base = q
      ? allCategories.filter(
          (c) =>
            c.toLowerCase().startsWith(q) && !selectedCategories.includes(c)
        )
      : allCategories.filter((c) => !selectedCategories.includes(c));

    // giới hạn 8 gợi ý cho gọn (sửa đúng theo comment)
    return base.slice(0, 8);
  }, [allCategories, categoryInput, selectedCategories]);

  const sortedFoods = useMemo(() => {
    const base = filteredFoods.slice(); // tránh mutate
    if (!sortKey) return base;

    const getVal = (food: IFood) => {
      const macro = macroById.get(food.macronutrientsId);
      const v = macro?.[sortKey] as number | undefined;
      if (typeof v === "number" && Number.isFinite(v)) return v;
      // thiếu dữ liệu => đẩy xuống cuối trong cả 2 chiều
      return sortDir === "asc"
        ? Number.POSITIVE_INFINITY
        : Number.NEGATIVE_INFINITY;
    };

    base.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      return sortDir === "asc" ? va - vb : vb - va;
    });

    return base;
  }, [filteredFoods, sortKey, sortDir, macroById]);

  const totalPages = Math.max(
    1,
    Math.ceil((sortedFoods?.length ?? 0) / PAGE_SIZE)
  );

  const pagedSortedFoods = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedFoods.slice(start, start + PAGE_SIZE);
  }, [sortedFoods, currentPage]);

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const selectedFood = useMemo(() => {
    if (selectedFoodId == null) return undefined;
    return listFoods.find((food) => food.id === selectedFoodId);
  }, [selectedFoodId, listFoods]);

  const selectedMacro = useMemo(() => {
    if (!selectedFood) return undefined;
    return macroById.get(selectedFood.macronutrientsId);
  }, [selectedFood, macroById]);

  const selectedMicro = useMemo(() => {
    if (!selectedFood) return undefined;
    return microById.get(selectedFood.micronutrientsId);
  }, [selectedFood, microById]);

  const handleOpenForm = (foodId: number | string) => {
    setFormMode("edit");
    setFormError(null);
    setSelectedFoodId(foodId);
    setIsOpenModal(true);
  };

  const handleCreateFood = () => {
    setFormMode("create");
    setFormError(null);
    setSelectedFoodId(null);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setFormError(null);
    setIsSaving(false);
    setSelectedFoodId(null);
  };

  const handleSaveForm = async (payload: FoodFormSubmitPayload) => {
    setFormError(null);
    setIsSaving(true);
    try {
      if (payload.mode === "edit") {
        let macronutrientId =
          payload.macro.id ?? payload.food.macronutrientsId ?? null;
        if (macronutrientId) {
          await axiosInstance.patch(`macronutrients/${macronutrientId}`, {
            energy: payload.macro.energy,
            carbohydrates: payload.macro.carbohydrates,
            fat: payload.macro.fat,
            protein: payload.macro.protein,
          });
        } else {
          const macroResponse = await axiosInstance.post("macronutrients", {
            energy: payload.macro.energy,
            carbohydrates: payload.macro.carbohydrates,
            fat: payload.macro.fat,
            protein: payload.macro.protein,
          });
          macronutrientId = macroResponse.data?.id ?? null;
        }

        const { id: microIdFromPayload, ...microBody } = payload.micro;
        let micronutrientId =
          microIdFromPayload ?? payload.food.micronutrientsId ?? null;
        if (micronutrientId) {
          await axiosInstance.patch(
            `micronutrients/${micronutrientId}`,
            microBody
          );
        } else {
          const microResponse = await axiosInstance.post(
            "micronutrients",
            microBody
          );
          micronutrientId = microResponse.data?.id ?? null;
        }

        if (payload.food.id == null) {
          throw new Error("Missing food identifier for update");
        }
        if (macronutrientId == null || micronutrientId == null) {
          throw new Error("Failed to update nutrient information");
        }

        await axiosInstance.patch(`foods/${payload.food.id}`, {
          name: payload.food.name,
          source: payload.food.source,
          category: payload.food.category,
          quantity: payload.food.quantity,
          macronutrientsId: macronutrientId,
          micronutrientsId: micronutrientId,
        });

        setAlert({
          type: "success",
          message: "Food updated successfully",
        });
      } else {
        const macroResponse = await axiosInstance.post("macronutrients", {
          energy: payload.macro.energy,
          carbohydrates: payload.macro.carbohydrates,
          fat: payload.macro.fat,
          protein: payload.macro.protein,
        });

        const microBody = { ...payload.micro };
        delete microBody.id;
        const microResponse = await axiosInstance.post(
          "micronutrients",
          microBody
        );

        const macronutrientsId = macroResponse.data?.id;
        const micronutrientsId = microResponse.data?.id;

        if (macronutrientsId == null || micronutrientsId == null) {
          throw new Error("Failed to create nutrient information");
        }

        await axiosInstance.post("foods", {
          name: payload.food.name,
          source: payload.food.source,
          category: payload.food.category,
          quantity: payload.food.quantity,
          macronutrientsId,
          micronutrientsId,
        });

        setAlert({
          type: "success",
          message: "Food created successfully",
        });
      }

      await Promise.all([
        dispatch(getAllFoods()),
        dispatch(getAllMacronutrients()),
        dispatch(getAllMicronutrients()),
      ]);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save food";
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = (cat: string) => {
    if (!selectedCategories.includes(cat)) {
      setSelectedCategories((prev) => [...prev, cat]);
    }
    setCategoryInput("");
    setShowCatSuggest(false);
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const onCategoryInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (categorySuggestions.length > 0) {
        addCategory(categorySuggestions[0]); // chọn gợi ý đầu tiên khi Enter
      } else if (categoryInput.trim()) {
        // nếu không có gợi ý nhưng có text -> thêm text như category mới (tùy ý)
        addCategory(categoryInput.trim());
      }
    } else if (e.key === "Backspace" && categoryInput === "") {
      // Backspace khi input trống -> xóa chip cuối
      setSelectedCategories((prev) => prev.slice(0, -1));
    }
  };

  return (
    <>
      <AlertToast mode={mode} alert={alert} onClose={() => setAlert(null)} />
      <div
        className={`h-full py-6 px-4 transition-colors duration-300 ${
          mode ? "bg-[#0B0B0C] text-[#F2F2F2]" : "bg-gray-200 text-black"
        }`}
      >
        <div
          className={`flex flex-col rounded-lg p-4 shadow-sm transition-colors duration-300 ${
            mode ? "bg-[#111216] text-[#F2F2F2]" : "bg-white/95"
          }`}
        >
          {mode ? (
            <div className="relative h-[80px] w-[250px] overflow-hidden">
              <VideoText
                src="https://res.cloudinary.com/di8ege413/video/upload/v1761828263/3214486-uhd_3840_2160_25fps_nrtkcj.mp4"
                fontSize={29}
              >
                FOODS
              </VideoText>
            </div>
          ) : (
            <div
              className={`text-2xl font-light ${
                mode ? "text-[#E8C971]" : "text-slate-800"
              }`}
            >
              Foods
            </div>
          )}
          {mode ? (
            <div className={`mb-4 text-lg text-yellow-500`}>
              Search, check and create new foods
            </div>
          ) : (
            <div
              className={`mb-4 text-sm font-light ${
                mode ? "text-[#C9C9CF]" : "text-slate-500"
              }`}
            >
              Search, check and create new foods
            </div>
          )}

          <div className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Search food"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`flex-4 border px-3 py-2 text-sm transition-colors placeholder:text-sm ${
                mode
                  ? "border-[#24262D] bg-black text-[#d3a50c] placeholder-[#7C828C] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.28)] rounded-lg"
                  : "text-slate-700 border-slate-200 bg-white placeholder:text-slate-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300/60"
              }`}
            />

            <div
              className={`flex flex-1 overflow-hidden border transition-colors rounded-lg duration-300 ${
                mode ? "border-[#24262D]" : "border-slate-200"
              }`}
            >
              {/* nút đảo chiều */}
              <button
                type="button"
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
                className={`flex items-center justify-center border-r px-2 ${
                  mode
                    ? "border-[#2E3139] text-[#C9C9CF] hover:bg-[#14161B] bg-black"
                    : "border-slate-200 text-slate-600 hover:bg-gray-50"
                }`}
                title={`Sắp xếp: ${
                  sortDir === "asc" ? "Tăng dần" : "Giảm dần"
                }`}
                aria-label="Toggle sort direction"
                disabled={!sortKey}
              >
                <ArrowUpNarrowWide
                  className={`h-[18px] w-[18px] transition-transform ${
                    mode
                      ? sortDir
                        ? "text-[#D4AF37]"
                        : ""
                      : sortDir
                      ? "text-[#08ba46]"
                      : ""
                  } ${sortDir === "desc" ? "rotate-180" : ""} ${
                    !sortKey ? "text-gray-600" : ""
                  }`}
                />
              </button>

              {/* chọn tiêu chí */}
              <select
                name="sort"
                id="sort"
                value={sortKey}
                onChange={(e) => {
                  const k = e.target.value as typeof sortKey;
                  setSortKey(k);
                  // reset về asc khi đổi tiêu chí
                  setSortDir("asc");
                }}
                className={`flex-1  px-2 text-xs outline-none transition-colors duration-300 appearance-none ${
                  mode ? "text-[#d3a50c] bg-black" : "text-slate-600"
                }`}
              >
                <option value="">Sort by nutrient</option>
                <option value="energy">Energy (kcal)</option>
                <option value="fat">Fat (g)</option>
                <option value="carbohydrates">Carbohydrate (g)</option>
                <option value="protein">Protein (g)</option>
              </select>
            </div>

            {/* Category combobox (typeahead multi-select) */}
            <div className="relative flex-1">
              <div
                className={`flex min-h-[40px] bg-black rounded-lg items-center gap-2 flex-wrap border px-2 py-1 text-sm transition-colors duration-300 ${
                  mode
                    ? "border-[#24262D] bg-black text-[#d3a50c] focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[rgba(212,175,55,0.25)]"
                    : "border-slate-200 bg-white text-slate-700 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-300/60"
                }`}
                onClick={() => {
                  setShowCatSuggest(true);
                }}
              >
                {/* Chips đã chọn */}
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                      mode
                        ? "bg-[rgba(232,201,113,0.12)] text-[#E8C971]"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCategory(cat);
                      }}
                      className={`rounded-full leading-none px-1 ${
                        mode
                          ? "hover:bg-[rgba(232,201,113,0.2)]"
                          : "hover:bg-emerald-100"
                      }`}
                      aria-label={`Remove ${cat}`}
                      title="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Input nhập để gợi ý */}
                <input
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value);
                    setShowCatSuggest(true);
                  }}
                  onKeyDown={onCategoryInputKeyDown}
                  onFocus={() => setShowCatSuggest(true)}
                  onBlur={() => {
                    // delay chút để kịp click gợi ý
                    setTimeout(() => setShowCatSuggest(false), 120);
                  }}
                  placeholder={
                    selectedCategories.length
                      ? "Thêm category..."
                      : "Category (gõ để gợi ý)"
                  }
                  className={`flex-1 min-w-[140px] bg-transparent outline-none placeholder:opacity-60 ${
                    mode ? "text-[#F2F2F2]" : "text-slate-700"
                  }`}
                />

                {/* mũi tên giả để giống select (tùy thích) */}
                <span
                  className={`ml-auto pointer-events-none ${
                    mode ? "text-[#9AA0A6]" : "text-slate-500"
                  }`}
                >
                  ▼
                </span>
              </div>

              {/* List gợi ý */}
              {showCatSuggest && categorySuggestions.length > 0 && (
                <ul
                  className={`absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded border text-sm shadow-lg ${
                    mode
                      ? "border-[#24262D] bg-[#14161B] text-[#F2F2F2]"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {categorySuggestions.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        className={`w-full text-left px-3 py-2  ${
                          mode ? "hover:bg-[#111216] text-[#d3a50c]" : "hover:bg-gray-100"
                        }`}
                        onMouseDown={(e) => e.preventDefault()} // để blur không đóng trước khi onClick
                        onClick={() => addCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {loading && <div className="py-8 text-sm opacity-70">Loading...</div>}
          {error && <div className="py-8 text-sm text-red-500">{error}</div>}

          {!loading && !error && pagedSortedFoods.length === 0 && (
            <div className="py-8 text-sm opacity-70">No foods found.</div>
          )}

          {!loading &&
            !error &&
            pagedSortedFoods.map((food) => {
              const macro = macroById.get(food.macronutrientsId);
              return (
                <FoodRow
                  key={food.id}
                  name={food.name ?? "Unknown"}
                  source={food.source ?? "Unknown"}
                  energyKcal={macro?.energy ?? 0}
                  fatG={macro?.fat ?? 0}
                  carbG={macro?.carbohydrates ?? 0}
                  proteinG={macro?.protein ?? 0}
                  onOpen={() => handleOpenForm(food.id)}
                />
              );
            })}

          <div
            onClick={handleCreateFood}
            className={`flex gap-2 items-center border p-3 cursor-pointer rounded-md transition ${
              mode
                ? "border-[rgba(232,201,113,0.3)] hover:bg-[rgba(232,201,113,0.08)]"
                : "border-slate-200 hover:bg-gray-50"
            }`}
          >
            <img src={icon_add_food} alt="icon" />
            <span>Create food</span>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      </div>

      {mode ? (
        <FoodInformationUi
          mode={formMode}
          isOpenModal={isOpenModal}
          food={formMode === "edit" ? selectedFood : undefined}
          macro={formMode === "edit" ? selectedMacro : undefined}
          micro={formMode === "edit" ? selectedMicro : undefined}
          isSaving={isSaving}
          submitError={formError}
          onClose={closeModal}
          onCancel={closeModal}
          onSave={handleSaveForm}
        />
      ) : (
        <FoodInformation
          mode={formMode}
          isOpenModal={isOpenModal}
          food={formMode === "edit" ? selectedFood : undefined}
          macro={formMode === "edit" ? selectedMacro : undefined}
          micro={formMode === "edit" ? selectedMicro : undefined}
          isSaving={isSaving}
          submitError={formError}
          onClose={closeModal}
          onCancel={closeModal}
          onSave={handleSaveForm}
        />
      )}
    </>
  );
}
