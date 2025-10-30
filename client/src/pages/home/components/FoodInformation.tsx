import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { IFood } from "../../../utils/interface/Foods";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";

import ModalShell from "./ModalShell";
import SectionTitle from "./SectionTitle";
import BasicInfo, { type BasicInfoForm } from "./BasicInfo";
import MacroGrid, { type MacroForm } from "./MacroGrid";
import MicroGrid from "./MicroGrid";
import {
  MICRONUTRIENT_ITEMS,
  type MicroForm,
  type MicroKey,
} from "./micronutrientFields";

export type FoodFormSubmitPayload = {
  mode: "create" | "edit";
  food: {
    id?: number;
    name: string;
    source: string;
    category: string[];
    quantity: string;
    macronutrientsId?: number;
    micronutrientsId?: number;
  };
  macro: {
    id?: number;
    energy: number;
    carbohydrates: number;
    fat: number;
    protein: number;
  };
  micro: {
    id?: number;
  } & Record<MicroKey, number | null>;
};

type FormErrors = {
  basic: Partial<Record<keyof BasicInfoForm, string>>;
  macro: Partial<Record<keyof MacroForm, string>>;
  micro: Partial<Record<MicroKey, string>>;
};

interface Props {
  mode: "create" | "edit";
  food?: IFood;
  macro?: IMacronutrient;
  micro?: IMicronutrient;
  isOpenModal: boolean;
  isSaving?: boolean;
  submitError?: string | null;
  onCancel: () => void;
  onClose: () => void;
  onSave: (payload: FoodFormSubmitPayload) => Promise<void> | void;
}

const createEmptyBasicForm = (): BasicInfoForm => ({
  name: "",
  source: "",
  category: "",
  quantity: "",
});

const createEmptyMacroForm = (): MacroForm => ({
  energy: "",
  carbohydrates: "",
  fat: "",
  protein: "",
});

const createEmptyMicroForm = (): MicroForm => {
  const next = {} as MicroForm;
  MICRONUTRIENT_ITEMS.forEach((item) => {
    next[item.key] = "";
  });
  return next;
};

const createEmptyErrors = (): FormErrors => ({
  basic: {},
  macro: {},
  micro: {},
});

export default function FoodInformation({
  mode,
  food,
  macro,
  micro,
  isOpenModal,
  isSaving = false,
  submitError,
  onCancel,
  onClose,
  onSave,
}: Props) {
  const [basicForm, setBasicForm] = useState<BasicInfoForm>(() =>
    createEmptyBasicForm()
  );
  const [macroForm, setMacroForm] = useState<MacroForm>(() =>
    createEmptyMacroForm()
  );
  const [microForm, setMicroForm] = useState<MicroForm>(() =>
    createEmptyMicroForm()
  );
  const [errors, setErrors] = useState<FormErrors>(() => createEmptyErrors());

  useEffect(() => {
    if (!isOpenModal) return;

    setBasicForm({
      name: food?.name ?? "",
      source: food?.source ?? "",
      category: Array.isArray(food?.category)
        ? food?.category.join(", ")
        : food?.category ?? "",
      quantity: food?.quantity ?? "",
    });

    setMacroForm({
      energy:
        macro?.energy !== undefined && macro?.energy !== null
          ? String(macro.energy)
          : "",
      carbohydrates:
        macro?.carbohydrates !== undefined && macro?.carbohydrates !== null
          ? String(macro.carbohydrates)
          : "",
      fat:
        macro?.fat !== undefined && macro?.fat !== null ? String(macro.fat) : "",
      protein:
        macro?.protein !== undefined && macro?.protein !== null
          ? String(macro.protein)
          : "",
    });

    setMicroForm(() => {
      const next = createEmptyMicroForm();
      if (micro) {
        MICRONUTRIENT_ITEMS.forEach((item) => {
          const value = micro[item.key];
          if (value !== undefined && value !== null) {
            next[item.key] = String(value);
          }
        });
      }
      return next;
    });

    setErrors(createEmptyErrors());
  }, [food, macro, micro, mode, isOpenModal]);

  const handleBasicChange = (field: keyof BasicInfoForm, value: string) => {
    setBasicForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      basic: { ...prev.basic, [field]: undefined },
    }));
  };

  const handleMacroChange = (field: keyof MacroForm, value: string) => {
    setMacroForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      macro: { ...prev.macro, [field]: undefined },
    }));
  };

  const handleMicroChange = (key: MicroKey, value: string) => {
    setMicroForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      micro: { ...prev.micro, [key]: undefined },
    }));
  };

  const validate = () => {
    const nextErrors = createEmptyErrors();

    if (!basicForm.name.trim()) {
      nextErrors.basic.name = "Required";
    }
    if (!basicForm.source.trim()) {
      nextErrors.basic.source = "Required";
    }
    if (!basicForm.category.trim()) {
      nextErrors.basic.category = "Required";
    }
    if (!basicForm.quantity.trim()) {
      nextErrors.basic.quantity = "Required";
    }

    (["energy", "carbohydrates", "fat", "protein"] as Array<
      keyof MacroForm
    >).forEach((field) => {
      const value = macroForm[field].trim();
      if (!value) {
        nextErrors.macro[field] = "Required";
        return;
      }
      if (Number.isNaN(Number(value))) {
        nextErrors.macro[field] = "Invalid number";
      }
    });

    MICRONUTRIENT_ITEMS.forEach((item) => {
      const value = microForm[item.key].trim();
      if (value && Number.isNaN(Number(value))) {
        nextErrors.micro[item.key] = "Invalid number";
      }
    });

    setErrors(nextErrors);

    const hasErrors =
      Object.values(nextErrors.basic).some(Boolean) ||
      Object.values(nextErrors.macro).some(Boolean) ||
      Object.values(nextErrors.micro).some(Boolean);

    return !hasErrors;
  };

  const buildPayload = (): FoodFormSubmitPayload => {
    const category = basicForm.category
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const macroPayload: FoodFormSubmitPayload["macro"] = {
      id: macro?.id,
      energy: Number(macroForm.energy),
      carbohydrates: Number(macroForm.carbohydrates),
      fat: Number(macroForm.fat),
      protein: Number(macroForm.protein),
    };

    const microPayload = MICRONUTRIENT_ITEMS.reduce(
      (acc, item) => {
        const raw = microForm[item.key].trim();
        acc[item.key] = raw === "" ? null : Number(raw);
        return acc;
      },
      { id: micro?.id } as FoodFormSubmitPayload["micro"]
    );

    return {
      mode,
      food: {
        id: food?.id,
        name: basicForm.name.trim(),
        source: basicForm.source.trim(),
        category,
        quantity: basicForm.quantity.trim(),
        macronutrientsId: macro?.id,
        micronutrientsId: micro?.id,
      },
      macro: macroPayload,
      micro: microPayload,
    };
  };

  const handleSubmit = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (!validate()) return;
    await onSave(buildPayload());
  };

  const title =
    mode === "create" ? "Create new food" : "Food information";
  const subtitle =
    mode === "create"
      ? "Fill in the details for the new food item"
      : "Check and update the information about the food";

  return (
    <ModalShell isOpen={isOpenModal} onClose={onClose}>
      <form className="p-8" onSubmit={handleSubmit}>
        <div className="pb-4 mb-6">
          <h1 className="text-3xl text-gray-700 text-center mb-2 font-semibold">
            {title}
          </h1>
          <p className="text-gray-500 text-center text-sm">{subtitle}</p>
        </div>

        {submitError ? (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        ) : null}
        <BasicInfo
          form={basicForm}
          errors={errors.basic}
          disabled={isSaving}
          onChange={handleBasicChange}
        />

        <SectionTitle>Macronutrients</SectionTitle>
        <MacroGrid
          form={macroForm}
          errors={errors.macro}
          disabled={isSaving}
          onChange={handleMacroChange}
        />

        <SectionTitle>Micronutrients</SectionTitle>
        <MicroGrid
          form={microForm}
          errors={errors.micro}
          disabled={isSaving}
          onChange={handleMicroChange}
        />

        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving
              ? "Saving..."
              : mode === "create"
              ? "Create food"
              : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
