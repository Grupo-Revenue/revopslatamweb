import { motion } from "framer-motion";
import React from "react";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

interface ServiceCardProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "featured" | "elevated";
  hoverBorder?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.5, delay: d, ease: "easeOut" as const },
});

const ServiceCard = ({
  children,
  variant = "default",
  hoverBorder,
  delay = 0,
  className = "",
  style = {},
}: ServiceCardProps) => {
  const baseStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 20,
      padding: "36px",
      ...style,
    },
    glass: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: "36px",
      backdropFilter: "blur(12px)",
      ...style,
    },
    featured: {
      background: "#fff",
      borderRadius: 20,
      padding: "40px 36px",
      borderTop: "3px solid transparent",
      borderImage: `${GRADIENT} 1`,
      boxShadow: "0 20px 60px rgba(190,24,105,0.12)",
      ...style,
    },
    elevated: {
      background: "#fff",
      border: "1px solid transparent",
      borderRadius: 20,
      padding: "36px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 12px 40px rgba(190,24,105,0.06)",
      ...style,
    },
  };

  const hoverShadow =
    variant === "featured"
      ? "0 24px 70px rgba(190,24,105,0.18)"
      : variant === "elevated"
      ? "0 20px 50px rgba(190,24,105,0.14)"
      : variant === "glass"
      ? "0 16px 48px rgba(0,0,0,0.2)"
      : "0 8px 32px rgba(0,0,0,0.08)";

  return (
    <motion.div
      {...fadeUp(delay)}
      className={`transition-all duration-300 ${className}`}
      style={baseStyles[variant]}
      whileHover={{
        y: variant === "elevated" ? -8 : -6,
        boxShadow: hoverShadow,
        ...(hoverBorder ? { borderColor: hoverBorder } : {}),
      }}
    >
      {children}
    </motion.div>
  );
};

export default ServiceCard;
