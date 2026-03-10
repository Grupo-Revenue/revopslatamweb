import { useMemo, useState, useEffect } from "react";

interface ResponsiveHeroImageProps {
  src: string;
  alt: string;
  metadata: Record<string, unknown>;
  defaultMaxWidth?: string;
  className?: string;
}

function getResponsiveMaxWidth(
  width: number,
  desktop: string,
  laptop15: string,
  tablet: string,
  mobile: string
): string {
  if (width >= 1440) return desktop;
  if (width >= 1024) return laptop15;
  if (width >= 768) return tablet;
  return mobile;
}

const ResponsiveHeroImage = ({
  src,
  alt,
  metadata,
  defaultMaxWidth = "920px",
  className = "",
}: ResponsiveHeroImageProps) => {
  const desktop = (metadata.image_max_width as string) || defaultMaxWidth;
  const laptop15 = (metadata.image_max_width_md as string) || desktop;
  const tablet = (metadata.image_max_width_tablet as string) || laptop15;
  const mobile = (metadata.image_max_width_mobile as string) || tablet;

  const [maxWidth, setMaxWidth] = useState(() =>
    getResponsiveMaxWidth(typeof window !== "undefined" ? window.innerWidth : 1440, desktop, laptop15, tablet, mobile)
  );

  useEffect(() => {
    const update = () =>
      setMaxWidth(getResponsiveMaxWidth(window.innerWidth, desktop, laptop15, tablet, mobile));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desktop, laptop15, tablet, mobile]);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`mx-auto rounded-2xl object-cover w-full ${className}`}
      style={{ maxWidth }}
    />
  );
};

export default ResponsiveHeroImage;
