export const fieldTheme = (isDark: boolean) =>
  isDark
    ? "bg-[#14161B] text-[#F2F2F2] placeholder-[#7C828C]"
    : "bg-white/80 text-slate-800 placeholder-slate-400";

export const fieldBorder = (isDark: boolean, hasError?: boolean) => {
  if (hasError) {
    return isDark
      ? "border-[#B9384F] focus:ring-[#B9384F]/70"
      : "border-rose-400 focus:border-rose-400 focus:ring-rose-400/60";
  }
  return isDark
    ? "border-[#24262D] focus:border-[#D4AF37] focus:ring-[rgba(212,175,55,0.28)]"
    : "border-slate-200/70 focus:border-gray-400/60 focus:ring-gray-400/60";
};
