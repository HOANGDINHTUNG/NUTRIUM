import {
  Heart,
  TicketPlus,
  Users,
  ChefHat,
  Clock,
  Weight,
  UtensilsCrossed,
} from "lucide-react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLocation } from "react-router-dom";
import type {
  IRecipe,
  RecipeIngredient,
} from "../../../utils/interface/Recipes";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { IFood } from "../../../utils/interface/Foods";
import {
  useMemo,
  useRef,
  useCallback,
  useState,
  type CSSProperties,
} from "react";

type NavState = {
  recipe: IRecipe;
  macronutrients: IMacronutrient;
  micronutrients: IMicronutrient;
  categoryNames: string[];
  ingredients: RecipeIngredient[];
  foods: IFood[];
};

export default function DetailRecipeUi() {
  const { mode } = useAppSelector((state) => state.darkMode);
  const location = useLocation();
  const {
    recipe,
    macronutrients,
    categoryNames,
    micronutrients,
    ingredients,
    foods,
  } = (location.state as NavState) || ({} as NavState);

  const hasRequiredData = Boolean(recipe && macronutrients && micronutrients);

  const chart = useMemo(
    () => [
      { name: "Fat", value: macronutrients?.fat ?? 0 },
      { name: "Carbohydrate", value: macronutrients?.carbohydrates ?? 0 },
      { name: "Protein", value: macronutrients?.protein ?? 0 },
    ],
    [macronutrients]
  );

  // Gradients cho Recharts
  const COLORS = ["url(#fatGrad)", "url(#carbGrad)", "url(#protGrad)"];

  const formatIngredient = (item: RecipeIngredient, foodsArr: IFood[]) => {
    const food = foodsArr.find((f) => f.id === item.foodId);
    const foodName = food?.name || "Unknown";
    const note = item.note ? `, ${item.note}` : "";
    const grams = item.grams ? ` (${item.grams} g)` : "";
    return `${item.quantity} ${item.unit} of ${foodName}${note}${grams}`;
  };

  // ---------- UI helpers ----------
  const panelClass = mode
    ? "bg-[#14161B] border border-[#24262D] text-[#F2F2F2] shadow-[0_6px_30px_rgba(212,175,55,0.35),0_0_12px_rgba(232,201,113,0.25)]"
    : "bg-white/90 border border-gray-200 text-slate-700 shadow-[0_10px_25px_rgba(2,6,23,.08)]";
  const titleClass = mode ? "text-[#E8C971]" : "text-slate-900";
  const subTitleClass = mode ? "text-[#C9C9CF]" : "text-slate-500";
  const rowBorder = mode ? "border-[#24262D]" : "border-gray-200";
  const rowLabel = mode
    ? "bg-[#111216] text-[#E8C971]"
    : "bg-gray-100 text-slate-700";
  const listItemClass = mode
    ? "p-3 text-sm font-medium text-[#F2F2F2] border border-[#24262D] bg-[#14161B] hover:bg-[#1A1D23] transition-all rounded-lg hover:scale-[1.015] hover:shadow-[0_12px_28px_rgba(212,175,55,.25)]"
    : "p-3 text-sm font-medium text-slate-700 border border-gray-200 hover:bg-gray-100 transition-all rounded-lg hover:scale-[1.015]";
  const listEmptyClass = mode
    ? "p-3 text-sm text-[#9AA0A6] italic"
    : "p-3 text-sm text-gray-500 italic";

  // ---------- Hero: spotlight + 3D tilt ----------
  const heroRef = useRef<HTMLDivElement>(null);
  const [hoveringHero, setHoveringHero] = useState(false);
  const onHeroMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--rx", `${-py * 6}deg`);
    el.style.setProperty("--ry", `${px * 6}deg`);
  }, []);
  const onHeroLeave = useCallback(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    setHoveringHero(false);
  }, []);

  if (!hasRequiredData) {
    return (
      <div
        className={`min-h-screen grid place-items-center px-6 py-10 ${
          mode ? "bg-[#0B0B0C] text-[#F2F2F2]" : "bg-gray-100 text-slate-800"
        }`}
      >
        <div
          className={`rounded-2xl p-8 text-center max-w-lg ${
            mode
              ? "bg-[#14161B] border border-[#24262D] text-[#F2F2F2] "
              : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">Recipe not found</h2>
          <p className="text-sm opacity-75">
            Vui lòng mở chi tiết từ trang danh sách để truyền đầy đủ dữ liệu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen py-8 px-4 md:px-6 lg:px-8 transition-colors duration-300 ${
        mode ? "bg-[#0B0B0C] text-[#F2F2F2]" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Keyframes + utility classes */}
      <style>{`
        @keyframes aurora {
          0% { transform: translate3d(-10%, -10%, 0) rotate(0deg); }
          50% { transform: translate3d(10%, 5%, 0) rotate(180deg); }
          100% { transform: translate3d(-10%, -10%, 0) rotate(360deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shine {
          0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          20% { opacity: .35; }
          100% { transform: translateX(120%) skewX(-12deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 18px rgba(212,175,55,.30); }  /* vàng nhạt */
          50% { box-shadow: 0 0 34px rgba(212,175,55,.60); }  /* vàng đậm */
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(.94); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes twinkle {
          0%,100% { opacity: .15; transform: scale(.9) translateY(0) }
          50% { opacity: .95; transform: scale(1.1) translateY(-2px) }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.4s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-scale-in { animation: scale-in .5s ease-out forwards; }
        .hover-lift { transition: all .3s cubic-bezier(.4,0,.2,1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,.22); }
        .gradient-border { position: relative; border: 2px solid transparent; background-clip: padding-box; }
        .gradient-border::before {
          content: ""; position: absolute; inset: -2px; border-radius: inherit; padding: 2px;
          background: conic-gradient(from 180deg, #8b5cf6, #22d3ee, #f59e0b, #38bdf8, #8b5cf6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }
        .sparkle {
          position: absolute; border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,.2) 40%, transparent 60%);
          animation: twinkle 2.6s ease-in-out infinite;
          filter: drop-shadow(0 0 6px rgba(255,255,255,.45));
        }
        @media (prefers-reduced-motion: reduce) {
          .prm-stop { animation: none !important; transition: none !important; }
        }
        /* Glass effect theo theme */
        .glass-effect {
          backdrop-filter: blur(12px) saturate(180%);
          background: ${mode ? "rgba(11,12,14,.72)" : "rgba(255,255,255,.72)"};
          border: 1px solid ${mode ? "rgba(36,38,45,.45)" : "rgba(0,0,0,.06)"};
        }
      `}</style>

      {/* Animated aurora background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full blur-3xl opacity-30 prm-stop"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,.25), transparent)",
            animation: "aurora 24s linear infinite",
          }}
        />
        <div
          className="absolute bottom-[-10rem] right-[-8rem] h-[36rem] w-[36rem] rounded-full blur-3xl opacity-25 prm-stop"
          style={{
            background:
              "radial-gradient(closest-side, rgba(34,211,238,.25), transparent)",
            animation: "aurora 28s linear infinite reverse",
          }}
        />
      </div>

      {/* HERO + QUICK STATS */}
      <div className="animate-scale-in">
        {/* HERO */}
        <div
          ref={heroRef}
          className={[
            "relative mb-6 overflow-hidden rounded-3xl group gradient-border",
            "transition-all duration-500 will-change-transform",
            "shadow-[0_30px_80px_-20px_rgba(0,0,0,.45)]",
          ].join(" ")}
          onMouseMove={onHeroMove}
          onMouseEnter={() => setHoveringHero(true)}
          onMouseLeave={onHeroLeave}
          style={
            {
              height: "420px",
              transform:
                "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
            } as CSSProperties
          }
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={recipe?.coverSrc ?? undefined}
              alt={recipe?.name || "Recipe"}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
            />
            {/* Gradient overlays */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,8,16,.84), rgba(5,8,16,.58) 50%, rgba(5,8,16,.12) 75%, transparent), radial-gradient(900px 600px at 85% 5%, rgba(124,58,237,.18), transparent 60%), radial-gradient(800px 500px at 10% 95%, rgba(34,211,238,.12), transparent 60%)",
              }}
            />
            {/* Mouse spotlight */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300 ${
                hoveringHero ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(420px 300px at var(--x) var(--y), rgba(236,72,153,.14), transparent 50%)",
              }}
            />
            {/* Sheen sweep */}
            <span
              aria-hidden
              className={`absolute inset-y-0 -left-1/3 w-1/3 opacity-0 ${
                hoveringHero ? "opacity-100" : "opacity-0"
              } prm-stop`}
              style={{
                background:
                  "linear-gradient(120deg, transparent, rgba(255,255,255,.16), transparent)",
                animation: hoveringHero ? "shine 1.6s ease-in-out" : "none",
                filter: "blur(1px)",
              }}
            />
            {/* Sparkles */}
            {hoveringHero && (
              <>
                <span
                  className="sparkle"
                  style={{ top: "18%", left: "12%", width: 6, height: 6 }}
                />
                <span
                  className="sparkle"
                  style={{
                    top: "70%",
                    left: "20%",
                    width: 4,
                    height: 4,
                    animationDelay: ".35s",
                  }}
                />
                <span
                  className="sparkle"
                  style={{
                    top: "26%",
                    right: "18%",
                    width: 8,
                    height: 8,
                    animationDelay: ".6s",
                  }}
                />
              </>
            )}
          </div>

          {/* HERO content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-2 py-1 shadow-2xl backdrop-blur-md",
                  mode
                    ? "border-amber-400/60 bg-[#111111]/80 text-amber-300"
                    : "border-violet-300/30 bg-white/10 text-violet-100",
                ].join(" ")}
              >
                <Users className="w-3 h-3" />
                <span className="font-medium text-xs">Community Recipes</span>
              </div>

              <div
                className={[
                  "inline-flex items-center gap-3 rounded-lg border px-3 py-1.5 backdrop-blur-md",
                  mode
                    ? "border-amber-400/70 bg-[#111111]/80 text-[#F9FAFB]"
                    : "border-white/30 bg-white/20 text-slate-900",
                ].join(" ")}
              >
                <Heart
                  className={`w-4 h-4 ${
                    mode ? "text-[#E8C971]" : "text-rose-600"
                  } animate-[floatY_3s_ease-in-out_infinite] prm-stop`}
                />
                <span className="text-sm font-semibold tabular-nums">37</span>
              </div>
            </div>

            {/* Categories + Title + Description */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categoryNames?.map((cat, idx) => (
                  <div
                    key={idx}
                    className={[
                      "glass-effect px-4 py-2 rounded-lg inline-flex items-center gap-2 hover-lift border transition-colors",
                      mode
                        ? "text-amber-300 border-amber-500/40 bg-[#111111]/70"
                        : "text-amber-900 border-amber-200 bg-amber-50/70",
                    ].join(" ")}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <TicketPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#F9FAFB] drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]">
                {recipe?.name}
              </h1>
              {recipe?.description && (
                <p
                  className={`text-base md:text-lg max-w-3xl drop-shadow ${
                    mode ? "text-[#C9C9CF]" : "text-slate-600"
                  }`}
                >
                  {recipe.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2"
          style={{ animationDelay: "0.1s" }}
        >
          {[
            {
              icon: ChefHat,
              label: "Author",
              value: recipe?.author,
              color: "#1AB394",
            },
            {
              icon: Clock,
              label: "Total Time",
              value: recipe?.totalTime,
              color: "#EA9F77",
            },
            {
              icon: Weight,
              label: "Weight",
              value: `${recipe?.finalWeight}g`,
              color: "#DB4965",
            },
            {
              icon: UtensilsCrossed,
              label: "Portions",
              value: recipe?.portions,
              color: "#6A7D93",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`glass-effect rounded-2xl p-5 hover-lift group ${
                mode ? "text-[#F2F2F2]" : "text-slate-800"
              } animate-scale-in`}
              style={{ animationDelay: `${0.15 + idx * 0.08}s` }}
            >
              <stat.icon
                className="w-6 h-6 mb-3 transition-transform group-hover:scale-110"
                style={{ color: mode ? "#D4AF37" : stat.color }}
              />
              <div
                className={`text-sm mb-1 ${
                  mode ? "text-[#C9C9CF]" : "text-slate-600/90"
                }`}
              >
                {stat.label}
              </div>
              <div
                className={`text-xl font-bold ${
                  mode ? "text-[#F2F2F2]" : "text-slate-900"
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* LEFT: Ingredients + Methods */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Ingredients */}
          <div className={`rounded-2xl p-6 ${panelClass}`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B88A1B] grid place-items-center">
                <UtensilsCrossed className="w-6 h-6 text-[#0B0B0C]" />
              </div>
              <div>
                <div className={`text-2xl font-semibold ${titleClass}`}>
                  Ingredients
                </div>
                <div className={`text-sm ${subTitleClass}`}>
                  Everything you need for this recipe
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {ingredients?.length ? (
                ingredients.map((item, idx) => (
                  <div key={item.foodId} className={listItemClass}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg grid place-items-center text-xs font-bold ${
                          mode
                            ? "bg-[rgb(233,241,87)] text-black"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="flex-1">
                        {formatIngredient(item, foods)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`col-span-2 ${listEmptyClass}`}>
                  No ingredients added yet.
                </div>
              )}
            </div>
          </div>

          {/* Cooking method */}
          <div className={`rounded-2xl p-6 ${panelClass}`}>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B88A1B] grid place-items-center">
                <ChefHat className="w-6 h-6 text-[#1C1C1E]" />
              </div>
              <div>
                <div className={`text-2xl font-semibold ${titleClass}`}>
                  Cooking method
                </div>
                <div className={`text-sm ${subTitleClass}`}>Step by step</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {recipe?.cookingMethods?.length
                ? recipe.cookingMethods.map((item) => (
                    <div
                      key={item.step}
                      className={`grid grid-cols-12 items-start rounded-lg overflow-hidden border ${rowBorder}`}
                    >
                      <div
                        className={`col-span-2 px-4 py-2 text-sm ${rowLabel} border-r ${rowBorder}`}
                      >
                        {item.step}
                      </div>
                      <div
                        className={`col-span-10 px-4 py-2 text-sm ${
                          mode ? "text-[#F2F2F2]" : "text-gray-700"
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>

          {/* Micronutrients */}
          <div className={`rounded-2xl p-6 ${panelClass}`}>
            <div className="mb-2">
              <div className={`text-2xl font-semibold ${titleClass}`}>
                Micronutrients
              </div>
              <div className={`text-sm ${subTitleClass}`}>
                Vitamins & minerals
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(micronutrients)
                .filter(([key]) => key !== "id")
                .map(([key, value], index) => (
                  <div
                    key={key}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.03] ${
                      mode
                        ? "bg-[#14161B] hover:bg-[#1A1D23] border border-[#24262D]"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.03}s` }}
                  >
                    <div
                      className={`text-xs mb-2 capitalize ${
                        mode ? "text-[#9AA0A6]" : "text-slate-600"
                      }`}
                    >
                      {key}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        mode ? "text-[#E8C971]" : "text-purple-700"
                      }`}
                    >
                      {value !== null ? value : "--"}
                      <span className="text-xs ml-1">ug</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Analytics sticky */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6 self-start">
          {/* Nutrition Facts / Global analysis */}
          <div
            className={`rounded-2xl p-6 ${panelClass} animate-pulse-glow`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-4">
              <div className={`text-2xl font-semibold ${titleClass}`}>
                Nutrition Facts
              </div>
              <div className={`text-sm ${subTitleClass}`}>
                Energy, macronutrients and fiber distribution
              </div>
            </div>

            <div
              className={`mb-6 p-5 rounded-2xl relative overflow-hidden ${
                mode
                  ? "bg-gradient-to-r from-[#D4AF37]/22 via-[#E8C971]/12 to-transparent"
                  : "bg-gradient-to-r from-emerald-50 to-emerald-100"
              }`}
            >
              <div
                className={`text-sm mb-1 ${
                  mode ? "text-[#C9C9CF]" : "text-slate-600"
                }`}
              >
                Total Energy
              </div>
              <div
                className="text-4xl font-bold"
                style={{ color: mode ? "#D4AF37" : "#1AB394" }}
              >
                {macronutrients?.energy}
                <span className="text-xl ml-2">kcal</span>
              </div>
              <span
                aria-hidden
                className="absolute -left-1/3 inset-y-0 w-1/3 opacity-30 prm-stop"
                style={{
                  background:
                    "linear-gradient(120deg, transparent, rgba(212,175,55,.28), transparent)",
                }}
              />
              {/* sparkles */}
              <span
                className="sparkle"
                style={{ top: "18%", right: "8%", width: 6, height: 6 }}
              />
              <span
                className="sparkle"
                style={{
                  bottom: "20%",
                  left: "14%",
                  width: 4,
                  height: 4,
                  animationDelay: ".4s",
                }}
              />
            </div>

            {/* Macro chips */}
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  label: "Fat",
                  value: `${macronutrients?.fat}g`,
                  color: "#DB4965",
                },
                {
                  label: "Carbs",
                  value: `${macronutrients?.carbohydrates}g`,
                  color: "#EA9F77",
                },
                {
                  label: "Protein",
                  value: `${macronutrients?.protein}g`,
                  color: "#1AB394",
                },
                {
                  label: "Fiber",
                  value: `${micronutrients?.fiber ?? 0}g`,
                  color: "#6A7D93",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3 text-center backdrop-blur-md border hover-lift"
                  style={{
                    borderColor: mode
                      ? "rgba(212,175,55,.35)"
                      : "rgba(148,163,184,.25)",
                    background: mode
                      ? "linear-gradient(180deg, rgba(212,175,55,.18), rgba(13,13,13,.92))"
                      : "linear-gradient(180deg, rgba(255,255,255,.85), rgba(241,245,249,.75))",
                  }}
                >
                  <div
                    className="mx-auto mb-2 h-12 w-12 rounded-full grid place-items-center text-sm font-semibold"
                    style={{
                      border: `4px solid ${mode ? "#D4AF37" : m.color}`,
                    }}
                  >
                    {m.value}
                  </div>
                  <div className={`${subTitleClass} text-xs`}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Macronutrients (Pie + rotating ring) */}
          <div className={`rounded-2xl p-6 ${panelClass}`}>
            <div className="mb-2">
              <div className={`text-2xl font-semibold ${titleClass}`}>
                Macronutrients
              </div>
              <div className={`text-sm ${subTitleClass}`}>
                Macronutrients distribution of the recipe
              </div>
            </div>

            <div className="relative h-[320px] w-full grid place-items-center">
              {/* Rotating conic ring */}
              <div
                aria-hidden
                className="absolute h-[260px] w-[260px] rounded-full opacity-40 prm-stop"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(219,73,101,.55), rgba(234,159,119,.55), rgba(26,179,148,.55), rgba(124,58,237,.45), rgba(219,73,101,.55))",
                  animation: "spinSlow 16s linear infinite",
                  filter: "blur(2px)",
                }}
              />
              <div className="relative h-[280px] w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="fatGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff6b88" />
                        <stop offset="100%" stopColor="#DB4965" />
                      </linearGradient>
                      <linearGradient id="carbGrad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffd2b6" />
                        <stop offset="100%" stopColor="#EA9F77" />
                      </linearGradient>
                      <linearGradient id="protGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#5fe3c4" />
                        <stop offset="100%" stopColor="#1AB394" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={chart}
                      cx="50%"
                      cy="50%"
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={120}
                      stroke={mode ? "#0B0B0C" : "#ffffff"}
                      strokeWidth={2}
                      labelLine={false}
                    >
                      {chart.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: mode ? "#0B0B0C" : "#ffffff", // nền: đen hoặc trắng
                        border: `1px solid ${mode ? "#D4AF37" : "#e2e8f0"}`, // viền vàng khi tối
                        borderRadius: "10px",
                        color: mode ? "#E8C971" : "#1C1C1E", // chữ vàng khi dark, đen khi light
                        fontWeight: 500,
                        boxShadow: mode
                          ? "0 0 15px rgba(212,175,55,0.25)" // glow vàng nhẹ trong dark
                          : "0 0 8px rgba(0,0,0,0.08)", // shadow nhẹ trong light
                      }}
                      itemStyle={{
                        color: mode ? "#E8C971" : "#1C1C1E", // đảm bảo chữ tooltip item đồng nhất
                      }}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
