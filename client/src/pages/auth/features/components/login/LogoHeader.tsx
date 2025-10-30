import SplitText from "@/components/ui/SplitText";
import { logo, logo_medium } from "../../../../../export/exportImage";
import { useAppSelector } from "../../../../../hook/UseCustomeRedux";
import { authTranslations } from "../../../utils/i18n/authTranslations";
import { clsx } from "clsx";

export default function LogoHeader({ mode }: { mode: boolean }) {
  const language = useAppSelector((s) => s.language.language);
  const { login: loginCopy } = authTranslations[language];
  return (
    <div className="mb-10 text-center">
      <div className="mb-6 flex justify-center">
        <img
          src={mode ? logo_medium : logo}
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
        className={`text-3xl font-semibold transition-colors duration-500 ${
          mode ? "text-[#E8C971]" : "text-slate-900"
        }`}
      >
        {loginCopy.heading}
      </h1>
      <p
        className={`mt-3 text-sm transition-colors duration-500 ${
          mode ? "text-[#C9C9CF]" : "text-slate-500"
        }`}
      >
        {mode ? (
          <SplitText
            text={loginCopy.subheading}
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
          <>{loginCopy.subheading}</>
        )}
      </p>
    </div>
  );
}
