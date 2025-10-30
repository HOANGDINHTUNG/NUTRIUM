import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  src?: string;
  active?: boolean;
  shouldPlay?: boolean;
  overlayDark?: boolean;
  preload?: "none" | "metadata" | "auto";
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
  children?: ReactNode;
  /** Khi true, wrapper sẽ absolute inset-0 để làm nền trong container cha */
  fill?: boolean;
};

export default function VideoBackground({
  src,
  active = false,
  shouldPlay = false,
  overlayDark = true,
  preload = "metadata",
  overlayColor = "#000",
  overlayOpacity = 0.45,
  className,
  children,
  fill = false,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (!shouldPlay || !src || !active) {
      v.pause();
      return;
    }

    const run = async () => {
      try {
        await v.play();
      } catch {
        // một số trình duyệt vẫn đòi user gesture
      }
    };
    run();
  }, [shouldPlay, src, active]);

  const wrapperStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : { position: "relative", width: "100%", height: "100%" };

  return (
    <div className={className} style={wrapperStyle}>
      {active && src ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <video
            ref={ref}
            key={src}
            src={src}
            muted
            loop
            playsInline
            preload={preload}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {overlayDark && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: overlayColor,
                opacity: overlayOpacity,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      ) : null}

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
