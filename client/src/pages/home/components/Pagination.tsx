import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // số trang hiển thị hai bên current (mặc định 1)
  boundaryCount?: number; // số trang hiển thị ở hai đầu (mặc định 1)
  className?: string;
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: Required<
  Pick<
    PaginationProps,
    "currentPage" | "totalPages" | "siblingCount" | "boundaryCount"
  >
>) {
  const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2; // first,last,current + siblings + boundaries
  //   const totalBlocks = totalNumbers + 2; // with two ellipses

  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 1);
  const rightSibling = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount
  );

  const showLeftEllipsis = leftSibling > boundaryCount + 2;
  const showRightEllipsis = rightSibling < totalPages - boundaryCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = boundaryCount + 2 + siblingCount * 2;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, "ellipsis", ...endPages];
  } else if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = boundaryCount + 2 + siblingCount * 2;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [...startPages, "ellipsis", ...rightRange];
  } else {
    return [
      ...startPages,
      "ellipsis",
      ...range(leftSibling, rightSibling),
      "ellipsis",
      ...endPages,
    ];
  }
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationProps) {
  const { mode } = useAppSelector((state) => state.darkMode);
  if (totalPages <= 1) return null;

  const items = getPaginationRange({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <nav
      className={`flex items-center justify-end gap-1 select-none`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => go(currentPage - 1)}
        className={`inline-flex items-center gap-1 rounded-lg border  px-3 py-2 text-sm  transition-colors  disabled:pointer-events-none disabled:opacity-40  ${
          mode
            ? "border-[#24262D] bg-[#14161B] text-[#C9C9CF] hover:bg-[#1A1D23]"
            : "border-slate-200 text-slate-600 hover:bg-slate-100"
        }`}
        aria-label="Previous page"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Pages */}
      <ul className="flex items-center gap-1">
        {items.map((it, idx) => {
          if (it === "ellipsis") {
            return (
              <li
                key={`e-${idx}`}
                className={`p-2   ${
                  mode ? "text-[#9AA0A6]" : "text-slate-500"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </li>
            );
          }
          const page = it as number;
          const active = page === currentPage;
          return (
            <li key={page}>
              <button
                onClick={() => go(page)}
                aria-current={active ? "page" : undefined}
                className={`min-w-9 h-9 px-3 rounded-lg text-sm transition-all shadow
                  ${
                    active
                      ? mode
                        ? "bg-[#D4AF37] text-[#1C1C1E] shadow-luxury"
                        : "bg-emerald-500 text-white "
                      : `border ${
                          mode
                            ? "border-[#24262D] text-[#C9C9CF] hover:bg-[#14161B]"
                            : "border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`
                  }`}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Next */}
      <button
        onClick={() => go(currentPage + 1)}
        className={`inline-flex items-center gap-1 rounded-lg border  px-3 py-2 text-sm  transition-colors  disabled:pointer-events-none disabled:opacity-40  ${
          mode
            ? "border-[#24262D] bg-[#14161B] text-[#C9C9CF] hover:bg-[#1A1D23]"
            : "border-slate-200 hover:bg-slate-100 text-slate-600"
        }`}
        aria-label="Next page"
        disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
