type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <h2 className={`text-2xl text-gray-600 text-center mb-6 ${className}`}>
      {children}
    </h2>
  );
}
