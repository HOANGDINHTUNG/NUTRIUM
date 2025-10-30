import { clsx } from "clsx";
import {
  MICRONUTRIENT_ITEMS,
  type MicroForm,
  type MicroKey,
  type MicroUnit,
} from "./micronutrientFields";

type MicroGridProps = {
  form: MicroForm;
  errors: Partial<Record<MicroKey, string>>;
  onChange: (key: MicroKey, value: string) => void;
  disabled?: boolean;
};

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
  onChange: (value: string) => void;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-[2fr_1.8fr_3rem] rounded-lg border bg-white shadow-sm overflow-hidden",
        "min-h-11",
        error ? "border-red-400" : "border-gray-200"
      )}
    >
      {/* label */}
      <span
        className={clsx(
          "bg-gray-100 text-sm text-gray-700",
          "flex items-center px-3 py-2",
          "whitespace-normal break-words"
        )}
      >
        {label}
      </span>

      {/* input */}
      <input
        type="number"
        step="any"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={clsx(
          "w-full text-sm text-gray-900 px-3 py-2",
          "focus:outline-none focus:ring-2 focus:ring-teal-400",
          error && "bg-red-50",
          disabled && "cursor-not-allowed opacity-70",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
      />

      {/* unit */}
      <span className="bg-gray-100 text-sm text-gray-500 flex items-center justify-center px-3 py-2">
        {unit}
      </span>
    </div>
  );
}

export default function MicroGrid({
  form,
  errors,
  onChange,
  disabled = false,
}: MicroGridProps) {
  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-gray-600">
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
