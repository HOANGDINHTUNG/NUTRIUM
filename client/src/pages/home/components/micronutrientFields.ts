import type { IMicronutrient } from "../../../utils/interface/Micronutrients";

export type MicroUnit = "mg" | "ug" | "g";

type ItemDescriptor<K extends keyof IMicronutrient = keyof IMicronutrient> = {
  key: K;
  label: string;
  unit: MicroUnit;
};

export const MICRONUTRIENT_ITEMS = [
  { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  { key: "fiber", label: "Fiber", unit: "g" },
  { key: "sodium", label: "Sodium", unit: "mg" },
  { key: "water", label: "Water", unit: "g" },
  { key: "vitaminA", label: "Vitamin A", unit: "ug" },
  { key: "vitaminB6", label: "Vitamin B-6", unit: "mg" },
  { key: "vitaminB12", label: "Vitamin B-12", unit: "ug" },
  { key: "vitaminC", label: "Vitamin C", unit: "mg" },
  { key: "vitaminD", label: "Vitamin D (D2 + D3)", unit: "ug" },
  { key: "vitaminE", label: "Vitamin E", unit: "mg" },
  { key: "vitaminK", label: "Vitamin K", unit: "ug" },
  { key: "starch", label: "Starch", unit: "g" },
  { key: "lactose", label: "Lactose", unit: "g" },
  { key: "alcohol", label: "Alcohol", unit: "g" },
  { key: "caffeine", label: "Caffeine", unit: "mg" },
  { key: "sugars", label: "Sugars", unit: "g" },
  { key: "calcium", label: "Calcium", unit: "mg" },
  { key: "iron", label: "Iron", unit: "mg" },
  { key: "magnesium", label: "Magnesium", unit: "mg" },
  { key: "phosphorus", label: "Phosphorus", unit: "mg" },
  { key: "potassium", label: "Potassium", unit: "mg" },
  { key: "zinc", label: "Zinc", unit: "mg" },
  { key: "copper", label: "Copper", unit: "mg" },
  { key: "fluoride", label: "Fluoride", unit: "ug" },
  { key: "manganese", label: "Manganese", unit: "mg" },
  { key: "selenium", label: "Selenium", unit: "ug" },
  { key: "thiamin", label: "Thiamin", unit: "mg" },
  { key: "riboflavin", label: "Riboflavin", unit: "mg" },
  { key: "niacin", label: "Niacin", unit: "mg" },
  { key: "pantothenicAcid", label: "Pantothenic acid", unit: "mg" },
  { key: "folateTotal", label: "Folate, total", unit: "ug" },
  { key: "folicAcid", label: "Folic acid", unit: "ug" },
  { key: "fattyAcidsTotalTrans", label: "Fatty acids, total trans", unit: "g" },
  {
    key: "fattyAcidsTotalSaturated",
    label: "Fatty acids, total saturated",
    unit: "g",
  },
  {
    key: "fattyAcidsTotalMonounsaturated",
    label: "Fatty acids, total monounsaturated",
    unit: "g",
  },
  {
    key: "fattyAcidsTotalPolyunsaturated",
    label: "Fatty acids, total polyunsaturated",
    unit: "g",
  },
  { key: "chloride", label: "Chloride", unit: "mg" },
] as const satisfies ReadonlyArray<ItemDescriptor>;

export type MicronutrientItem = (typeof MICRONUTRIENT_ITEMS)[number];
export type MicroKey = MicronutrientItem["key"];
export type MicroForm = Record<MicroKey, string>;
