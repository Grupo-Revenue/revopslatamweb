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
 * Strip Tailwind utility classes that would conflict with DB-driven CTA styles.
 * We remove color, bg, text-size, padding, rounded, shadow, border, and font-weight utilities
 * so the DB styles always win.
 */
function stripConflictingClasses(className: string): string {
  return className
    .split(/\s+/)
    .filter((cls) => {
      // Remove text-color (text-white, text-black, etc.) but keep text-sm, text-center, etc.
      if (/^(hover:)?text-(white|black|gray|red|blue|green|pink|purple|yellow|orange|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)/.test(cls)) return false;
      // Remove text-[color] custom values
      if (/^(hover:)?text-\[#/.test(cls)) return false;
      // Remove text sizing
      if (/^text-(xs|sm|base|lg|xl|2xl|3xl|\[)/.test(cls)) return false;
      // Remove bg utilities
      if (/^(hover:)?bg-/.test(cls)) return false;
      // Remove padding
      if (/^p[xytblr]?-/.test(cls)) return false;
      // Remove rounded
      if (/^rounded/.test(cls)) return false;
      // Remove shadow
      if (/^(hover:)?shadow/.test(cls)) return false;
      // Remove border
      if (/^border/.test(cls)) return false;
      // Remove font-weight
      if (/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/.test(cls)) return false;
      // Remove hover:scale
      if (/^hover:scale/.test(cls)) return false;
      return true;
    })
    .join(" ");
}

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

  // DB styles take priority: build CSS from DB, then layer inline as fallback underneath
  const dbCSS = ctaStyleToCSS(styles);
  const merged = { ...inlineStyle, ...dbCSS };
  // Prevent React warning: if backgroundColor is set, remove background shorthand (and vice versa)
  if (merged.backgroundColor && merged.background) delete merged.background;
  if (merged.background && merged.backgroundColor) delete merged.backgroundColor;

  const css = merged;
  const hoverScale = styles.hoverScale ? parseFloat(styles.hoverScale) : undefined;
  const cleanedClassName = stripConflictingClasses(className);

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 font-semibold transition-all duration-300 cursor-pointer ${cleanedClassName}`}
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
