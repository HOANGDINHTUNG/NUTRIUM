import { useAppSelector } from "../../../hook/UseCustomeRedux";

interface FoodRowProps {
  name: string;
  source: string;
  energyKcal: number;
  fatG: number;
  carbG: number;
  proteinG: number;
  onOpen?: () => void; 
}

export default function FoodRow({
  name,
  source,
  energyKcal,
  fatG,
  carbG,
  proteinG,
  onOpen,
}: FoodRowProps) {
  const { mode } = useAppSelector((s) => s.darkMode);

  return (
    <div
      onClick={onOpen}
      className={`w-full border mb-4 cursor-pointer ${
        mode ? "border-[#24262D]" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-6 px-4 sm:px-3 py-3">
        <div className="min-w-0">
          <p
            className={`text-sm sm:text-base truncate ${
              mode ? "text-[#F2F2F2]" : "text-slate-800"
            }`}
          >
            {name}
          </p>
          <p
            className={`text-xs truncate ${
              mode ? "text-[#9AA0A6]" : "text-slate-400"
            }`}
          >
            {source}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 text-right">
          <Metric value={`${energyKcal} kcal`} label="Energy" />
          <Metric value={`${fatG} g`} label="Fat" />
          <Metric value={`${carbG} g`} label="Carbohydrate" />
          <Metric value={`${proteinG} g`} label="Protein" />
        </div>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  const { mode } = useAppSelector((state) => state.darkMode);
  return (
    <div className="w-20 sm:w-24">
      <div
        className={`text-sm text-center sm:text-base font-semibold ${
          mode ? "text-[#F2F2F2]" : "text-slate-700"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-[11px] text-center sm:text-xs ${
          mode ? "text-[#9AA0A6]" : "text-slate-400"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
