import SplitText from "@/components/ui/SplitText";
import { clsx } from "clsx";

interface Props {
  mode: boolean;
  logoSrc: string;
  heading: string;
  subheading: string;
}

export default function RegisterHeader({
  mode,
  logoSrc,
  heading,
  subheading,
}: Props) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-6 flex justify-center">
        <img
          src={logoSrc}
          alt="Nutrium"
          className={clsx(
            "h-14 w-auto transition-transform duration-300 hover:scale-105 ",
            mode
              ? "drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]"
              : "drop-shadow-lg"
          )}
        />
      </div>
      <h1
        className={`text-3xl font-semibold ${
          mode ? "text-[#E8C971]" : "text-slate-900"
        }`}
      >
        {heading}
      </h1>
      <p
        className={`mt-3 text-sm ${
          mode ? "text-[#C9C9CF]" : "text-slate-500"
        }`}
      >
        {mode ? (
          <SplitText
            text={subheading}
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        ) : (
          <>{subheading}</>
        )}
      </p>
    </div>
  );
}
