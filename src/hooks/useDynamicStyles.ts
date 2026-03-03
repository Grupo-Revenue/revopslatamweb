import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Hex (#RRGGBB) → "H S% L%" for CSS variables */
function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function buildGradientCSS(value: string): string {
  const parts = value.split(",");
  const angle = parts[parts.length - 1] || "135";
  const colors = parts.slice(0, -1);
  if (colors.length === 2) return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  if (colors.length === 3) return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
}

type StyleRow = { style_key: string; value: string; style_type: string };

export function useDynamicStyles() {
  const [styles, setStyles] = useState<StyleRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadStyles = async () => {
      try {
        const { data } = await supabase
          .from("site_styles")
          .select("style_key, value, style_type");

        if (!mounted) return;
        if (data) {
          setStyles(data);
          applyStyles(data);
        }
      } catch (error) {
        console.error("Failed to load dynamic styles:", error);
      } finally {
        if (mounted) setLoaded(true);
      }
    };

    void loadStyles();

    return () => {
      mounted = false;
    };
  }, []);

  return { styles, loaded };
}

function applyStyles(styles: StyleRow[]) {
  const root = document.documentElement;
  const map = new Map(styles.map((s) => [s.style_key, s]));

  const setColor = (key: string, cssVar: string) => {
    const s = map.get(key);
    if (s) root.style.setProperty(cssVar, hexToHSL(s.value));
  };

  const setGradient = (key: string, cssVar: string) => {
    const s = map.get(key);
    if (s) root.style.setProperty(cssVar, buildGradientCSS(s.value));
  };

  // Brand colors
  setColor("color-pink", "--pink");
  setColor("color-pink", "--primary");
  setColor("color-pink", "--ring");
  setColor("color-purple", "--purple");
  setColor("color-purple", "--accent");
  setColor("color-teal", "--teal");
  setColor("color-yellow", "--yellow");
  setColor("color-blue", "--blue");

  // Backgrounds
  setColor("bg-dark", "--dark-bg");
  setColor("bg-dark-card", "--dark-card");

  // Gradients
  setGradient("gradient-brand", "--gradient-brand");
  setGradient("gradient-accent", "--gradient-accent");
  setGradient("gradient-teal", "--gradient-teal");
  setGradient("gradient-hero", "--gradient-hero");

  // Typography
  const fontFamily = map.get("font-family");
  if (fontFamily) root.style.setProperty("--font-family", fontFamily.value);

  // Selection color
  const sel = map.get("color-selection");
  if (sel) root.style.setProperty("--selection-color", hexToHSL(sel.value));
}
