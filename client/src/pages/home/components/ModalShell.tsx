import type { PropsWithChildren } from "react";


type ModalShellProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalShell({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalShellProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center z-10"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
