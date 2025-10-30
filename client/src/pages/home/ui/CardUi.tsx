import { Tag, Users } from "lucide-react";
import { useAppSelector } from "../../../hook/UseCustomeRedux";
import type { IMacronutrient } from "../../../utils/interface/Macronutrients";
import { useMemo, useState, useRef, useCallback } from "react";

import type { RecipeCategory } from "../../../utils/interface/RecipeCategory";
import { useNavigate } from "react-router-dom";
import type { IRecipe, RecipeIngredient } from "../../../utils/interface/Recipes";
import type { IMicronutrient } from "../../../utils/interface/Micronutrients";
import type { IFood } from "../../../utils/interface/Foods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface CardProp {
  id?: number;
  recipe: IRecipe | undefined;
  macronutrients: IMacronutrient | undefined;
  micronutrients?: IMicronutrient | undefined;
  listCategory: RecipeCategory[];
  listIngredients?: RecipeIngredient[];
  listFoods?: IFood[];
  favorite: boolean;
  onToggleFavorite?: ((recipeId: number) => void) | undefined;
  numberFavorite: number;
}

export function CardUi({
  id,
  recipe,
  macronutrients,
  micronutrients,
  listCategory,
  listIngredients,
  listFoods,
  favorite,
  numberFavorite,
  onToggleFavorite,
}: CardProp) {
  const { mode } = useAppSelector((state) => state.darkMode);
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 🔸 THÊM: lưu tỉ lệ ảnh thực tế để đặt aspect-ratio
  const [imgRatio, setImgRatio] = useState<number | null>(null); // width / height

  const categoryNames = useMemo(() => {
    if (!Array.isArray(listCategory)) return [];
    return listCategory
      .filter((c) => recipe?.category?.includes(c.id))
      .map((c) => c.name);
  }, [listCategory, recipe?.category]);

  const ingredients = useMemo(() => {
    if (!Array.isArray(listIngredients)) return [];
    if (!Array.isArray(recipe?.ingredients)) return [];
    return listIngredients.filter((food) => recipe!.ingredients.includes(food.foodId));
  }, [listIngredients, recipe]);

  const foods = useMemo(() => {
    if (!Array.isArray(listFoods)) return [];
    if (!Array.isArray(recipe?.ingredients)) return [];
    return listFoods.filter((food) => recipe!.ingredients.includes(food.id));
  }, [listFoods, recipe]);

  const handleClick = (rid?: number): void => {
    if (rid) {
      navigate(`/recipe/effect/${rid}`, {
        state: {
          recipe,
          macronutrients,
          micronutrients,
          categoryNames,
          ingredients,
          foods,
          favorite: numberFavorite,
          isFavorite: favorite,
        },
      });
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && id !== undefined) {
      onToggleFavorite(id);
      const el = e.currentTarget as HTMLElement;
      el.classList.remove("burst");
      el.classList.add("burst");
      window.setTimeout(() => el.classList.remove("burst"), 450);
    }
  };

  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--px", `${px}`);
    el.style.setProperty("--py", `${py}`);

    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 10;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }, []);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!id) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shine { 0%{transform:translateX(-120%);opacity:0}10%{opacity:.25}50%{opacity:.4}100%{transform:translateX(120%);opacity:0} }
        @keyframes edgelight { 0%{transform:translateX(-40%);opacity:0}10%{opacity:.35}90%{opacity:.35}100%{transform:translateX(140%);opacity:0} }
        @media (prefers-reduced-motion: reduce) { .prm-stop { animation:none !important; transition:none !important; } }
        .burst .burst-ring::after { content:""; position:absolute; inset:-6px; border-radius:999px; animation: pingShort 450ms ease-out; background: rgba(244,63,94,.35); pointer-events:none; }
        @keyframes pingShort { 0%{transform:scale(.9);opacity:.65}100%{transform:scale(1.35);opacity:0} }
      `}</style>

      <div
        ref={cardRef}
        className={[
          "group relative max-w-2xl flex-1 rounded-2xl transition-all duration-500 outline-none will-change-transform",
          id ? "cursor-pointer" : "",
          mode
            ? "bg-auroraDark border border-[rgba(232,201,113,0.22)] shadow-luxury"
            : "bg-[linear-gradient(180deg,#0f1320,#12172a)] border border-white/5",
          "hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(212,175,55,.35),0_0_24px_rgba(232,201,113,.25)]",
          "focus-visible:ring-2 focus-visible:ring-violet-400/40",
        ].join(" ")}
        style={{
          transform: "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        } as React.CSSProperties}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { onMouseLeave(); setIsHovered(false); }}
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => handleClick(id)}
        role={id ? "button" : undefined}
        tabIndex={id ? 0 : -1}
        onKeyDown={onKey}
      >
        {/* Aurora border glow */}
        <div
          aria-hidden
          className={[
            "pointer-events-none absolute -inset-[2px] rounded-3xl opacity-0 blur-xl transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(212,175,55,.55), rgba(232,201,113,.45), rgba(240,200,90,.40), rgba(180,140,30,.38), rgba(212,175,55,.55))",
          }}
        />

        <span
          aria-hidden
          className={[
            "prm-stop absolute left-0 right-0 top-0 h-px opacity-0",
            "bg-[linear-gradient(90deg,transparent,rgba(203,213,225,.25),transparent)]",
            isHovered ? "animate-[edgelight_2.2s_ease-in-out_infinite]" : "",
          ].join(" ")}
        />

        {/* \n          ⬇⬇⬇ THAY ĐỔI QUAN TRỌNG CHO ẢNH (tối ưu masonry) ⬇⬇⬇
            - BỎ height cố định và absolute full cover cũ
            - DÙNG wrapper có aspect-ratio theo tỉ lệ ảnh thực tế => mỗi card cao thấp khác nhau
            - Ảnh object-cover để luôn đẹp, không méo
        */}
        <div className="relative w-full overflow-hidden rounded-2xl">
          {/* Skeleton */}
          {!imageLoaded && (
            <div className={`w-full bg-[#14161B] aspect-[16/10] animate-pulse`} />
          )}

          {/* Wrapper giữ tỉ lệ động; fallback 16/10 nếu chưa biết */}
          <div
            className="relative w-full"
            style={{ aspectRatio: imgRatio ? String(imgRatio) : "16 / 10" }}
          >
            <img
              src={recipe?.coverSrc ?? undefined}
              alt={recipe?.name || "Recipe"}
              loading="lazy"
              onLoad={(e) => {
                const t = e.currentTarget;
                // lấy kích thước thật để set tỉ lệ
                if (t.naturalWidth && t.naturalHeight) {
                  setImgRatio(t.naturalWidth / t.naturalHeight);
                }
                setImageLoaded(true);
              }}
              onError={() => setImageLoaded(true)}
              className={[
                "h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
                isHovered ? "scale-[1.05] brightness-[.9]" : "scale-100",
                imageLoaded ? "opacity-100" : "opacity-0",
                "rounded-2xl",
              ].join(" ")}
            />

            {/* Gradient phủ & hiệu ứng giữ nguyên */}
            <div
              aria-hidden
              className={[
                "pointer-events-none absolute inset-0 transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-80",
              ].join(" ")}
              style={{
                background:
                  "linear-gradient(to top, rgba(11,11,12,.82), rgba(11,11,12,.55) 45%, rgba(11,11,12,.15) 70%, transparent), radial-gradient(900px 600px at 85% 5%, rgba(212,175,55,.18), transparent 60%), radial-gradient(800px 500px at 10% 95%, rgba(14,167,108,.12), transparent 60%)",
              }}
            />

            {/* Spotlight theo chuột */}
            <div
              aria-hidden
              className={[
                "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 mix-blend-screen",
                isHovered ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                background:
                  "radial-gradient(420px 300px at var(--x) var(--y), rgba(232,201,113,.18), transparent 55%)",
              }}
            />

            {/* Sheen */}
            <span
              aria-hidden
              className={[
                "prm-stop pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0",
                isHovered ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                background:
                  "linear-gradient(120deg, transparent, rgba(255,255,255,.18), transparent)",
                animation: isHovered ? "shine 1.8s ease-in-out" : "none",
                transform: "skewX(-12deg)",
                filter: "blur(1px)",
              }}
            />
          </div>

          {/* Content overlay giữ dưới để không ảnh hưởng aspect */}
          <div className="absolute inset-0 z-10 flex h-full flex-col justify-between p-6">
            <div className="space-y-4">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-2xl backdrop-blur-md transition-all duration-300",
                  isHovered ? "translate-x-1 scale-[1.05]" : "",
                  mode
                    ? "border-[rgba(232,201,113,0.3)] bg-[rgba(20,22,27,0.65)] text-[#E8C971]"
                    : "border-violet-300/30 bg-white/10 text-violet-100",
                ].join(" ")}
              >
                <Users className={`h-4 w-4 ${isHovered ? "rotate-12" : ""} transition-transform duration-300`} />
                <span className="font-semibold">Community</span>
              </div>

              <h1
                className={[
                  "text-2xl md:text-3xl font-extrabold tracking-tight text-[#F2F2F2] drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]",
                  isHovered ? "translate-y-0 opacity-100" : "translate-y-[2px] opacity-95",
                  "transition-all duration-500",
                  "line-clamp-2",
                ].join(" ")}
                title={recipe?.name}
              >
                {recipe?.name}
              </h1>
            </div>

            <div
              className={[
                "space-y-4 transition-all duration-500",
                isHovered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className={[
                    "text-sm font-medium rounded-lg px-3 py-1.5 backdrop-blur-md",
                    "text-[#E8C971]",
                    "bg-[rgba(20,22,27,0.6)] border border-[rgba(232,201,113,0.25)]",
                  ].join(" ")}
                >
                  By {recipe?.author}
                </p>

                <button
                  type="button"
                  aria-label={favorite ? "Bỏ thích" : "Yêu thích"}
                  aria-pressed={favorite}
                  onClick={handleHeartClick}
                  className={[
                    "relative group/heart flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-300",
                    "backdrop-blur-md border",
                    favorite
                      ? "border-[rgba(185,56,79,0.45)] bg-[rgba(185,56,79,0.18)] text-[#F2F2F2]"
                      : "border-[rgba(232,201,113,0.28)] bg-transparent text-[#E8C971] hover:border-[rgba(232,201,113,0.4)] hover:bg-[rgba(232,201,113,0.08)] hover:text-[#F2F2F2]",
                    "active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,175,55,0.35)]",
                  ].join(" ")}
                >
                  <span className="burst-ring relative inline-flex">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={[
                        "transition-transform duration-300",
                        favorite ? "text-[#B9384F] scale-110" : "text-[#E8C971]",
                        "group-hover/heart:scale-110",
                      ].join(" ")}
                    />
                  </span>
                  <span className="font-semibold tabular-nums">{numberFavorite}</span>
                </button>
              </div>

              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isHovered ? "scale-[1.03]" : "",
                  "backdrop-blur-md shadow-xl",
                  "border border-[rgba(232,201,113,0.28)]",
                  "bg-[linear-gradient(135deg,rgba(212,175,55,.18),rgba(20,22,27,.62))]",
                  "text-[#E8C971]",
                ].join(" ")}
                title={categoryNames.join(", ")}
              >
                <Tag className={`h-4 w-4 text-[#E8C971] ${isHovered ? "rotate-12" : ""} transition-transform duration-300`} />
                <span className="truncate">{categoryNames.join(", ")}</span>
              </div>

              <div
                className={[
                  "grid grid-cols-5 gap-3 rounded-xl p-4 transition-all duration-300",
                  "backdrop-blur-xl border",
                  "border-[rgba(36,38,45,0.85)]",
                  "bg-[linear-gradient(180deg,rgba(20,22,27,.7),rgba(11,11,12,.75))]",
                  "text-[#F2F2F2]",
                ].join(" ")}
              >
                {[
                  { label: "Energy", value: macronutrients?.energy, d: "0ms" },
                  { label: "Fat", value: macronutrients?.fat, d: "40ms" },
                  { label: "Carbs", value: macronutrients?.carbohydrates, d: "80ms" },
                  { label: "Protein", value: macronutrients?.protein, d: "120ms" },
                  { label: "Per", value: "100g", d: "160ms" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={["text-center transition-all duration-300", isHovered ? "translate-y-0" : "translate-y-2"].join(" ")}
                    style={{ transitionDelay: isHovered ? item.d : "0ms" }}
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-[#9AA0A6]">{item.label}</p>
                    <p className="font-bold text-sm tabular-nums text-[#F2F2F2]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {isHovered && (
              <>
                <div className="pointer-events-none absolute top-1/4 right-1/5 h-2 w-2 rounded-full bg-[#0EA76C]/70 mix-blend-screen animate-ping" />
                <div className="pointer-events-none absolute bottom-8 left-1/3 h-1.5 w-1.5 rounded-full bg-[#355CFF]/70 mix-blend-screen animate-ping" style={{ animationDelay: "0.35s" }} />
                <div className="pointer-events-none absolute top-1/2 left-10 h-1 w-1 rounded-full bg-[#E8C971]/70 mix-blend-screen animate-ping" style={{ animationDelay: "0.65s" }} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}