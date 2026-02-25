import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { HomeSection } from "@/hooks/useHomeSections";

type ElementStyles = {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  gradient?: string;
};

type ResponsiveElementStyles = {
  desktop?: ElementStyles;
  mobile?: ElementStyles;
};

type SectionMetadataStyles = {
  title?: ResponsiveElementStyles;
  subtitle?: ResponsiveElementStyles;
  body?: ResponsiveElementStyles;
  cta?: ResponsiveElementStyles;
  background?: {
    color?: string;
    gradient?: string;
  };
};

/**
 * Given a section, returns a function `getStyle(elementKey)` that returns
 * a React CSSProperties object merging desktop/mobile overrides from metadata.styles.
 */
export function useSectionStyles(section?: HomeSection) {
  const isMobile = useIsMobile();

  return useMemo(() => {
    const meta = (section?.metadata ?? {}) as Record<string, unknown>;
    const styles = (meta.styles as SectionMetadataStyles) ?? {};

    const getStyle = (elementKey: "title" | "subtitle" | "body" | "cta"): React.CSSProperties => {
      const el = styles[elementKey] as ResponsiveElementStyles | undefined;
      if (!el) return {};

      const device = isMobile ? "mobile" : "desktop";
      // Merge desktop as base, then override with mobile if on mobile
      const desktop = el.desktop ?? {};
      const mobile = el.mobile ?? {};
      const active = isMobile ? { ...desktop, ...mobile } : desktop;

      const result: React.CSSProperties = {};

      if (active.fontSize) result.fontSize = active.fontSize;
      if (active.fontWeight) result.fontWeight = Number(active.fontWeight) || active.fontWeight;
      if (active.gradient) {
        result.background = active.gradient;
        result.WebkitBackgroundClip = "text";
        result.WebkitTextFillColor = "transparent";
        result.backgroundClip = "text";
      } else if (active.color) {
        result.color = active.color;
      }

      return result;
    };

    const getBgStyle = (): React.CSSProperties => {
      const bg = styles.background;
      if (!bg) return {};
      if (bg.gradient) return { background: bg.gradient };
      if (bg.color) return { background: bg.color };
      return {};
    };

    return { getStyle, getBgStyle };
  }, [section, isMobile]);
}
