import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CTAStyleProperties = {
  bgColor?: string;
  gradient?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  paddingX?: string;
  paddingY?: string;
  shadow?: string;
  hoverScale?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  hasIcon?: boolean;
  iconName?: string;
};

export type CTAStyle = {
  id: string;
  style_key: string;
  label: string;
  styles: CTAStyleProperties;
  sort_order: number;
};

let cachedStyles: CTAStyle[] | null = null;
let fetchPromise: Promise<CTAStyle[]> | null = null;

async function fetchCTAStyles(): Promise<CTAStyle[]> {
  const { data } = await supabase
    .from("cta_styles")
    .select("*")
    .order("sort_order");
  const result = (data ?? []).map((d: any) => ({
    id: d.id,
    style_key: d.style_key,
    label: d.label,
    styles: (d.styles ?? {}) as CTAStyleProperties,
    sort_order: d.sort_order,
  }));
  cachedStyles = result;
  return result;
}

export function useCTAStyles() {
  const [styles, setStyles] = useState<CTAStyle[]>(cachedStyles ?? []);
  const [loading, setLoading] = useState(!cachedStyles);

  useEffect(() => {
    if (cachedStyles) {
      setStyles(cachedStyles);
      setLoading(false);
    }
    if (!fetchPromise) {
      fetchPromise = fetchCTAStyles();
    }
    fetchPromise.then((s) => {
      setStyles(s);
      setLoading(false);
    });

    // Realtime: invalidate cache on changes
    const channel = supabase
      .channel("cta_styles_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cta_styles" }, () => {
        fetchPromise = null;
        cachedStyles = null;
        fetchCTAStyles().then((s) => setStyles(s));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const refetch = async () => {
    fetchPromise = null;
    cachedStyles = null;
    const s = await fetchCTAStyles();
    setStyles(s);
  };

  const getStyleByKey = (key: string | undefined) =>
    styles.find((s) => s.style_key === key);

  return { ctaStyles: styles, loading, refetch, getStyleByKey };
}

/** Build inline CSS from a CTA style */
export function ctaStyleToCSS(s: CTAStyleProperties): React.CSSProperties {
  const css: React.CSSProperties = {};
  if (s.gradient) css.background = s.gradient;
  else if (s.bgColor) css.backgroundColor = s.bgColor;
  if (s.textColor) css.color = s.textColor;
  if (s.borderColor) {
    css.borderColor = s.borderColor;
    css.borderStyle = "solid";
    css.borderWidth = s.borderWidth || "2px";
  }
  if (s.borderRadius) css.borderRadius = s.borderRadius;
  if (s.fontSize) css.fontSize = s.fontSize;
  if (s.fontWeight) css.fontWeight = s.fontWeight;
  if (s.paddingX || s.paddingY) {
    css.padding = `${s.paddingY || "12px"} ${s.paddingX || "24px"}`;
  }
  if (s.shadow) css.boxShadow = s.shadow;
  if (s.textAlign) css.textAlign = s.textAlign as React.CSSProperties["textAlign"];
  return css;
}
