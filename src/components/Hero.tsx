import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicCTA from "@/components/DynamicCTA";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useLeadForm } from "@/hooks/useLeadForm";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const defaults = {
  pill: "Revenue Operations · LATAM",
  headline1: "Tu empresa creció.",
  headline2: "Tu motor de ingresos, no.",
  body: "Cuando el crecimiento llega más rápido que los procesos, el caos no es señal de fracaso. Es señal de que necesitas una pista mejor diseñada.",
  cta: "Descubre dónde se pierde tu revenue",
  cta2: "Agenda una conversación",
};

const Hero = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { openLeadForm } = useLeadForm();
  const title = section?.title ?? `${defaults.headline1}\n${defaults.headline2}`;
  const titleParts = title.split("\n");
  const pill = (section?.subtitle ?? defaults.pill) as string;
  const body = (section?.body ?? defaults.body) as string;
  const cta = (section?.cta_text ?? defaults.cta) as string;
  const cta2 = (meta.cta2_text as string) ?? defaults.cta2;
  const bgImage = section?.background_image_url;
  const bgOverlay = meta.bg_overlay === true;
  const bgOpacity = typeof meta.bg_opacity === "number" ? meta.bg_opacity : 0.25;
  const sideImage = section?.image_url;

  return (
    <section className="relative gradient-hero overflow-hidden pt-[100px] sm:pt-[120px] lg:pt-[140px] pb-12 sm:pb-16 px-4 sm:px-6" style={getBgStyle()}>
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            opacity: bgOverlay ? bgOpacity : 1,
          }}
        />
      )}

      {/* Orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -100, left: -200, background: "radial-gradient(circle, rgba(190,24,105,0.15) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: 200, right: -150, background: "radial-gradient(circle, rgba(98,36,190,0.20) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 350, height: 350, bottom: 0, left: "40%", background: "radial-gradient(circle, rgba(7,121,215,0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

      <div className="relative z-10 container max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="relative z-10 max-w-[600px]">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[rgba(190,24,105,0.4)] bg-[rgba(190,24,105,0.1)] text-pink text-[13px] font-medium tracking-wider" style={getStyle("subtitle")}>
              {pill}
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="mt-7 text-hero font-bold leading-[1.1] tracking-tight" style={getStyle("title")}>
            <span className="text-primary-foreground">{titleParts[0]}</span>
            {titleParts[1] && (
              <>
                <br />
                <span className="text-gradient-brand">{titleParts[1]}</span>
              </>
            )}
          </motion.h1>

          <motion.p {...fadeUp(0.4)} className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed max-w-[520px]" style={{ color: "rgba(255,255,255,0.7)", ...getStyle("body") }}>
            {body}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 w-full sm:w-fit">
            {(meta.cta_style_key as string) ? (
              <DynamicCTA styleKey={meta.cta_style_key as string} onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
                {cta}
              </DynamicCTA>
            ) : (
              <Button size="lg" className="gap-2 whitespace-nowrap" onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
                {cta}
                <ArrowRight size={18} />
              </Button>
            )}
            {(meta.cta2_style_key as string) ? (
              <DynamicCTA styleKey={meta.cta2_style_key as string} onClick={() => { const url = meta.cta2_url as string; if (url) window.open(url, "_blank"); }}>
                {cta2}
              </DynamicCTA>
            ) : (
              <Button size="lg" variant="outline" className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent whitespace-nowrap" onClick={() => { const url = meta.cta2_url as string; if (url) window.open(url, "_blank"); }}>
                {cta2}
              </Button>
            )}
          </motion.div>
        </div>

        {sideImage && (
          <div className="hidden lg:block flex-1 max-w-[460px] relative">
            {/* Glow halo post-reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
              className="absolute -inset-4 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(190,24,105,0.15) 0%, rgba(98,36,190,0.1) 40%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            {/* Image with clip-path reveal */}
            <motion.img
              src={sideImage}
              alt={section?.title ?? "Hero"}
              className="w-full h-auto relative z-10"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[3px] z-20 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(190,24,105,0.7) 20%, rgba(98,36,190,0.8) 50%, rgba(7,121,215,0.7) 80%, transparent 100%)",
                boxShadow: "0 0 15px 4px rgba(190,24,105,0.4), 0 0 30px 8px rgba(98,36,190,0.3)",
              }}
              initial={{ top: "100%", opacity: 1 }}
              animate={{ top: "0%", opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
