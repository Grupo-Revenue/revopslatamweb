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

  const desktop = (metadata.image_max_width as string) || defaultMaxWidth;
  const laptop15 = (metadata.image_max_width_md as string) || desktop;
  const tablet = (metadata.image_max_width_tablet as string) || laptop15;
  const mobile = (metadata.image_max_width_mobile as string) || tablet;

  console.log("[ResponsiveHeroImage] breakpoints:", { mobile, tablet, laptop15, desktop, safeId });

  const css = `
    img[data-rhi="${safeId}"] { max-width: ${mobile} !important; }
    @media (min-width: 768px) { img[data-rhi="${safeId}"] { max-width: ${tablet} !important; } }
    @media (min-width: 1024px) { img[data-rhi="${safeId}"] { max-width: ${laptop15} !important; } }
    @media (min-width: 1440px) { img[data-rhi="${safeId}"] { max-width: ${desktop} !important; } }
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
