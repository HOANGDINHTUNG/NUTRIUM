import React from "react";
import PasswordField from "./PasswordField";
import type { FormData, FormErrors } from "./types";
import { clsx } from "clsx";
import { StyledWrapperGold } from "@/pages/auth/ui/StyledWrapper";

interface Props {
  mode: boolean;
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errors: FormErrors;
  passwordChecks: {
    length: boolean;
    lower: boolean;
    upper: boolean;
    digit: boolean;
    special: boolean;
  };
  fieldTheme: string;
  borders: { email: string; username: string; password: string };
  copy: {
    emailPlaceholder: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
  };
}

export default function RegisterForm({
  mode,
  formData,
  onChange,
  onSubmit,
  isLoading,
  errors,
  passwordChecks,
  fieldTheme,
  borders,
  copy,
}: Props) {
  // Email element (2 chế độ)
  const emailEl = mode ? (
    <StyledWrapperGold>
      <div className="box-input">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder={copy.emailPlaceholder}
          autoComplete="email"
          className={clsx(
            "input w-full rounded-xl border text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 px-4 py-3",
            fieldTheme,
            borders.email
          )}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            className={clsx(
              "mt-2 text-xs font-medium",
              mode ? "text-[#B9384F]" : "text-rose-500 "
            )}
          >
            {errors.email}
          </p>
        )}
      </div>
    </StyledWrapperGold>
  ) : (
    <div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder={copy.emailPlaceholder}
        autoComplete="email"
        className={clsx(
          "w-full rounded-xl border px-4 py-3 text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2",
          fieldTheme,
          borders.email
        )}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && (
        <p
          id="email-error"
          className={clsx(
            "mt-2 text-xs font-medium",
            mode ? "text-[#B9384F]" : "text-rose-500 "
          )}
        >
          {errors.email}
        </p>
      )}
    </div>
  );

  // Username element (2 chế độ)
  const usernameEl = mode ? (
    <StyledWrapperGold>
      <div className="box-input">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder={copy.usernamePlaceholder}
          autoComplete="username"
          className={clsx(
            "input w-full rounded-xl border text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 px-4 py-3",
            fieldTheme,
            borders.username
          )}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p
            id="username-error"
            className={clsx(
              "mt-2 text-xs font-medium",
              mode ? "text-[#B9384F]" : "text-rose-500 "
            )}
          >
            {errors.username}
          </p>
        )}
      </div>
    </StyledWrapperGold>
  ) : (
    <div>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        placeholder={copy.usernamePlaceholder}
        autoComplete="username"
        className={clsx(
          "w-full rounded-xl border px-4 py-3 text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2",
          fieldTheme,
          borders.username
        )}
        aria-invalid={!!errors.username}
        aria-describedby={errors.username ? "username-error" : undefined}
      />
      {errors.username && (
        <p
          id="username-error"
          className={clsx(
            "mt-2 text-xs font-medium",
            mode ? "text-[#B9384F]" : "text-rose-500 "
          )}
        >
          {errors.username}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Email */}
      {emailEl}

      {/* Username */}
      {usernameEl}

      {/* Password: giao cho component tự xử lý 2 chế độ */}
      <PasswordField
        mode={mode}
        value={formData.password}
        onChange={onChange}
        error={errors.password}
        checks={passwordChecks}
        placeholder={copy.passwordPlaceholder}
        fieldTheme={fieldTheme}
        borderClass={borders.password}
      />

      {/* Submit */}
      <div className={clsx(mode ? "flex items-center justify-center" : "")}>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:shadow-none ${
            mode
              ? "bg-[#D4AF37] text-[#1C1C1E] hover:bg-[#B88A1B] shadow-luxury w-30"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-emerald-200/50 disabled:bg-blue-400 w-full"
          }`}
        >
          {isLoading ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
}
