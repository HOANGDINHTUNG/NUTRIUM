import { clsx } from "clsx";

export type MacroForm = {
  energy: string;
  fat: string;
  carbohydrates: string;
  protein: string;
};

type MacroGridProps = {
  form: MacroForm;
  errors: Partial<Record<keyof MacroForm, string>>;
  disabled?: boolean;
  onChange: (field: keyof MacroForm, value: string) => void;
};

const ROWS: Array<{
  key: keyof MacroForm;
  label: string;
  unit: string;
}> = [
  { key: "energy", label: "Energy", unit: "kcal" },
  { key: "fat", label: "Fat", unit: "g" },
  { key: "carbohydrates", label: "Carbohydrate", unit: "g" },
  { key: "protein", label: "Protein", unit: "g" },
];

export default function MacroGrid({
  form,
  errors,
  disabled = false,
  onChange,
}: MacroGridProps) {
  return (
    <div className="mb-10">
      <div className="text-center text-teal-500 font-medium border border-gray-300 py-3 mb-6 rounded-md bg-teal-50/40">
        Nutritional value per 100 g
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-600">
        {ROWS.map((row) => (
          <MacroInputRow
            key={row.key}
            label={row.label}
            unit={row.unit}
            value={form[row.key]}
            error={errors[row.key]}
            disabled={disabled}
            onChange={(value) => onChange(row.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

type MacroInputRowProps = {
  label: string;
  value: string;
  unit: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function MacroInputRow({
  label,
  value,
  unit,
  error,
  disabled,
  onChange,
}: MacroInputRowProps) {
  return (
    <div
      className={clsx(
        "flex items-stretch rounded-lg border bg-white shadow-sm overflow-hidden",
        error ? "border-red-400" : "border-gray-200"
      )}
    >
      <span className="px-3 py-2 bg-gray-100 flex-1 text-sm text-gray-700 flex items-center">
        {label}
      </span>
      <input
        type="number"
        step="any"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={clsx(
          "px-3 py-2 flex-[1.8] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400",
          error && "bg-red-50",
          disabled && "cursor-not-allowed opacity-70"
        )}
      />
      <span className="px-3 py-2 bg-gray-100 w-12 flex items-center justify-center text-sm text-gray-500">
        {unit}
      </span>
    </div>
  );
}
