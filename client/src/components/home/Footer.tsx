import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useMemo } from "react";
import clsx from "clsx";

const floatingShapes = [
  "bg-gradient-to-br from-[#F7D794]/40 via-[#FDF3D3]/25 to-transparent",
  "bg-gradient-to-br from-[#D4AF37]/35 via-[#F9E7BB]/25 to-transparent",
  "bg-gradient-to-br from-[#F6C667]/30 via-[#FFF5DB]/20 to-transparent",
];

type FooterProps = {
  isCompact?: boolean;
};

export default function Footer({ isCompact = false }: FooterProps) {
  const contactDetails = useMemo(
    () => [
      { icon: MapPin, label: "Trụ sở", value: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" },
      { icon: Phone, label: "Hotline", value: "1900 7070" },
      { icon: Mail, label: "Email", value: "contact@nutrien.vn" },
      { icon: Clock, label: "Giờ làm việc", value: "Thứ 2 - Thứ 6: 8h00 - 18h00" },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      { icon: Facebook, label: "Facebook", href: "#" },
      { icon: Instagram, label: "Instagram", href: "#" },
      { icon: Youtube, label: "YouTube", href: "#" },
    ],
    []
  );

  return (
    <footer
      className="
        relative overflow-hidden px-6 pb-14 pt-20 text-[#F7F3E9]
        max-[920px]:px-4 max-[920px]:pt-12 max-[920px]:pb-10
      "
    >
      <style>
        {`
          @keyframes footerFloat {
            0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
            50% { transform: translate3d(18px, -22px, 0) scale(1.06); opacity: 0.9; }
            100% { transform: translate3d(-12px, 16px, 0) scale(1); opacity: 0.5; }
          }
          @keyframes footerShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .footer-floating {
            animation: footerFloat 12s ease-in-out infinite;
          }
          .footer-shimmer {
            background-size: 200% 200%;
            animation: footerShimmer 22s ease infinite;
          }
        `}
      </style>

      {/* overlay radial */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(247,215,148,0.22)_0%,_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.18)_0%,_transparent_70%)]" />

      {/* floating shapes (ẩn bớt ở < 920px) */}
      {floatingShapes.map((gradient, index) => (
        <div
          key={index}
          className={`
            footer-floating pointer-events-none absolute -top-28 h-60 w-60 rounded-full blur-3xl ${gradient}
            max-[920px]:hidden
          `}
          style={{ left: `${12 + index * 30}%`, animationDelay: `${index * 2.5}s` }}
        />
      ))}

      <div
        className="
          relative mx-auto max-w-6xl rounded-[32px] border border-[#F6D8A6]/25
          bg-gradient-to-br from-white/20 via-white/10 to-white/20 p-[1px]
          shadow-[0_45px_120px_rgba(12,10,6,0.58)] backdrop-blur-xl

          max-[920px]:rounded-2xl max-[920px]:p-[0.5px]
        "
      >
        <div
          className="
            footer-shimmer rounded-[32px]
            bg-[linear-gradient(140deg,_rgba(22,18,11,0.94)_0%,_rgba(34,26,16,0.9)_45%,_rgba(18,13,8,0.96)_100%)]
            p-10

            max-[920px]:rounded-2xl max-[920px]:p-5
          "
        >
          <div
            className={clsx(
              "flex flex-col gap-10 max-[920px]:gap-8",
              !isCompact && "lg:flex-row lg:items-start lg:justify-between"
            )}
          >
            {/* Left copy */}
            <div className="max-w-lg space-y-6 max-[920px]:max-w-none max-[920px]:text-center">
              <div
                className="
                  inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10
                  px-4 py-2 text-xs uppercase tracking-[0.4em] text-[#F7E8C3]
                  max-[920px]:mx-auto
                "
              >
                <Sparkles className="h-4 w-4 text-[#F5D06F]" />
                Nutrien Vision
              </div>

              <h3
                className="
                  text-3xl font-light leading-snug text-white md:text-4xl
                  max-[920px]:text-2xl
                "
              >
                Dinh dưỡng thông minh, lan tỏa giá trị sống khỏe mỗi ngày.
              </h3>

              <p
                className="
                  max-w-lg text-sm text-[#F5EEDC]/80
                  max-[920px]:mx-auto max-[920px]:max-w-prose max-[920px]:text-[13px]
                "
              >
                Chúng tôi kết nối nguồn dữ liệu thực phẩm chuẩn hóa với trải nghiệm cá nhân hóa,
                biến việc chăm sóc sức khỏe dinh dưỡng trở nên hiện đại và giàu cảm hứng hơn bao giờ hết.
              </p>
            </div>

            {/* Right columns */}
            <div
              className={clsx(
                "grid flex-1 grid-cols-2 gap-8 max-[920px]:gap-6 max-[920px]:w-full",
                !isCompact && "sm:grid-cols-2"
              )}
            >
              {/* contact */}
              <div className="space-y-5 max-[920px]:space-y-4">
                <p
                  className="
                    text-sm font-semibold uppercase tracking-[0.35em] text-[#E8D8B4]/70
                    max-[920px]:text-center
                  "
                >
                  Liên hệ
                </p>
                <ul
                  className="
                    space-y-5 text-sm text-[#FBF1DC]/90
                    max-[920px]:space-y-3
                  "
                >
                  {contactDetails.map(({ icon: Icon, label, value }) => (
                    <li
                      key={label}
                      className="
                        group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08]
                        px-4 py-3 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.14]
                        max-[920px]:px-3 max-[920px]:py-2.5
                      "
                    >
                      <span
                        className="
                          mt-1 inline-flex rounded-full bg-[#F8E0A5]/10 p-2 text-[#F6D06F]
                          transition duration-300 group-hover:bg-[#F6D06F]/20 group-hover:text-[#F8E8CF]
                          max-[920px]:p-1.5
                        "
                      >
                        <Icon className="h-4 w-4 max-[920px]:h-3.5 max-[920px]:w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wide text-[#E6D3AE]/80 max-[920px]:text-[11px]">
                          {label}
                        </p>
                        <p className="font-medium text-white max-[920px]:text-[13px]">
                          {value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* social + promo */}
              <div className="space-y-5 max-[920px]:space-y-4">
                <p
                  className="
                    text-sm font-semibold uppercase tracking-[0.35em] text-[#E8D8B4]/70
                    max-[920px]:text-center
                  "
                >
                  Kết nối cộng đồng
                </p>

                <ul className="space-y-3 text-sm text-[#FBF1DC]/90 max-[920px]:space-y-2.5">
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="
                          group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08]
                          px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.16]
                          max-[920px]:px-3 max-[920px]:py-2.5
                        "
                      >
                        <span className="flex items-center gap-3">
                          <span className="inline-flex rounded-full bg-white/15 p-2 text-white transition group-hover:bg-white/25 max-[920px]:p-1.5">
                            <Icon className="h-4 w-4 max-[920px]:h-3.5 max-[920px]:w-3.5" />
                          </span>
                          <span className="font-medium max-[920px]:text-[13px]">{label}</span>
                        </span>
                        <span
                          className="
                            text-xs uppercase tracking-[0.4em] text-[#E6D3AE]/80 transition group-hover:text-[#F6D06F]
                            max-[920px]:tracking-[0.3em] max-[920px]:text-[11px]
                          "
                        >
                          Theo dõi
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div
                  className="
                    rounded-2xl border border-[#F6D06F]/40 bg-[#F5D06F]/15 px-5 py-4 text-sm text-[#FDF3D3]
                    max-[920px]:px-4 max-[920px]:py-3 max-[920px]:text-[13px]
                  "
                >
                  <p className="font-medium uppercase tracking-[0.4em] text-[#F8E7C1] max-[920px]:tracking-[0.3em] max-[920px]:text-[12px]">
                    Tháng trải nghiệm
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#F7EDD2]/80 max-[920px]:text-[11.5px]">
                    Đăng ký tài khoản mới trong tháng này để nhận gói tư vấn dinh dưỡng 1-1 cùng
                    chuyên gia hoàn toàn miễn phí.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div
            className={clsx(
              "mt-12 flex flex-col gap-4 border-t border-white/[0.12] pt-6 text-xs text-[#EAD9B8]/80 max-[920px]:mt-8 max-[920px]:gap-3 max-[920px]:text-[11.5px]",
              !isCompact && "sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <p
              className={clsx(
                "max-[920px]:text-center",
                isCompact && "text-center"
              )}
            >
              &copy; {new Date().getFullYear()} Nutrien Labs. All rights reserved.
            </p>
            <div
              className={clsx(
                "flex flex-wrap gap-y-2 max-[920px]:justify-center max-[920px]:gap-x-4",
                isCompact ? "justify-center gap-x-4" : "gap-x-6"
              )}
            >
              <a href="#" className="transition hover:text-[#F6D06F]">Điều khoản sử dụng</a>
              <a href="#" className="transition hover:text-[#F6D06F]">Chính sách bảo mật</a>
              <a href="#" className="transition hover:text-[#F6D06F]">Tư vấn chuyên gia</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
