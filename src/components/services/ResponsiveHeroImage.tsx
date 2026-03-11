import { useId } from "react";

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
  const reactId = useId();
  const safeId = `rhi-${reactId.replace(/:/g, "")}`;

  // Breakpoints: Monitor Grande (1920+) → Desktop (1440+) → Laptop (1024+) → Tablet (768+) → Mobile
  const monitorGrande = (metadata.image_max_width_xl as string) || defaultMaxWidth;
  const desktop = (metadata.image_max_width as string) || monitorGrande;
  const laptop = (metadata.image_max_width_md as string) || desktop;
  const tablet = (metadata.image_max_width_tablet as string) || laptop;
  const mobile = (metadata.image_max_width_mobile as string) || tablet;

  const css = `
    img[data-rhi="${safeId}"] { max-width: ${mobile} !important; }
    @media (min-width: 768px) { img[data-rhi="${safeId}"] { max-width: ${tablet} !important; } }
    @media (min-width: 1024px) { img[data-rhi="${safeId}"] { max-width: ${laptop} !important; } }
    @media (min-width: 1440px) { img[data-rhi="${safeId}"] { max-width: ${desktop} !important; } }
    @media (min-width: 1920px) { img[data-rhi="${safeId}"] { max-width: ${monitorGrande} !important; } }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <img
        data-rhi={safeId}
        src={src}
        alt={alt}
        loading="lazy"
        className={`mx-auto rounded-2xl object-cover w-full ${className}`}
      />
    </>
  );
};

export default ResponsiveHeroImage;
