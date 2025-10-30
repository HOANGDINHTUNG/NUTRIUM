import { Alert } from "antd";
import type { AlertKind } from "./types";

interface Props {
  mode: boolean;
  alert: AlertKind | null;
  onClose: () => void;
}

export default function AlertToast({ mode, alert, onClose }: Props) {
  if (!alert) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <Alert
        className={`min-w-[260px] rounded-2xl border shadow-xl ${
          mode
            ? "border-[rgba(232,201,113,0.25)] bg-[#14161B]/95 text-[#F2F2F2]"
            : "border-slate-200/80 bg-white/95 text-slate-700"
        }`}
        message={alert.message}
        description={alert.description}
        type={alert.type}
        showIcon
        closable
        onClose={onClose}
      />
    </div>
  );
}
