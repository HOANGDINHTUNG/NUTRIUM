import React from "react";
import { useAppSelector } from "../../../../../hook/UseCustomeRedux";

export default function PolicyItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  const { mode } = useAppSelector((s) => s.darkMode);
  return (
    <li
      className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
        ok
          ? `line-through ${
              mode ? "text-[#E8C971]" : "text-emerald-600"
            }`
          : `${mode ? "text-[#C9C9CF]" : "text-slate-600"}`
      }`}
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 items-center justify-center"
      >
        {ok ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M16.707 5.293a1 1 0 010 1.414l-7.778 7.778a1 1 0 01-1.414 0L3.293 11.96a1 1 0 011.414-1.414l3.102 3.101 7.071-7.071a1 1 0 011.414 0z" />
          </svg>
        ) : (
          <svg viewBox="0 0 8 8" className="h-2 w-2" fill="currentColor">
            <circle cx="4" cy="4" r="4" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </li>
  );
}
