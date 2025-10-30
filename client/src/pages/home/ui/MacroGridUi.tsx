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
export default function MacroGridUi({
  form,
  errors,
  disabled = false,
  onChange,
}: MacroGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[#E9D9B6]">
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
        "flex items-stretch rounded-lg overflow-hidden transition",
        "border bg-[#0f1014]/80 backdrop-blur-[1px]",
        "shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:shadow-[0_16px_48px_rgba(0,0,0,.45)]",
        error ? "border-[#ffb4b4]" : "border-[#F6D06F29]"
      )}
    >
      <span className="px-3 py-2 bg-[#151720] flex-1 text-sm text-[#E9D9B6] flex items-center border-r border-[#F6D06F1F]">
        {label}
      </span>
      <input
        type="number"
        step="any"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "px-3 py-2 flex-[1.8] text-sm text-[#F7F3E9] bg-transparent",
          "focus:outline-none focus:ring-2 focus:ring-[#F6D06F]",
          error && "bg-[#2a1b1b]",
          disabled && "cursor-not-allowed opacity-70"
        )}
      />
      <span className="px-3 py-2 bg-[#151720] w-12 flex items-center justify-center text-sm text-[#EBD7A0] border-l border-[#F6D06F1F]">
        {unit}
      </span>
    </div>
  );
}
