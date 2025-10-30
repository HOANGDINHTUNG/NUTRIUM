import { RouterProvider } from "react-router-dom";
import FloatingUtilityWidget from "./components/ui/FloatingUtilityWidget";
import { routers } from "./routers";
import clsx from "clsx";
import { useAppSelector } from "./hook/UseCustomeRedux";
function App() {
  const { mode } = useAppSelector((s) => s.darkMode);
  return (
    <div
      className={clsx(
        "min-h-screen  transition-colors duration-300 ",
        mode
          ? "bg-slate-950 text-slate-100"
          : "bg-white text-slate-900"
      )}
    >
      <RouterProvider router={routers} />
      <FloatingUtilityWidget />
    </div>
  );
}

export default App;
