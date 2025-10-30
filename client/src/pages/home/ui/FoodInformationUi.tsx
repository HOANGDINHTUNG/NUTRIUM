import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { IFood } from "../../../utils/interface/Foods";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";

import {
  MICRONUTRIENT_ITEMS,
  type MicroForm,
  type MicroKey,
} from "../components/micronutrientFields";
import type { BasicInfoForm } from "./BasicInfoUi";
import type { MacroForm } from "./MacroGridUi";
import ModalShellUi from "./ModalShellUi";
import SectionTitleUi from "./SectionTitleUi";
import BasicInfoUi from "./BasicInfoUi";
import MacroGridUi from "./MacroGridUi";
import MicroGridUi from "./MicroGridUi";

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

export default function FoodInformationUi({
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
        macro?.fat !== undefined && macro?.fat !== null
          ? String(macro.fat)
          : "",
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

    (
      ["energy", "carbohydrates", "fat", "protein"] as Array<keyof MacroForm>
    ).forEach((field) => {
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

  const title = mode === "create" ? "Create new food" : "Food information";
  const subtitle =
    mode === "create"
      ? "Fill in the details for the new food item"
      : "Check and update the information about the food";

  return (
    <ModalShellUi isOpen={isOpenModal} onClose={onClose}>
      <form
        className="p-8 bg-[linear-gradient(140deg,#0f0f12_0%,#13141a_55%,#0c0d11_100%)]"
        onSubmit={handleSubmit}
      >
        {/* header */}
        <div className="pb-6 mb-8 border-b border-[#F6D06F1A]">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-wide
                           bg-gradient-to-br from-[#EBD7A0] via-[#C9A85D] to-[#8A6B2E]
                           bg-clip-text text-transparent
                           drop-shadow-[0_4px_12px_rgba(201,168,93,.25)]"
            >
              {title}
            </h1>
            <p className="text-sm md:text-base text-[#E9D9B6]/80">{subtitle}</p>
          </div>
        </div>

        {/* error */}
        {submitError ? (
          <div className="mb-6 rounded-xl border border-[#ffb4b4]/30 bg-[#3a1f1f]/40 px-4 py-3 text-sm text-[#ffd7d7] shadow-[0_10px_30px_rgba(0,0,0,.35)]">
            {submitError}
          </div>
        ) : null}

        {/* sections */}
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="rounded-2xl border border-[#F6D06F29] bg-white/5 backdrop-blur-sm p-6 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            <SectionTitleUi>Basic information</SectionTitleUi>
            <BasicInfoUi
              form={basicForm}
              errors={errors.basic}
              disabled={isSaving}
              onChange={handleBasicChange}
            />
          </div>

          <div className="rounded-2xl border border-[#F6D06F29] bg-white/5 backdrop-blur-sm p-6 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            <SectionTitleUi>Macronutrients</SectionTitleUi>
            <div className="text-center text-[#EBD7A0] font-medium border border-[#F6D06F29] py-3 mb-6 rounded-lg bg-[#0f1014]/60">
              Nutritional value per 100 g
            </div>
            <MacroGridUi
              form={macroForm}
              errors={errors.macro}
              disabled={isSaving}
              onChange={handleMacroChange}
            />
          </div>

          <div className="rounded-2xl border border-[#F6D06F29] bg-white/5 backdrop-blur-sm p-6 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            <SectionTitleUi>Micronutrients</SectionTitleUi>
            <MicroGridUi
              form={microForm}
              errors={errors.micro}
              disabled={isSaving}
              onChange={handleMicroChange}
            />
          </div>
        </div>

        {/* actions */}
        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-[#F6D06F1A]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-[#E9D9B6]/80 hover:text-[#F6D06F]
                       bg-transparent border border-[#F6D06F29]
                       hover:border-[#F6D06F66]
                       transition shadow-[0_6px_20px_rgba(0,0,0,.35)]"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 rounded-md
                       bg-gradient-to-br from-[#F7D57A] via-[#F1C862] to-[#B88931]
                       text-[#2D1B07] font-semibold
                       hover:brightness-105 active:brightness-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6D06F]
                       focus:ring-offset-[#0f1014]
                       disabled:cursor-not-allowed disabled:opacity-70
                       shadow-[0_16px_40px_rgba(246,208,111,.25)]"
          >
            {isSaving
              ? "Saving..."
              : mode === "create"
              ? "Create food"
              : "Save changes"}
          </button>
        </div>
      </form>
    </ModalShellUi>
  );
}
