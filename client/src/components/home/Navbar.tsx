import { useMemo } from "react";
import { LogOut, Menu } from "lucide-react";
import { logo, logo_medium } from "../../export/exportImage";
import { useAppSelector } from "../../hook/UseCustomeRedux";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Titlebar from "./Titlebar";
import GooeyNav from "../ui/GooeyNav";
import { StyledWrapper6 } from "@/pages/auth/ui/StyledWrapper";
import { clsx } from "clsx";
import VideoBackground from "../media/VideoBackground";

type NavbarProps = {
  isSidebarOpen: boolean;
  isSidebarExpanded: boolean;
  onToggle: () => void;
};

function ImageCard({
  title,
  desc,
  img,
  onClick,
}: {
  title: string;
  desc: string;
  img: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left flex gap-3 items-start rounded-xl border border-black/10 dark:border-white/10 p-3 hover:border-[#F6D06F] hover:shadow-lg transition"
    >
      <img
        src={img}
        alt={title}
        className="w-32 h-24 object-cover rounded-md"
      />
      <div>
        <h4 className="text-lg font-semibold text-black dark:text-white">
          {title}
        </h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{desc}</p>
      </div>
    </button>
  );
}

export default function Navbar({
  isSidebarOpen,
  isSidebarExpanded,
  onToggle,
}: NavbarProps) {
  const { mode } = useAppSelector((s) => s.darkMode);
  const { currentUser } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const homeVideo =
    "https://res.cloudinary.com/di8ege413/video/upload/v1761792360/6577405-hd_1920_1080_25fps_tnxcpv.mp4";
  const foodVideo =
    "https://res.cloudinary.com/di8ege413/video/upload/v1761791840/3296399-uhd_4096_2160_25fps_b6gpoi.mp4";
  const recipeVideo =
    "https://res.cloudinary.com/di8ege413/video/upload/v1761792356/6202680-uhd_2160_3840_25fps_epz0q1.mp4";

  const currentPath = location.pathname;
  const currentVideoSrc = useMemo(() => {
    if (!mode) return undefined;
    if (currentPath.startsWith(ROUTES.FOOD)) return foodVideo;
    if (currentPath.startsWith(ROUTES.RECIPE)) return recipeVideo;
    return homeVideo;
  }, [mode, currentPath, homeVideo, foodVideo, recipeVideo]);

  const shouldPlay = !!mode && !!currentVideoSrc;

  const itemsNav = [
    {
      label: "HomePage",
      href: ROUTES.HOME,
      panelMinWidth: 200,
      dropdown: (
        <div className="gap-3 text-sm flex flex-col">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="text-left hover:text-[#F6D06F]"
          >
            Overview
          </button>
          <button
            onClick={() => navigate(`${ROUTES.HOME}#features`)}
            className="text-left hover:text-[#F6D06F]"
          >
            Features
          </button>
          <button
            onClick={() => navigate(`${ROUTES.HOME}#about`)}
            className="text-left hover:text-[#F6D06F]"
          >
            About
          </button>
          <button
            onClick={() => navigate(`${ROUTES.HOME}#contact`)}
            className="text-left hover:text-[#F6D06F]"
          >
            Contact
          </button>
        </div>
      ),
    },
    {
      label: "Foods",
      href: ROUTES.FOOD,
      panelMinWidth: 350,
      dropdown: (
        <div className="flex flex-col gap-4">
          <ImageCard
            title="Food Database"
            desc="Browse all foods with macros."
            img="https://images.unsplash.com/photo-1675096000167-4b8a276b6187?q=80&w=800"
            onClick={() => navigate(ROUTES.FOOD)}
          />
          <ImageCard
            title="Ingredients"
            desc="Base ingredients and nutrients."
            img="https://images.unsplash.com/photo-1542888071-b89972387363?q=80&w=800"
            onClick={() => navigate(`${ROUTES.FOOD}#ingredients`)}
          />
        </div>
      ),
    },
    {
      label: "Recipes",
      href: ROUTES.RECIPE,
      panelMinWidth: 640,
      dropdown: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageCard
            title="All Recipes"
            desc="Explore curated recipes."
            img="https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800"
            onClick={() => navigate(ROUTES.RECIPE)}
          />
          <ImageCard
            title="Create Recipe"
            desc="Craft your own in minutes."
            img="https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=800"
            onClick={() => navigate(`${ROUTES.RECIPE}/new`)}
          />
          <ImageCard
            title="Featured"
            desc="Chef’s picks and seasonal."
            img="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800"
            onClick={() => navigate(`${ROUTES.RECIPE}?tag=featured`)}
          />
          <ImageCard
            title="Quick & Easy"
            desc="Under 20 minutes."
            img="https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800"
            onClick={() => navigate(`${ROUTES.RECIPE}?tag=quick`)}
          />
        </div>
      ),
    },
  ];

  const isActiveFood = currentPath === ROUTES.FOOD;

  const lightTitle = isActiveFood ? "Food databases" : "Recipes";
  const lightSubtitle = isActiveFood
    ? "Create, check and update foods that you can use on meal plans"
    : "Create, check and update recipes";

  const title = mode
    ? currentPath.startsWith(ROUTES.FOOD)
      ? "Golden Kitchen • Food"
      : currentPath.startsWith(ROUTES.RECIPE)
      ? "Velvet Cookbook • Recipes"
      : "Luxe Culinary • Home"
    : lightTitle;

  const subtitle = mode
    ? currentPath.startsWith(ROUTES.FOOD)
      ? "Explore macros & curated ingredients."
      : currentPath.startsWith(ROUTES.RECIPE)
      ? "Chef-picked recipes & your creations."
      : "Discover highlights and seasonal picks."
    : lightSubtitle;

  const titleKey = mode
    ? `video-${currentPath}`
    : isActiveFood
    ? "light-food"
    : "light-recipes";

  const { username, email } = currentUser || {};
  const userInitial =
    username?.charAt(0)?.toUpperCase() ??
    email?.charAt(0)?.toUpperCase() ??
    "N";

  const isDarkMode = mode;
  const isCompact = isDarkMode && !isSidebarExpanded;

  const wrapperClasses = clsx(
    "relative flex flex-col transition-colors duration-300",
    isDarkMode ? "text-[#F2F2F2] bg-transparent" : "text-slate-800 bg-white"
  );

  // BỎ fixed để header (navbar + title) cùng 1 wrapper có video nền
  const topPaddingClasses = clsx(
    isDarkMode ? (isCompact ? "px-4 pt-4" : "px-6 pt-6") : ""
  );

  const cardClasses = clsx(
    "transition-all duration-500 flex items-center justify-between",
    isDarkMode
      ? "animate-card-float rounded-3xl border border-[#2B2D36] bg-[#14161B]/40 shadow-luxury backdrop-blur-md"
      : "",
    isDarkMode ? (isSidebarExpanded ? "px-5 py-4" : "px-4 py-3") : "px-5 py-4"
  );

  return (
    <div className={wrapperClasses}>
      {/* HEADER WRAPPER: chứa NAVBAR + HERO, chỉ dark mới có video nền */}
      <div className={clsx(isDarkMode ? "relative overflow-hidden" : "")}>
        {isDarkMode && currentVideoSrc ? (
          <VideoBackground
            key={currentVideoSrc}
            src={currentVideoSrc}
            active={true}
            shouldPlay={shouldPlay}
            overlayDark
            preload="metadata"
            overlayOpacity={0.45}
            fill
          />
        ) : null}

        {/* Nội dung header (navbar + hero) */}
        <div className="relative z-10">
          {/* Top line */}
          <div className={topPaddingClasses}>
            <div className={cardClasses}>
              {isSidebarOpen ? (
                <div className="flex w-full items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={onToggle}
                    className={`flex items-center justify-center rounded-xl py-2 px-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-[#F7D57A] via-[#FFF1CE] to-[#F6C95A] text-[#2D1A04]"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400"
                    }`}
                    aria-label="Toggle sidebar"
                  >
                    <Menu />
                  </button>
                  {mode ? null : (
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium ${
                          mode ? "text-[#E5E5EA]" : "text-slate-700"
                        }`}
                      >
                        {username}
                      </span>
                    </div>
                  )}
                </div>
              ) : isDarkMode ? (
                isSidebarExpanded ? (
                  <div className="flex w-full items-center justify-between">
                    <button
                      type="button"
                      onClick={onToggle}
                      className="group flex items-center gap-2"
                      aria-label="Open sidebar"
                      title="Open sidebar"
                    >
                      <img
                        src={logo_medium}
                        alt="logo"
                        className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#F7D57A] via-[#F3C24D] to-[#D4AF37] text-sm font-semibold text-[#231604] shadow-[0_10px_25px_rgba(246,208,111,0.3)]">
                          {userInitial}
                        </span>
                        <span className="hidden text-sm font-medium text-[#EEE0C3] md:inline">
                          {username}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-between">
                    <button
                      type="button"
                      onClick={onToggle}
                      className="group flex items-center gap-2"
                      aria-label="Open sidebar"
                      title="Open sidebar"
                    >
                      <img
                        src={logo_medium}
                        alt="logo"
                        className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    <GooeyNav
                      items={itemsNav}
                      particleCount={15}
                      particleDistances={[90, 10]}
                      particleR={100}
                      initialActiveIndex={0}
                      animationTime={600}
                      timeVariance={300}
                      colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                    />

                    <StyledWrapper6>
                      <button className="Btn">
                        <div className="sign">
                          <LogOut className="w-4 h-4 text-black" />
                        </div>
                        <div className="text">Logout</div>
                      </button>
                    </StyledWrapper6>
                  </div>
                )
              ) : (
                <div className="flex w-full items-center justify-between">
                  <button
                    type="button"
                    onClick={onToggle}
                    className="group flex items-center gap-2"
                    aria-label="Open sidebar"
                    title="Open sidebar"
                  >
                    <img
                      src={mode ? logo_medium : logo}
                      alt="logo"
                      className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                  <nav className="flex items-center gap-6 text-sm transition-all duration-300 ease-out text-slate-600">
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.HOME)}
                      className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full text-slate-600 hover:text-slate-800 after:bg-emerald-500"
                    >
                      HomePage
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.FOOD)}
                      className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full text-slate-600 hover:text-slate-800 after:bg-emerald-500"
                    >
                      Foods
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.RECIPE)}
                      className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full text-slate-600 hover:text-slate-800 after:bg-emerald-500"
                    >
                      Recipes
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* Hero title/subtitle (nằm chung wrapper để dùng chung video nền) */}
          {mode ? (
            <div
              className={`relative z-10 p-6 sm:px-8 sm:py-8 ${
                isSidebarExpanded ? "mt-25" : "mt-50"
              }`}
            >
              <div
                key={titleKey}
                className={`max-w-xl space-y-3 ${
                  mode ? "animate-title-slide" : ""
                }`}
              >
                <h2
                  className={`text-5xl font-extrabold tracking-wide ${
                    mode
                      ? "bg-gradient-to-br from-[#D7B48A] via-[#B98C5A] to-[#8B5E34] bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(217,186,150,0.35)]"
                      : "text-[#9B6B3E] drop-shadow-[0_2px_6px_rgba(155,107,62,0.3)]"
                  }`}
                >
                  {title}
                </h2>
                <p
                  className={`text-lg font-medium leading-relaxed ${
                    mode ? "text-[#E7C9A9]" : "text-[#A57B52]"
                  }`}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Title bar (light mode) */}
      {!mode && <Titlebar mode={mode} isActive={isActiveFood} />}
    </div>
  );
}
