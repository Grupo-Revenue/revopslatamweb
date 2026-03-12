import { ArrowRight } from "lucide-react";
import { useCTAStyles, ctaStyleToCSS } from "@/hooks/useCTAStyles";

type Props = {
  styleKey?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders a button using a CTA style from the DB.
 * Falls back to a default styled button if no styleKey or not found.
 */
export default function DynamicCTA({ styleKey, children, onClick, className = "", style: inlineStyle }: Props) {
  const { getStyleByKey } = useCTAStyles();
  const ctaStyle = getStyleByKey(styleKey);
  const styles = ctaStyle?.styles;

  if (!styles) {
    // Fallback: render as a basic styled button
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 font-semibold transition-all duration-300 ${className}`}
        style={inlineStyle}
      >
        {children}
      </button>
    );
  }

  const css = ctaStyleToCSS(styles);
  const hoverScale = styles.hoverScale ? parseFloat(styles.hoverScale) : undefined;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 font-semibold transition-all duration-300 cursor-pointer ${className}`}
      style={{ ...css, justifyContent: styles.textAlign === "center" ? "center" : styles.textAlign === "right" ? "flex-end" : undefined }}
      onMouseEnter={(e) => {
        if (hoverScale) e.currentTarget.style.transform = `scale(${hoverScale})`;
        if (styles.hoverBgColor) e.currentTarget.style.backgroundColor = styles.hoverBgColor;
        if (styles.hoverTextColor) e.currentTarget.style.color = styles.hoverTextColor;
        if (styles.hoverBorderColor) e.currentTarget.style.borderColor = styles.hoverBorderColor;
      }}
      onMouseLeave={(e) => {
        if (hoverScale) e.currentTarget.style.transform = "scale(1)";
        if (styles.hoverBgColor) e.currentTarget.style.backgroundColor = styles.bgColor || "";
        if (styles.hoverTextColor) e.currentTarget.style.color = styles.textColor || "";
        if (styles.hoverBorderColor) e.currentTarget.style.borderColor = styles.borderColor || "";
      }}
    >
      {children}
      {styles.hasIcon && <ArrowRight size={18} />}
    </button>
  );
}
