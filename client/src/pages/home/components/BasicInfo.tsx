import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export type BasicInfoForm = {
  name: string;
  source: string;
  category: string;
  quantity: string;
};

type BasicInfoProps = {
  form: BasicInfoForm;
  errors: Partial<Record<keyof BasicInfoForm, string>>;
  disabled?: boolean;
  onChange: (field: keyof BasicInfoForm, value: string) => void;
};

export default function BasicInfo({
  form,
  errors,
  disabled = false,
  onChange,
}: BasicInfoProps) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-10 text-gray-600">
      <Field
        label="Name"
        value={form.name}
        placeholder="Enter food name"
        disabled={disabled}
        error={errors.name}
        onChange={(value) => onChange("name", value)}
        className="col-span-12 lg:col-span-7"
      />

      <Field
        label="Source"
        value={form.source}
        placeholder="Data source (e.g. USDA)"
        disabled={disabled}
        error={errors.source}
        onChange={(value) => onChange("source", value)}
        className="col-span-12 lg:col-span-5"
      />

      <Field
        label="Category"
        value={form.category}
        placeholder="Comma separated categories"
        disabled={disabled}
        error={errors.category}
        onChange={(value) => onChange("category", value)}
        className="col-span-12 lg:col-span-7"
      />

      <Field
        label="Quantity"
        value={form.quantity}
        placeholder="e.g. 100 g"
        disabled={disabled}
        error={errors.quantity}
        onChange={(value) => onChange("quantity", value)}
        className="col-span-12 lg:col-span-5"
      />
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  onChange: (value: string) => void;
};

function Field({
  label,
  value,
  placeholder,
  error,
  disabled,
  className,
  onChange,
  inputProps,
}: FieldProps) {
  return (
    <label className={clsx("flex flex-col gap-1", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={clsx(
          "rounded-md border bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent",
          error ? "border-red-400 bg-red-50" : "border-gray-200",
          disabled && "cursor-not-allowed opacity-70"
        )}
        {...inputProps}
      />
      {error ? (
        <span className="text-xs font-medium text-red-500">{error}</span>
      ) : null}
    </label>
  );
}
