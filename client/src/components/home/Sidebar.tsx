import { useEffect, useMemo, useState } from "react";
import { Apple, BookOpen, House, LogOut, type LucideIcon } from "lucide-react";
import { logo, logo_icon } from "../../export/exportImage";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../hook/UseCustomeRedux";
import { logout } from "../../stores/slices/authSlice";
import { clsx } from "clsx";
import {
  Sidebar as AnimatedSidebar,
  SidebarBody,
  SidebarLink as AnimatedSidebarLink,
} from "../ui/sidebar";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { IconSparkles, IconUserBolt } from "@tabler/icons-react";

type SidebarProps = {
  isOpen: boolean;
  onHoverStateChange?: (expanded: boolean) => void;
};

export default function Sidebar({ isOpen, onHoverStateChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((s) => s.darkMode);
  const { currentUser } = useAppSelector((s) => s.auth);

  type MenuItem = {
    label: string;
    Icon: LucideIcon;
    route: string;
  };

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: "Homepage",
        Icon: House,
        route: ROUTES.HOME,
      },
      {
        label: "Foods",
        Icon: Apple,
        route: ROUTES.FOOD,
      },
      {
        label: "Recipes",
        Icon: BookOpen,
        route: ROUTES.RECIPE,
      },
    ],
    []
  );

  const userInitial =
    currentUser?.username?.charAt(0)?.toUpperCase() ??
    currentUser?.email?.charAt(0)?.toUpperCase() ??
    "N";

  const [hoveredOpen, setHoveredOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHoveredOpen(true);
    } else {
      setHoveredOpen(false);
    }
  }, [isOpen]);

  const computedOpen = isOpen ? true : hoveredOpen;
  const expanded = computedOpen;

  useEffect(() => {
    onHoverStateChange?.(computedOpen);
  }, [computedOpen, onHoverStateChange]);

  if (!mode) {
    return (
      <aside
        className={clsx(
          "h-screen flex flex-col overflow-hidden border-r shadow-sm transition-[width] duration-300 ease-in-out",
          "bg-white text-slate-800 border-slate-200/70",
          isOpen ? "w-64" : "w-0 pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-12 border-b border-slate-200/70">
          <img src={logo} alt="logo" className="shrink-0" />
        </div>

        {/* Menu items */}
        <nav className="mt-2 px-2 font-medium text-sm">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.Icon;
              const isActive = location.pathname.startsWith(item.route);
              const activeClasses = isActive
                ? "bg-emerald-500/15 text-emerald-700"
                : "text-slate-600 hover:bg-slate-100";
              const iconBg = isActive
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-600";
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeClasses}`}
                >
                  <div
                    className={`p-2 rounded-full transition-colors ${iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="mt-auto p-4">
          <button
            className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-white transition-colors hover:bg-emerald-600"
            onClick={() => {
              dispatch(logout());
              navigate(ROUTES.LOGIN);
            }}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={clsx(
        "relative flex h-screen shrink-0 flex-col overflow-visible border-r transition-all duration-500",
        "bg-[#0C0A06]/95 text-[#F7F3E8] border-[#2F2713]/60 shadow-[0_25px_90px_rgba(0,0,0,0.45)]"
      )}
    >
      <style>
        {`
          @keyframes sidebarGlowPulse {
            0% { opacity: 0.45; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.05); }
            100% { opacity: 0.45; transform: scale(1); }
          }
          @keyframes sidebarAurora {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .sidebar-aurora {
            background-size: 220% 220%;
            animation: sidebarAurora 24s ease infinite;
          }
          .sidebar-pulse {
            animation: sidebarGlowPulse 12s ease-in-out infinite;
          }
        `}
      </style>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(246,208,111,0.22)_0%,_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,181,65,0.18)_0%,_transparent_85%)]" />
      <AnimatedSidebar open={computedOpen} >
        <SidebarBody className="bg-transparent p-0">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-r-[32px] border border-[#F6D06F]/18 bg-[rgba(23,18,10,0.85)] px-5 py-6 shadow-[0_30px_90px_rgba(10,7,3,0.7)] sidebar-aurora">
            <div className="sidebar-pulse pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(246,208,111,0.35)_0%,_transparent_72%)] blur-3xl" />
            <div className="relative flex items-center justify-between pr-1">
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  expanded ? "gap-3" : "w-full justify-center gap-0"
                )}
              >
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[#F7D57A] via-[#FFF1CE] to-[#F6C95A] text-[#2D1A04] text-lg font-semibold shadow-[0_14px_30px_rgba(246,208,111,0.35)]">
                  <img
                    src={logo_icon}
                    alt="Nutrien logo"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div
                  className={cn(
                    "leading-tight overflow-hidden transition-all duration-300",
                    expanded
                      ? "max-w-[180px] opacity-100 translate-x-0"
                      : "max-w-0 opacity-0 -translate-x-2"
                  )}
                >
                  <p className="text-[11px] uppercase text-[#E8D9B4]/70">
                    Nutrium
                  </p>
                  <p className="text-xl font-semibold text-white">
                    Control Center
                  </p>
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "items-center gap-2 rounded-full border border-[#F6D06F]/40 bg-[#F6D06F]/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#F9EED1] transition-all duration-300",
                      expanded ? "hidden sm:flex" : "hidden"
                    )}
                  >
                    <IconSparkles className="h-3.5 w-3.5 text-[#F6D06F]" />
                    Insight
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="relative mt-10 flex flex-col gap-3">
              {menuItems.map((item) => {
                const Icon = item.Icon;
                const isActive = location.pathname.startsWith(item.route);
                return (
                  <AnimatedSidebarLink
                    key={item.route}
                    link={{
                      label: item.label,
                      href: item.route,
                      icon: (
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300",
                            isActive
                              ? "border-transparent bg-gradient-to-br from-[#F7D57A] via-[#FFEFC4] to-[#F6C95A] text-[#231406] shadow-[0_15px_35px_rgba(246,208,111,0.4)]"
                              : "border-[#F7D57A]/30 bg-[#1A1308]/80 text-[#E8D8B1]/80 group-hover/sidebar:border-[#F6D06F]/70 group-hover/sidebar:text-[#F6D06F]"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                      ),
                    }}
                    className={cn(
                      "group/sidebar relative flex w-full items-center rounded-2xl py-3 text-sm font-medium transition-all duration-300",
                      computedOpen
                        ? "px-3 justify-start"
                        : "px-0 justify-center",
                      isActive
                        ? "bg-[rgba(246,208,111,0.18)] text-white shadow-[0_18px_50px_rgba(246,208,111,0.25)]"
                        : "text-[#E8D9B4]/80 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.route);
                    }}
                  />
                );
              })}
            </div>

            <div
              className={cn(
                "relative mt-auto space-y-4 pt-6 transition-all duration-300",
                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#F6C667] to-[#D4AF37] text-[#231604] text-lg font-semibold shadow-[0_10px_25px_rgba(246,208,111,0.3)]">
                    {userInitial}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">
                      {currentUser?.username ?? "Tài khoản Nutrien"}
                    </p>
                    <p className="text-xs text-[#E9D9B7]/70">
                      {currentUser?.email ?? "Đăng nhập để đồng bộ dữ liệu"}
                    </p>
                  </div>
                </div>
                <IconUserBolt className="hidden h-5 w-5 text-[#F6D06F] lg:block" />
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F7D57A] via-[#F3C24D] to-[#D4AF37] px-3 py-2 text-sm font-semibold text-[#251804] shadow-[0_18px_45px_rgba(246,208,111,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_22px_60px_rgba(246,208,111,0.45)]"
                onClick={() => {
                  dispatch(logout());
                  navigate(ROUTES.LOGIN);
                }}
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </SidebarBody>
      </AnimatedSidebar>
    </aside>
  );
}
