import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundOrbs from "./BackgroundOrbs";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

interface ServiceHeroProps {
  breadcrumbs: { label: string; to?: string }[];
  badge: string;
  badgeStyle?: React.CSSProperties;
  title: string | React.ReactNode;
  subtitle: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  rightContent?: React.ReactNode;
  centered?: boolean;
  minHeight?: string;
  stats?: React.ReactNode;
}

const ServiceHero = ({
  breadcrumbs,
  badge,
  badgeStyle,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  rightContent,
  centered = false,
  minHeight = "90vh",
  stats,
}: ServiceHeroProps) => {
  const defaultBadgeStyle: React.CSSProperties = badgeStyle || {
    background: GRADIENT,
    color: "#fff",
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)", minHeight }}
    >
      <BackgroundOrbs variant="hero" />

      <div
        className={`relative z-10 mx-auto max-w-[1200px] px-6 pt-36 pb-24 ${
          centered
            ? "flex flex-col items-center text-center justify-center"
            : "grid lg:grid-cols-[55%_45%] gap-12 items-center"
        }`}
        style={{ minHeight }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={centered ? "max-w-[680px]" : ""}
        >
          {/* Breadcrumbs */}
          <div className={`flex items-center gap-2 text-xs text-white/40 mb-6 ${centered ? "justify-center" : ""}`}>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={12} />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white/60 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/70">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>

          {/* Badge */}
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-6"
            style={defaultBadgeStyle}
          >
            {badge}
          </span>

          {/* Title */}
          <h1
            className="font-bold text-white leading-[1.08] mb-6"
            style={{ fontSize: "clamp(40px, 5vw, 62px)" }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-[19px] leading-relaxed mb-10 ${centered ? "mx-auto" : ""}`}
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap items-center gap-4 ${centered ? "justify-center" : ""}`}>
            {primaryCta && (
              <button
                onClick={primaryCta.onClick}
                className="text-[15px] font-semibold text-white px-8 py-4 rounded-full transition-all hover:scale-[1.03]"
                style={{
                  background: GRADIENT,
                  boxShadow: "0 4px 20px rgba(190,24,105,0.35)",
                }}
              >
                {primaryCta.label}
              </button>
            )}
            {secondaryCta && (
              <button
                onClick={secondaryCta.onClick}
                className="text-[15px] font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                {secondaryCta.label}
              </button>
            )}
          </div>

          {/* Stats */}
          {stats && <div className="mt-12">{stats}</div>}
        </motion.div>

        {/* Right content */}
        {rightContent && !centered && (
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {rightContent}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServiceHero;
