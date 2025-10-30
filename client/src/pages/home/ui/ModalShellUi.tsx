import type { PropsWithChildren } from "react";

type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function ModalShellUi({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalShellProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop sang trọng */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,.75),rgba(0,0,0,.85))]" />
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* container */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div
          className="relative bg-[#0d0f14]/90 text-[#F7F3E9]
                        rounded-3xl border border-[#F6D06F3d]
                        shadow-[0_50px_140px_rgba(0,0,0,.6)]
                        max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-10 w-10 rounded-full
                       bg-black/30 border border-[#F6D06F33]
                       text-[#EBD7A0] text-2xl leading-none
                       hover:bg-black/45 transition
                       flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>

          {/* scroll area */}
          <div className="overflow-y-auto max-h-[90vh]">{children}</div>
        </div>
      </div>
    </div>
  );
}
