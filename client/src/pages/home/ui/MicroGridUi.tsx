import { clsx } from "clsx";
import {
  MICRONUTRIENT_ITEMS,
  type MicroForm,
  type MicroKey,
  type MicroUnit,
} from "../components/micronutrientFields";

type MicroGridProps = {
  form: MicroForm;
  errors: Partial<Record<MicroKey, string>>;
  onChange: (key: MicroKey, value: string) => void;
  disabled?: boolean;
};

export default function MicroGridUi({
  form,
  errors,
  onChange,
  disabled = false,
}: MicroGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-[#E9D9B6]">
      {MICRONUTRIENT_ITEMS.map((item) => (
        <MicroRow
          key={item.key}
          label={item.label}
          unit={item.unit}
          value={form[item.key]}
          error={errors[item.key]}
          disabled={disabled}
          onChange={(value) => onChange(item.key, value)}
        />
      ))}
    </div>
  );
}

function MicroRow({
  label,
  value,
  unit,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: string;
  unit: MicroUnit;
  error?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-[2fr_1.8fr_3rem] rounded-lg overflow-hidden",
        "min-h-11 transition border bg-[#0f1014]/80 backdrop-blur-[1px]",
        "shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:shadow-[0_16px_48px_rgba(0,0,0,.45)]",
        error ? "border-[#ffb4b4]" : "border-[#F6D06F29]"
      )}
    >
      <span className="bg-[#151720] text-sm text-[#EBD7A0] flex items-center px-3 py-2 whitespace-normal break-words border-r border-[#F6D06F1F]">
        {label}
      </span>
      <input
        type="number"
        step="any"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={clsx(
          "w-full text-sm text-[#F7F3E9] px-3 py-2 bg-transparent",
          "focus:outline-none focus:ring-2 focus:ring-[#F6D06F]",
          error && "bg-[#2a1b1b]",
          disabled && "cursor-not-allowed opacity-70",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
      />
      <span className="bg-[#151720] text-sm text-[#EBD7A0] flex items-center justify-center px-3 py-2 border-l border-[#F6D06F1F]">
        {unit}
      </span>
    </div>
  );
}
