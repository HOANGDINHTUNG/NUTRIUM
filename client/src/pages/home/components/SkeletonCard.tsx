import { useAppSelector } from "../../../hook/UseCustomeRedux";
import clsx from "clsx";
export default function SkeletonCard() {
  const { mode } = useAppSelector((s) => s.darkMode);
  return (
    <div className="m-auto max-w-2xl overflow-hidden rounded-lg shadow-lg animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image skeleton (16:9) */}
        <div className="relative md:w-2/5">
          <div
            className={clsx(
              "relative w-full pt-[56.25%]",
              mode ? "bg-[#14161B]" : "bg-slate-200"
            )}
          />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-4">
            <div
              className={clsx(
                "mb-2 h-5 w-2/3 rounded",
                mode ? "bg-[#14161B]" : "bg-slate-200"
              )}
            />
            <div
              className={clsx(
                "h-4 w-1/2 rounded",
                mode ? "bg-[#14161B]" : "bg-slate-200"
              )}
            />
          </div>

          <div className="mb-4">
            <div
              className={clsx(
                "h-6 w-1/3 rounded-full",
                mode ? "bg-[#14161B]" : "bg-slate-200"
              )}
            />
          </div>

          <div
            className={clsx(
              "grid grid-cols-6 gap-2 border-t pt-3",
              mode ? "border-[#24262D]" : "border-slate-200"
            )}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={clsx(
                    "h-3 w-14 rounded",
                    mode ? "bg-[#14161B]" : "bg-slate-200"
                  )}
                />
                <div
                  className={clsx(
                    "h-4 w-14 rounded",
                    mode ? "bg-[#14161B]" : "bg-slate-200"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
