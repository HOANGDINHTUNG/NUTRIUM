export default function Titlebar({
  mode,
  isActive,
}: {
  mode: boolean;
  isActive: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-5 border-t  shadow-lg backdrop-blur-sm transition-colors duration-300  ${
        mode
          ? "border-[#24262D] bg-[#14161B]/90"
          : "border-slate-200 bg-white/90"
      }`}
    >
      <div className="transition-all duration-300">
        <h2
          className={`text-3xl font-light   ${
            mode ? "text-[#F2F2F2]" : "text-slate-800"
          }`}
        >
          {isActive ? "Food databases" : "Recipes"}
        </h2>
        <p
          className={`text-sm   ${mode ? "text-[#C9C9CF]" : "text-slate-500"}`}
        >
          {isActive
            ? "Create, check and update foods that you can use on meal plans"
            : "Create, check and update recipes"}
        </p>
      </div>
    </div>
  );
}
