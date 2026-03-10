import { useMemo } from "react";

interface ResponsiveHeroImageProps {
  src: string;
  alt: string;
  metadata: Record<string, unknown>;
  defaultMaxWidth?: string;
  className?: string;
}

const ResponsiveHeroImage = ({
  src,
  alt,
  metadata,
  defaultMaxWidth = "920px",
  className = "",
}: ResponsiveHeroImageProps) => {
  const id = useMemo(() => `hero-img-${Math.random().toString(36).slice(2, 8)}`, []);

  const desktop = (metadata.image_max_width as string) || defaultMaxWidth;
  const laptop15 = (metadata.image_max_width_md as string) || desktop;
  const tablet = (metadata.image_max_width_tablet as string) || laptop15;
  const mobile = (metadata.image_max_width_mobile as string) || tablet;

  return (
    <>
      <style>{`
        #${id} { max-width: ${mobile} !important; }
        @media (min-width: 768px) { #${id} { max-width: ${tablet} !important; } }
        @media (min-width: 1024px) { #${id} { max-width: ${laptop15} !important; } }
        @media (min-width: 1440px) { #${id} { max-width: ${desktop} !important; } }
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
