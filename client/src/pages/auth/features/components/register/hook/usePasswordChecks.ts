import { useMemo } from "react";

export function usePasswordChecks(password: string) {
  return useMemo(() => {
    const pwd = password || "";
    const checks = {
      length: pwd.length >= 8,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    } as const;

    const isStrong =
      checks.length &&
      checks.lower &&
      checks.upper &&
      checks.digit &&
      checks.special;

    return { checks, isStrong };
  }, [password]);
}
