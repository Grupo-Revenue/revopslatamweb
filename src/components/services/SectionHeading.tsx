import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string | React.ReactNode;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  align?: "center" | "left";
  light?: boolean;
  /** Index of word in title to highlight with brand gradient (0-based). Only works with string titles. */
  highlightWord?: number;
}

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.5, delay: d, ease: "easeOut" as const },
});

const SectionHeading = ({
  title,
  subtitle,
  badge,
  badgeColor = "#BE1869",
  badgeBg = "rgba(190,24,105,0.08)",
  align = "center",
  light = false,
}: SectionHeadingProps) => {
  const textAlign = align === "center" ? "text-center" : "text-left";
  const mx = align === "center" ? "mx-auto" : "";

  return (
    <div className={`${textAlign} mb-14`}>
      {badge && (
        <motion.span
          {...fadeUp()}
          className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-5"
          style={{ background: badgeBg, color: badgeColor }}
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        {...fadeUp(0.05)}
        className={`font-bold leading-tight ${mx}`}
        style={{
          fontSize: "clamp(28px, 4vw, 42px)",
          color: light ? "#fff" : "#1A1A2E",
          maxWidth: align === "center" ? 700 : undefined,
        }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          {...fadeUp(0.1)}
          className={`mt-4 text-base sm:text-lg leading-relaxed ${mx}`}
          style={{
            color: light ? "rgba(255,255,255,0.65)" : "#6B7280",
            maxWidth: 560,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
