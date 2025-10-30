  import { Navigate, Outlet } from "react-router-dom";
  import BentoGallery3D from "../ui/BentoGallery";
  import { useAppSelector } from "../../../hook/UseCustomeRedux";
  import clsx from "clsx";
  import { bg_form } from "../../../export/exportImage";
  import ClickSpark from "@/components/ui/ClickSpark";
  import SplashCursor from "@/components/ui/SplashCursor";

  export default function AuthLayout() {
    const isAuthenticated = false;
    const { mode } = useAppSelector((state) => state.darkMode);
    const Wrapper = mode ? ClickSpark : "div";
    return (
      <Wrapper
        {...(mode
          ? {
              sparkColor: "#efd421",
              sparkSize: 23,
              sparkRadius: 70,
              sparkCount: 15,
              duration: 1000,
            }
          : {})}
      >
        {mode ? <SplashCursor /> : ""}
        {isAuthenticated ? (
          <Navigate to="/" />
        ) : (
          <div
            className={clsx(
              "flex min-h-screen items-stretch bg-gradient-to-br  transition-colors duration-500 ",
              mode
                ? "from-[#0B0B0C] via-[#111216] to-[#0B0B0C]"
                : "from-slate-100 via-white to-emerald-50"
            )}
          >
            {/* Left side - Form */}
            <section
              className={`flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-10  backdrop-blur-xl transition-colors duration-500 ${
                mode ? "bg-[#111216]/80" : "bg-white"
              }`}
            >
              <Outlet />
            </section>

            {/* Right side - Image */}
            <div
              className={clsx(
                "relative hidden xl:flex lg:w-[45%] items-center justify-center overflow-hidden bg-gradient-to-br  transition-colors duration-500 ",
                mode
                  ? "from-[#111216] via-[#14161B] to-[#0B0B0C]"
                  : "from-emerald-200/60 via-emerald-100/30 to-emerald-50/20"
              )}
            >
              {mode ? (
                <BentoGallery3D />
              ) : (
                <img src={bg_form} height={"h-full"} />
              )}
              <div
                className={clsx(
                  "pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/0 ",
                  mode ? "to-[#0B0B0C]/70" : "to-white/40"
                )}
              />
            </div>
          </div>
        )}
      </Wrapper>
    );
  }
