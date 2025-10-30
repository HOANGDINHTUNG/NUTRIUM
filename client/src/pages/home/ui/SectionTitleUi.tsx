type SectionTitleProps = { children: React.ReactNode; className?: string };

export default function SectionTitleUi({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <h2
      className={`text-center mb-6 text-2xl md:text-[26px] font-bold tracking-wide
                  bg-gradient-to-br from-[#EBD7A0] via-[#D8B86C] to-[#8A6B2E]
                  bg-clip-text text-transparent
                  drop-shadow-[0_3px_10px_rgba(201,168,93,.25)]
                  ${className}`}
    >
      {children}
    </h2>
  );
}
