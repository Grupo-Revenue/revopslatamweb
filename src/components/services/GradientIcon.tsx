import { type LucideIcon } from "lucide-react";

/**
 * GradientIcon — Lucide icon inside a gradient circle.
 * Replaces emoji icons for a premium, consistent look.
 */
interface GradientIconProps {
  icon: LucideIcon;
  /** Size of the circle container */
  size?: number;
  /** Size of the icon inside */
  iconSize?: number;
  /** Gradient string or solid color for the circle bg */
  gradient?: string;
  /** Icon color */
  iconColor?: string;
  className?: string;
}

const GradientIcon = ({
  icon: Icon,
  size = 48,
  iconSize = 22,
  gradient = "linear-gradient(135deg, #BE1869, #6224BE)",
  iconColor = "#fff",
  className = "",
}: GradientIconProps) => (
  <div
    className={`flex-shrink-0 rounded-2xl flex items-center justify-center ${className}`}
    style={{
      width: size,
      height: size,
      background: gradient,
      boxShadow: "0 4px 16px rgba(190,24,105,0.2)",
    }}
  >
    <Icon size={iconSize} color={iconColor} strokeWidth={1.8} />
  </div>
);

export default GradientIcon;
