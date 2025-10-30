import React, { useState } from "react";
import PolicyItem from "./PolicyItem";
import { clsx } from "clsx";
import { StyledWrapperGold } from "@/pages/auth/ui/StyledWrapper";

interface Props {
  mode: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  checks: {
    length: boolean;
    lower: boolean;
    upper: boolean;
    digit: boolean;
    special: boolean;
  };
  label?: string;
  placeholder: string;
  fieldTheme: string;
  borderClass: string;
  ariaHelpTitle?: string; // e.g. "Yêu cầu mật khẩu"
}

export default function PasswordField({
  mode,
  value,
  onChange,
  error,
  checks,
  placeholder,
  fieldTheme,
  borderClass,
  ariaHelpTitle = "Yêu cầu mật khẩu",
}: Props) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const inner = (
    <div className={clsx(mode ? "box-input relative" : "relative")}>
      <input
        type={show ? "text" : "password"}
        name="password"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoComplete="new-password"
        className={clsx(
          // giống EmailField: nếu mode true dùng class "input ...", nếu false dùng input thường
          mode
            ? "input w-full rounded-xl border text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 px-4 py-3 pr-10"
            : "w-full rounded-xl border px-4 py-3 pr-10 text-sm shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2",
          fieldTheme,
          borderClass
        )}
        aria-invalid={!!error}
        aria-describedby={focused ? "password-help" : undefined}
      />

      {/* Nút show/hide */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShow((s) => !s)}
        className={clsx(
          "absolute right-3 top-1/2 -translate-y-1/2 text-sm focus:outline-none transition-colors duration-200",
          mode ? "text-[#C9C9CF] hover:text-[#F2F2F2]" : "text-slate-400 hover:text-slate-600"
        )}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {show ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        )}
      </button>

      {/* Tooltip rule-check khi focus */}
      {focused && (
        <div
          id="password-help"
          role="status"
          aria-live="polite"
          className={clsx(
            "absolute left-0 right-0 z-10 mt-2 rounded-xl border p-3 text-xs shadow-xl backdrop-blur",
            mode
              ? "border-[rgba(232,201,113,0.28)] bg-[#14161B]/95"
              : "border-green-300/50 bg-white/95"
          )}
        >
          <p className={clsx("mb-2 font-semibold", mode ? "text-[#E8C971]" : "text-green-700")}>
            {ariaHelpTitle}
          </p>
          <ul className={clsx("space-y-1", mode ? "text-[#C9C9CF]" : "text-slate-600")}>
            <PolicyItem ok={checks.length}>Tối thiểu <b>8</b> ký tự</PolicyItem>
            <PolicyItem ok={checks.lower}>Ít nhất 1 chữ thường (a–z)</PolicyItem>
            <PolicyItem ok={checks.upper}>Ít nhất 1 chữ hoa (A–Z)</PolicyItem>
            <PolicyItem ok={checks.digit}>Ít nhất 1 số (0–9)</PolicyItem>
            <PolicyItem ok={checks.special}>Ít nhất 1 ký tự đặc biệt (!@#$%^&*…)</PolicyItem>
          </ul>
        </div>
      )}

      {error && (
        <p
          id="password-error"
          className={clsx("mt-2 text-xs font-medium", mode ? "text-[#B9384F]" : "text-rose-500 ")}
        >
          {error}
        </p>
      )}
    </div>
  );

  // Nếu mode true => bọc StyledWrapperGold, ngược lại render bình thường
  return mode ? <StyledWrapperGold>{inner}</StyledWrapperGold> : inner;
}
