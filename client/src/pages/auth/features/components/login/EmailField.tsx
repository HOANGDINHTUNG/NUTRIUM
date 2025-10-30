import { StyledWrapperGold } from "@/pages/auth/ui/StyledWrapper";
import React from "react";

type Props = {
  mode: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  themeField: string;
  borderClass: string;
};

export default function EmailField({
  mode,
  value,
  onChange,
  placeholder,
  error,
  themeField,
  borderClass,
}: Props) {
  const inputElement = (
    <div className={`${mode ? "box-input" : ""}`}>
      <input
        type="email"
        name="email"
        autoComplete="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input w-full rounded-xl border text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 px-4 py-3 ${themeField} ${borderClass}`}
        aria-invalid={!!error}
        aria-describedby={error ? "email-error" : undefined}
      />
      {error && (
        <p
          id="email-error"
          className={`mt-2 text-xs font-medium ${
            mode ? "text-[#B9384F]" : "text-rose-500 "
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );

  return mode ? (
    <StyledWrapperGold>{inputElement}</StyledWrapperGold>
  ) : (
    inputElement
  );
}
