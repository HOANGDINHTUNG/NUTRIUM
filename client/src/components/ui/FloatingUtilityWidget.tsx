import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { Languages, Moon, Settings2, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hook/UseCustomeRedux";
import { toggleMode } from "../../stores/slices/darkModelSlice";
import { toggleLanguage } from "../../stores/slices/languageSlice";

const EDGE_PADDING = 16;
const DRAG_THRESHOLD = 4;

const FloatingUtilityWidget = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.darkMode.mode);
  const language = useAppSelector((state) => state.language.language);

  const widgetRef = useRef<HTMLDivElement>(null);
  const pointerActiveRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const [position, setPosition] = useState({
    x: EDGE_PADDING,
    y: EDGE_PADDING,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyInitialPosition = () => {
      const node = widgetRef.current;
      if (!node) return;
      setPosition({
        x: EDGE_PADDING,
        y: EDGE_PADDING,
      });
    };
    applyInitialPosition();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!isExpanded) return;
    const handlePointerOutside = (event: Event) => {
      if (!widgetRef.current) return;
      if (widgetRef.current.contains(event.target as Node)) return;
      setIsExpanded(false);
    };

    window.addEventListener("mousedown", handlePointerOutside);
    window.addEventListener("touchstart", handlePointerOutside);
    return () => {
      window.removeEventListener("mousedown", handlePointerOutside);
      window.removeEventListener("touchstart", handlePointerOutside);
    };
  }, [isExpanded]);

  const clampToViewport = (desiredX: number, desiredY: number) => {
    if (typeof window === "undefined") {
      return { x: desiredX, y: desiredY };
    }
    const node = widgetRef.current;
    const rect = node?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;
    const maxX = window.innerWidth - width - EDGE_PADDING;
    const maxY = window.innerHeight - height - EDGE_PADDING;
    return {
      x: Math.min(
        Math.max(desiredX, EDGE_PADDING),
        Math.max(maxX, EDGE_PADDING)
      ),
      y: Math.min(
        Math.max(desiredY, EDGE_PADDING),
        Math.max(maxY, EDGE_PADDING)
      ),
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    pointerActiveRef.current = true;
    hasDraggedRef.current = false;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerActiveRef.current) return;
    const deltaX = event.clientX - pointerStartRef.current.x;
    const deltaY = event.clientY - pointerStartRef.current.y;
    if (!hasDraggedRef.current) {
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < DRAG_THRESHOLD) return;
      hasDraggedRef.current = true;
      setIsExpanded(false);
    }
    const desiredX = event.clientX - dragOffsetRef.current.x;
    const desiredY = event.clientY - dragOffsetRef.current.y;
    setPosition(clampToViewport(desiredX, desiredY));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!hasDraggedRef.current) {
      setIsExpanded((prev) => !prev);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const renderContent = () => (
    <div
      ref={widgetRef}
      className="fixed z-50 select-none"
      style={{ top: position.y, left: position.x }}
    >
      <div
        className={`flex flex-col items-center transition-all duration-200 ${
          isExpanded ? "gap-3" : ""
        }`}
      >
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-200 ${
            isExpanded
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={() => dispatch(toggleMode())}
            className={clsx(
              "h-11 w-11 rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105  focus-visible:outline-none focus-visible:ring-2 ",
              isDarkMode
                ? "hover:text-yellow-600 focus-visible:ring-yellow-400"
                : "hover:text-emerald-600 focus-visible:ring-emerald-400"
            )}
            aria-label={
              isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
            }
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 mx-auto" />
            ) : (
              <Moon className="h-5 w-5 mx-auto" />
            )}
          </button>
          <button
            type="button"
            onClick={() => dispatch(toggleLanguage())}
            className={clsx(
              "h-11 w-11 rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-black/5 transition-transform duration-200 hover:scale-105  focus-visible:outline-none focus-visible:ring-2 ",
              isDarkMode
                ? "hover:text-yellow-600 focus-visible:ring-yellow-400"
                : "hover:text-emerald-600 focus-visible:ring-emerald-400"
            )}
            aria-label="Thay đổi ngôn ngữ"
          >
            <Languages className="h-5 w-5 mx-auto" />
            <span className="sr-only">
              {language === "vi"
                ? "Ngôn ngữ hiện tại: Tiếng Việt"
                : "Current language: English"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={[
            "relative h-14 w-14 rounded-full backdrop-blur-md shadow-xl ring-1 transition-all duration-200",
            "focus-visible:outline-none",
            // DARK MODE → nút vàng, chữ đen, ring vàng
            isDarkMode
              ? "bg-[#D4AF37] text-black ring-amber-300/30 focus-visible:ring-2 focus-visible:ring-amber-400 hover:scale-105"
              : // LIGHT MODE → giữ nguyên logic cũ emerald
              isExpanded
              ? "bg-emerald-500 text-white ring-black/10 scale-100 opacity-100 focus-visible:ring-2 focus-visible:ring-emerald-400"
              : "bg-white/70 text-emerald-600 ring-black/10 opacity-70 hover:opacity-100 hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-400",
          ].join(" ")}
          aria-expanded={isExpanded}
          aria-label="Mở bảng điều khiển"
        >
          <Settings2 className="h-6 w-6 mx-auto" />
        </button>

        <span
          className={[
            "mt-1 text-xs font-semibold transition-opacity duration-200",
            isExpanded ? "opacity-100" : "opacity-0",
            isDarkMode ? "text-amber-400" : "text-emerald-600",
          ].join(" ")}
        >
          {language.toUpperCase()}
        </span>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(renderContent(), document.body);
};

export default FloatingUtilityWidget;
