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
export default function BasicInfoUi({
  form,
  errors,
  disabled = false,
  onChange,
}: BasicInfoProps) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-2 text-[#E9D9B6]">
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

function Field({ ...props }: FieldProps) {
  const {
    label,
    value,
    placeholder,
    error,
    disabled,
    className,
    onChange,
    inputProps,
  } = props;
  return (
    <label className={clsx("flex flex-col gap-1", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#EBD7A0]/80">
        {label}
      </span>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "rounded-md border bg-[#0f1014] px-3 py-2 text-sm text-[#F7F3E9] shadow-sm",
          "placeholder:text-[#E9D9B6]/35",
          "focus:outline-none focus:ring-2 focus:ring-[#F6D06F] focus:border-transparent",
          error ? "border-[#ffb4b4] bg-[#2a1b1b]" : "border-[#F6D06F26]",
          disabled && "cursor-not-allowed opacity-70"
        )}
        {...inputProps}
      />
      {error ? (
        <span className="text-xs font-medium text-[#FFBDBD]">{error}</span>
      ) : null}
    </label>
  );
}
