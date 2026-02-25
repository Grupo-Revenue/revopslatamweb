import type { CSSProperties } from "react";
import type { HomeSection } from "@/hooks/useHomeSections";

/**
 * Returns props for rendering a section's background image
 * and an optional parallax style.
 */
export function useSectionBackground(section?: HomeSection) {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const bgImage = section?.background_image_url;
  const parallax = meta.parallax === true;
  const bgOpacity = typeof meta.bg_opacity === "number" ? meta.bg_opacity : 1;

  const hasBg = !!bgImage;

  const bgLayerStyle: CSSProperties = hasBg
    ? {
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: bgOpacity,
        ...(parallax
          ? { backgroundAttachment: "fixed" }
          : {}),
      }
    : {};

  return { hasBg, bgLayerStyle, parallax };
}
