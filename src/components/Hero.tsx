import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSection, getElementStyle, getBackgroundStyle } from "@/hooks/usePageContent";
import { useIsMobile } from "@/hooks/use-mobile";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const Hero = () => {
  const { title, subtitle, ctaText, ctaUrl, metadata } = useSection("hero");
  const isMobile = useIsMobile();

  // Defaults
  const headline = title ?? "Tu empresa creció.\nTu motor de ingresos, no.";
  const subtext = subtitle ?? "Cuando el crecimiento llega más rápido que los procesos, el caos no es señal de fracaso. Es señal de que necesitas una pista mejor diseñada.";
  const cta = ctaText ?? "Descubre dónde se pierde tu revenue";
  const ctaLink = ctaUrl ?? "#";

  const titleStyle = getElementStyle(metadata, "title", isMobile);
  const subtitleStyle = getElementStyle(metadata, "subtitle", isMobile);
  const ctaStyle = getElementStyle(metadata, "cta", isMobile);
  const bgStyle = getBackgroundStyle(metadata);

  // Split headline by newline for two-tone rendering
  const headlineParts = headline.split("\n");

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-[140px] pb-20 px-6" style={bgStyle}>
      {/* Orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500, top: -100, left: -200,
          background: "radial-gradient(circle, rgba(190,24,105,0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400, top: 200, right: -150,
          background: "radial-gradient(circle, rgba(98,36,190,0.20) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 350, height: 350, bottom: 0, left: "40%",
          background: "radial-gradient(circle, rgba(7,121,215,0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container max-w-[1100px] mx-auto">
        <div className="relative z-10 max-w-[600px]">
          {/* Pill */}
          <motion.div {...fadeUp(0)}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[rgba(190,24,105,0.4)] bg-[rgba(190,24,105,0.1)] text-pink text-[13px] font-medium tracking-wider">
              Revenue Operations · LATAM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="mt-7 text-hero font-bold leading-[1.1] tracking-tight"
            style={titleStyle}
          >
            {headlineParts.length > 1 ? (
              <>
                <span className="text-primary-foreground">{headlineParts[0]}</span>
                <br />
                <span className="text-gradient-brand">{headlineParts[1]}</span>
              </>
            ) : (
              <span className="text-primary-foreground">{headline}</span>
            )}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.4)}
            className="mt-6 text-lg leading-relaxed max-w-[520px]"
            style={{ color: "rgba(255,255,255,0.7)", ...subtitleStyle }}
          >
            {subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.6)}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="gap-2" style={ctaStyle} asChild={!!ctaLink && ctaLink !== "#"}>
              {ctaLink && ctaLink !== "#" ? (
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                  {cta}
                  <ArrowRight size={18} />
                </a>
              ) : (
                <>
                  {cta}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent"
            >
              Agenda una conversación
            </Button>
          </motion.div>

          {/* Trust metrics */}
          <motion.p
            {...fadeUp(0.9)}
            className="mt-8 text-[13px]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            14 años de experiencia · HubSpot Partner · LATAM
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
