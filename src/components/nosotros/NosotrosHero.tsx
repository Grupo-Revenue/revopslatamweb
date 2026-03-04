import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const NosotrosHero = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const imagesRef = useRef<HTMLDivElement>(null);

  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const bottomGradientColor = (meta.bottom_gradient_color as string) || "";
  const showBottomGradient = bottomGradientColor !== "none";
  const heroImage = section?.image_url;
  const heroImage2 = (meta.image_url_2 as string) || "";

  // Gradient text config from admin — this is APPENDED after the title, not searched within
  const gradientText = ((meta.title_gradient_text as string) || "").trim();
  const titleGradient = ((meta.title_gradient as string) || "").trim() || "linear-gradient(90deg, hsl(var(--pink)), hsl(var(--purple)))";
  // Line break: text before this marker goes on line 1
  const lineBreakAfter = (meta.title_line_break as string) || "";

  const label = section?.subtitle ?? "Quiénes somos";
  const title =
    section?.title ??
    "Somos Arquitectos del Revenue.";
  const body =
    section?.body ??
    "Creemos que el orden, el diseño y el crecimiento sano son formas concretas de hacer bien en el mundo.";

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "var(--gradient-hero)" };

  // Scroll-driven horizontal animation for split images
  const { scrollYProgress } = useScroll({
    target: imagesRef,
    offset: ["start end", "end start"],
  });
  const xLeft = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const xRight = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Build the full title: title (normal) + gradientText (with gradient)
  const renderTitle = () => {
    const fullText = gradientText ? `${title} ${gradientText}` : title;

    // Apply line break if configured
    let lines: string[];
    if (lineBreakAfter && fullText.includes(lineBreakAfter)) {
      const idx = fullText.indexOf(lineBreakAfter) + lineBreakAfter.length;
      lines = [fullText.slice(0, idx), fullText.slice(idx).trimStart()];
    } else {
      lines = [fullText];
    }

    if (!gradientText) {
      return lines.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line}
        </span>
      ));
    }

    const gradientStyle: React.CSSProperties = {
      background: titleGradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      display: "inline",
      color: "transparent",
    };

    // For each line, find gradientText and wrap it
    const escaped = gradientText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const highlightRegex = new RegExp(`(${escaped})`, "gi");

    return lines.map((line, li) => {
      const parts = line.split(highlightRegex);
      return (
        <span key={li}>
          {li > 0 && <br />}
          {parts.map((part, pi) => {
            const isGradient = part.toLowerCase() === gradientText.toLowerCase();
            return isGradient ? (
              <span key={pi} style={gradientStyle}>{part}</span>
            ) : (
              <span key={pi}>{part}</span>
            );
          })}
        </span>
      );
    });
  };

  const hasSplitImages = heroImage && heroImage2;

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={sectionBg}
    >
      {hasBg && <div style={bgLayerStyle} />}

      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, top: -200, right: -100,
          background: "radial-gradient(circle, rgba(190,24,105,0.08) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, bottom: -100, left: -150,
          background: "radial-gradient(circle, rgba(98,36,190,0.1) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      {/* Text content */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 pt-32 sm:pt-40 pb-16 text-center">
        {section?.subtitle && (
          <motion.span
            {...fadeUp(0)}
            className="inline-block text-[12px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase mb-8"
            style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}
          >
            {label}
          </motion.span>
        )}

        <motion.h1
          {...fadeUp(0.12)}
          className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-bold leading-[1.08] tracking-tight"
          style={{ color: "white", ...getStyle("title") }}
        >
          {renderTitle()}
        </motion.h1>

        <motion.p
          {...fadeUp(0.24)}
          className="mt-8 text-[17px] sm:text-[19px] leading-[1.7] max-w-[900px] mx-auto"
          style={{ color: "rgba(255,255,255,0.65)", ...getStyle("body") }}
        >
          {body}
        </motion.p>
      </div>

      {/* Split images with infinite marquee + scroll parallax */}
      {hasSplitImages && (
        <div ref={imagesRef} className="relative z-10 w-full -mt-8 overflow-hidden">
          {/* Row 1: scrolls left continuously */}
          <motion.div style={{ x: xLeft }} className="w-full">
            <div className="flex animate-marquee-left">
              <img src={heroImage} alt={title} className="w-full h-auto flex-shrink-0" loading="eager" />
              <img src={heroImage} alt={title} className="w-full h-auto flex-shrink-0" loading="eager" />
            </div>
          </motion.div>
          {/* Row 2: scrolls right continuously */}
          <motion.div style={{ x: xRight }} className="w-full">
            <div className="flex animate-marquee-right">
              <img src={heroImage2} alt={`${title} - 2`} className="w-full h-auto flex-shrink-0" loading="eager" />
              <img src={heroImage2} alt={`${title} - 2`} className="w-full h-auto flex-shrink-0" loading="eager" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Single image fallback */}
      {heroImage && !hasSplitImages && (
        <motion.div
          {...fadeUp(0.36)}
          className="relative z-10 w-full -mt-8"
        >
          <img
            src={heroImage}
            alt={title}
            className="w-full h-auto"
          />
        </motion.div>
      )}

      {/* Bottom gradient */}
      {showBottomGradient && (
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
          style={{
            background: `linear-gradient(to bottom, transparent, ${bottomGradientColor || "hsl(var(--background))"})`,
          }}
        />
      )}
    </section>
  );
};

export default NosotrosHero;
