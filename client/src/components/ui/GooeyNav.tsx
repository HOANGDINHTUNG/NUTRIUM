"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

/* --------------------------------- Motion --------------------------------- */
const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

/* ----------------------------- Small components ---------------------------- */
type HoveredLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};
export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </a>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  href: string;
  src: string;
};
export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <a href={href} className="flex space-x-3 no-underline">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-base font-semibold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[11rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

type MenuProps = {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
};
export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-2xl border border-transparent dark:bg-black dark:border-white/20 bg-white/95 shadow-input flex justify-center gap-6 px-6 py-5"
    >
      {children}
    </nav>
  );
};

type MenuItemProps = {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
};
export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  children,
}) => {
  const isOpen = active === item;
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.2 }}
        className="cursor-pointer text-black dark:text-white/95 hover:opacity-90 text-sm font-medium"
      >
        {item}
      </motion.p>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={transition}
            className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 pt-3"
          >
            <motion.div
              transition={transition}
              layoutId="active"
              className="bg-white dark:bg-neutral-900/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xl"
            >
              <motion.div layout className="w-max h-full p-4">
                {children}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --------------------------------- GooeyNav -------------------------------- */
interface GooeyNavItem {
  label: string;
  href: string;
  dropdown?: React.ReactNode;
  /** optional: min width cho panel dropdown */
  panelMinWidth?: number;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  // dropdown hover state & panel position
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [panelPos, setPanelPos] = useState<{
    left: number;
    top: number;
    width: number;
    center: number;
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isInitialRender = useRef(true);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            /* noop */
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    } as React.CSSProperties;
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const runActiveAnimation = (element: HTMLElement, shouldAnimate: boolean) => {
    updateEffectPosition(element);
    if (!textRef.current) return;
    textRef.current.classList.add("active");
    if (!shouldAnimate) return;

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current?.removeChild(p));
    }
    textRef.current.classList.remove("active");
    void textRef.current.offsetWidth;
    textRef.current.classList.add("active");
    if (filterRef.current) makeParticles(filterRef.current);
  };

  // sync active by URL
  useEffect(() => {
    const currentIndex = items.findIndex(
      (item) => item.href === location.pathname
    );
    if (currentIndex !== -1 && currentIndex !== activeIndex)
      setActiveIndex(currentIndex);
  }, [items, location.pathname, activeIndex]);

  // animate on active change
  useEffect(() => {
    if (!navRef.current) return;
    const anchors = navRef.current.querySelectorAll("a");
    const current = anchors[activeIndex] as HTMLElement | undefined;
    if (!current) return;
    runActiveAnimation(current, !isInitialRender.current);
    if (isInitialRender.current) isInitialRender.current = false;
  }, [activeIndex, items]);

  // dropdown panel positioning helpers
  const setPanelForLi = (liEl: HTMLElement) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const liRect = liEl.getBoundingClientRect();
    setPanelPos({
      left: liRect.left - containerRect.left,
      top: liRect.bottom - containerRect.top + 8,
      width: liRect.width,
      center: liRect.left - containerRect.left + liRect.width / 2,
    });
  };

  const handleEnter = (index: number, liEl: HTMLElement) => {
    setHoverIndex(index);
    setPanelForLi(liEl);
  };
  const handleLeave = () => setHoverIndex(null);

  // click/keyboard
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string
  ) => {
    e.preventDefault();
    if (activeIndex !== index) setActiveIndex(index);
    else runActiveAnimation(e.currentTarget, true);
    navigate(href);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
    href: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIndex !== index) setActiveIndex(index);
      else runActiveAnimation(e.currentTarget as unknown as HTMLElement, true);
      navigate(href);
    }
  };

  // update dropdown panel position on resize
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (hoverIndex == null) return;
      const li = navRef.current!.querySelectorAll("li")[hoverIndex] as
        | HTMLElement
        | undefined;
      if (li) setPanelForLi(li);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [hoverIndex]);

  return (
    <>
      <style>{`
        :root { --linear-ease: linear(0, .068, .19 2.7%, .804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, .996 28%, .949, .928 33.3%, .926, .933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, .995 68%, 1.001 85%, 1); }
        .effect { position:absolute; opacity:1; pointer-events:none; display:grid; place-items:center; z-index:1; }
        .effect.text { color:white; transition:color .3s ease; }
        .effect.text.active { color:black; }
        .effect.filter { filter: blur(7px) contrast(100) blur(0); mix-blend-mode: normal; }
        .effect.filter::before { content:""; position:absolute; inset:-75px; z-index:-2; background: radial-gradient(circle, rgba(255,255,255,.14) 0%, rgba(255,255,255,.04) 60%, transparent 100%); }
        .effect.filter::after { content:""; position:absolute; inset:0; background:white; transform:scale(0); opacity:0; z-index:-1; border-radius:9999px; }
        .effect.active::after { animation: pill .3s ease both; }
        @keyframes pill { to { transform: scale(1); opacity: 1; } }
        .particle, .point { display:block; opacity:0; width:20px; height:20px; border-radius:9999px; transform-origin:center; }
        .particle { --time:5s; position:absolute; top:calc(50% - 8px); left:calc(50% - 8px); animation: particle calc(var(--time)) ease 1 -350ms; }
        .point { background: var(--color); opacity:1; animation: point calc(var(--time)) ease 1 -350ms; }
        @keyframes particle {
          0% { transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y))); opacity:1; animation-timing-function:cubic-bezier(.55,0,1,.45); }
          70%{ transform: rotate(calc(var(--rotate)*.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity:1; animation-timing-function:ease;}
          85%{ transform: rotate(calc(var(--rotate)*.66)) translate(calc(var(--end-x)), calc(var(--end-y))); opacity:1;}
          100%{ transform: rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*.5), calc(var(--end-y)*.5)); opacity:1;}
        }
        @keyframes point {
          0% { transform: scale(0); opacity:0; animation-timing-function:cubic-bezier(.55,0,1,.45); }
          25% { transform: scale(calc(var(--scale)*.25)); }
          38% { opacity:1; }
          65% { transform: scale(var(--scale)); opacity:1; animation-timing-function:ease; }
          85% { transform: scale(var(--scale)); opacity:1; }
          100% { transform: scale(0); opacity:0; }
        }
        li.active { color:black; text-shadow:none; }
        li.active::after { opacity:1; transform:scale(1); }
        li::after { content:""; position:absolute; inset:0; border-radius:8px; background:white; opacity:0; transform:scale(0); transition:all .3s ease; z-index:-1; }

        /* GOLD theme for items */
        .gn-item-active {
          border-color: transparent;
          background-image: linear-gradient(to bottom right, #F7D57A, #FFEFC4, #F6C95A);
          color: #231406;
          box-shadow: 0 18px 45px rgba(246,208,111,.45);
          outline: 1px solid rgba(246,208,111,.6);
          background-size: 200% 200%;
          animation: goldShimmer 12s ease infinite;
        }
        .gn-item {
          border: 1px solid rgba(247,213,122,.3);
          background: rgba(26,19,8,.8);
          color: rgba(232,216,177,.85);
        }
        .gn-item:hover {
          border-color: rgba(246,208,111,.7);
          color: #F6D06F;
          background: rgba(26,19,8,.9);
          box-shadow: 0 10px 35px rgba(246,208,111,.25);
        }
        .gn-item:focus-within { outline: 2px solid rgba(246,208,111,.7); outline-offset: 0; }

        @keyframes goldShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        /* Dropdown panel theme */
        .gn-panel {
          background: rgba(20, 22, 27, .9);
          border: 1px solid rgba(246,208,111,.25);
          box-shadow: 0 22px 60px rgba(246,208,111,.15);
          backdrop-filter: blur(10px);
        }
      `}</style>

      <div className="relative" ref={containerRef} onMouseLeave={handleLeave}>
        <nav
          className="flex relative"
          style={{ transform: "translate3d(0,0,0.01px)" }}
        >
          <ul
            ref={navRef}
            className="flex gap-4 md:gap-8 list-none p-0 px-4 m-0 relative z-[3]"
            style={{
              color: "white",
              textShadow: "0 1px 1px hsl(205deg 30% 10% / 0.2)",
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`group rounded-full relative cursor-pointer transition-all duration-300 ease-out ${
                  activeIndex === index ? "gn-item-active" : "gn-item"
                }`}
                onMouseEnter={(e) => {
                  const liEl = e.currentTarget as HTMLElement;
                  if (item.dropdown) handleEnter(index, liEl);
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, index, item.href)}
                  onKeyDown={(e) => handleKeyDown(e, index, item.href)}
                  className="outline-none py-[0.6em] px-[1em] inline-block rounded-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* gooey particles + active text overlay */}
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />

        {/* Motion dropdown panel (canh giữa theo tâm nút) */}
        <AnimatePresence>
          {hoverIndex != null && items[hoverIndex]?.dropdown && panelPos && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={transition}
              className="absolute z-[5] rounded-2xl p-4 md:p-5"
              style={{
                top: panelPos.top,
                left: panelPos.center,
                transform: "translateX(-50%)",
                minWidth: Math.max(
                  items[hoverIndex].panelMinWidth ?? 280,
                  panelPos.width
                ),
              }}
              onMouseEnter={() => setHoverIndex(hoverIndex)}
              onMouseLeave={handleLeave}
            >
              <div className="gn-panel rounded-2xl">
                <div className="p-3 md:p-4">{items[hoverIndex].dropdown}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default GooeyNav;

/* ---------------------------------- Demo ---------------------------------- */
export const ExampleGooeyNav: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  const items: GooeyNavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Products",
      href: "/products",
      dropdown: (
        <Menu setActive={setActive}>
          <MenuItem item="AI Suite" active={active} setActive={setActive}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProductItem
                title="Vector DB"
                description="Embeddings store with hybrid search."
                href="#"
                src="https://picsum.photos/seed/vdb/300/160"
              />
              <ProductItem
                title="Reranker"
                description="Re-rank results for quality."
                href="#"
                src="https://picsum.photos/seed/rerank/300/160"
              />
              <ProductItem
                title="Agents"
                description="Composable tools with memory."
                href="#"
                src="https://picsum.photos/seed/agents/300/160"
              />
              <ProductItem
                title="Eval Kit"
                description="Measure quality & regressions."
                href="#"
                src="https://picsum.photos/seed/eval/300/160"
              />
            </div>
          </MenuItem>
          <MenuItem item="Resources" active={active} setActive={setActive}>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2 min-w-40">
                <p className="text-xs uppercase tracking-wider text-neutral-400">
                  Docs
                </p>
                <HoveredLink href="#">Quickstart</HoveredLink>
                <HoveredLink href="#">API Reference</HoveredLink>
                <HoveredLink href="#">Guides</HoveredLink>
              </div>
              <div className="flex flex-col gap-2 min-w-40">
                <p className="text-xs uppercase tracking-wider text-neutral-400">
                  Community
                </p>
                <HoveredLink href="#">Discord</HoveredLink>
                <HoveredLink href="#">Github</HoveredLink>
                <HoveredLink href="#">Showcase</HoveredLink>
              </div>
            </div>
          </MenuItem>
        </Menu>
      ),
      panelMinWidth: 520,
    },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="w-full flex justify-center py-10 bg-neutral-950">
      <GooeyNav items={items} />
    </div>
  );
};
