import { ArrowLeft, Home, Leaf, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import LetterGlitch from "../ui/LetterGlitch";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-emerald-900 px-6 py-16 text-white">
      <LetterGlitch
        className="absolute inset-0"
        contentClassName="absolute inset-0 z-10 flex items-center justify-center"
        glitchColors={["#2b4539", "#61dca3", "#61b3dc", "#d4af37"]} // thêm vàng luxury
        glitchSpeed={45}
        smooth
        outerVignette
      >
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-20 h-72 w-72 animate-pulse rounded-full bg-emerald-400/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 animate-[spin_28s_linear_infinite] rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-10 h-64 w-64 animate-[ping_4s_ease-in-out_infinite] rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-36 w-36 animate-spin rounded-full border border-emerald-300/30" />
        </div>

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <span className="absolute inset-0 -skew-y-3 rounded-3xl bg-emerald-400/20 blur-2xl" />
              <div className="relative flex items-center gap-6 rounded-3xl bg-white/10 px-8 py-5 backdrop-blur-lg">
                <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-4 shadow-2xl">
                  <span className="block text-6xl font-bold tracking-tight text-emerald-200 drop-shadow-lg sm:text-7xl">
                    404
                  </span>
                </div>
                <div className="flex flex-col items-start text-left">
                  <p className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-emerald-100">
                    <Sparkles className="h-4 w-4" />
                    Nourish your journey
                  </p>
                  <h1 className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-sky-200 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
                    The page you are looking for is not on the menu yet.
                  </h1>
                  <p className="mt-2 max-w-lg text-left text-base text-slate-200/80 sm:text-lg">
                    It seems you have stepped into a fresh green corner. Head
                    back to keep discovering nourishing insights that energize
                    your day.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Leaf className="h-8 w-8 text-emerald-200 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                <p className="mt-3 text-sm font-medium text-emerald-50/80">
                  Stay on a vibrant lifestyle filled with nutrient-dense
                  ingredients.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Sparkles className="h-8 w-8 text-sky-200 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
                <p className="mt-3 text-sm font-medium text-emerald-50/80">
                  Discover uplifting recipes that nourish both body and mind.
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Home className="h-8 w-8 text-cyan-200 transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-110" />
                <p className="mt-3 text-sm font-medium text-emerald-50/80">
                  Return to the dashboard and keep growing your nutrition
                  journey.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 rounded-full border border-emerald-400/60 bg-emerald-500/80 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              Go Back
            </button>
            <button
              onClick={() => navigate(ROUTES.MAINPAGE)}
              className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Floating nutrition particles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-12 top-20 h-2 w-2 animate-ping rounded-full bg-emerald-200/70" />
          <div className="absolute right-16 top-36 h-3 w-3 animate-bounce rounded-full bg-cyan-200/70" />
          <div className="absolute bottom-24 right-24 h-2 w-2 animate-pulse rounded-full bg-sky-200/60" />
          <div className="absolute bottom-16 left-32 h-3 w-3 animate-bounce rounded-full bg-teal-200/70" />
        </div>
      </LetterGlitch>
    </div>
  );
}
