import { useMemo } from "react";

interface ResponsiveHeroImageProps {
  src: string;
  alt: string;
  metadata: Record<string, unknown>;
  defaultMaxWidth?: string;
  className?: string;
}

/**
 * Renders a hero image with responsive max-width controlled via CMS metadata.
 * Metadata keys: image_max_width (desktop), image_max_width_md (laptop 15"),
 * image_max_width_sm (laptop 13"), image_max_width_mobile (mobile).
 */
const ResponsiveHeroImage = ({
  src,
  alt,
  metadata,
  defaultMaxWidth = "920px",
  className = "",
}: ResponsiveHeroImageProps) => {
  const id = useMemo(() => `hero-img-${Math.random().toString(36).slice(2, 8)}`, []);

  const desktop = (metadata.image_max_width as string) || defaultMaxWidth;
  const md = (metadata.image_max_width_md as string) || desktop;
  const sm = (metadata.image_max_width_sm as string) || md;
  const mobile = (metadata.image_max_width_mobile as string) || sm;

  return (
    <>
      <style>{`
        #${id} { max-width: ${mobile}; }
        @media (min-width: 768px) { #${id} { max-width: ${sm}; } }
        @media (min-width: 1024px) { #${id} { max-width: ${md}; } }
        @media (min-width: 1440px) { #${id} { max-width: ${desktop}; } }
      `}</style>
      <img
        id={id}
        src={src}
        alt={alt}
        loading="lazy"
        className={`mx-auto rounded-2xl object-cover w-full ${className}`}
      />
    </>
  );
};

export default ResponsiveHeroImage;
