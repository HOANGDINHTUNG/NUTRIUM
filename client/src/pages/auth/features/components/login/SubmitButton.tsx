import Magnet from "../../../../../components/ui/Magnet";
import { StyledWrapper3 } from "../../../ui/StyledWrapper";
import React from "react";

type Props = {
  mode: boolean;
  disabled: boolean;
  text: string;
  submittingText: string;
};

export default function SubmitButton({
  mode,
  disabled,
  text,
  submittingText,
}: Props) {
  // Bọc ngoài: chỉ dùng StyledWrapper3 khi mode = true, còn lại dùng Fragment
  const OuterWrapper = mode ? StyledWrapper3 : React.Fragment;
  // Bọc trong: chỉ dùng Magnet khi mode = true, còn lại dùng Fragment
  const InnerWrapper: React.ElementType = mode ? Magnet : React.Fragment;

  const btnClass =
    mode
      ? "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:shadow-none cursor-pointer btn bg-[#D4AF37] text-[#1C1C1E] hover:bg-[#B88A1B] shadow-luxury w-30"
      : "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:shadow-none cursor-pointer btn bg-blue-500 text-white hover:bg-blue-600 hover:shadow-emerald-200/50 disabled:bg-blue-400";

  return (
    <OuterWrapper>
      <div className="flex items-center justify-center">
        <InnerWrapper
          {...(mode
            ? { padding: 100, disabled: false, magnetStrength: 2 }
            : {})}
        >
          <button type="submit" disabled={disabled} className={btnClass}>
            {disabled ? submittingText : text}
          </button>
        </InnerWrapper>
      </div>
    </OuterWrapper>
  );
}
