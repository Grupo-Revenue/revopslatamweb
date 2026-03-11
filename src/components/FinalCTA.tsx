import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicCTA from "@/components/DynamicCTA";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import { useLeadForm } from "@/hooks/useLeadForm";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const FinalCTA = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const { openLeadForm } = useLeadForm();
  const title = section?.title ?? "¿Listo para armar tu pista?";
  const subtitle = section?.subtitle ?? "El primer paso es entender cómo fluye tu revenue hoy.";
  const cta = section?.cta_text ?? "Agenda una conversación";
  const cta2 = (meta.cta2_text as string) ?? "Haz el Pulso Comercial primero";
  const footer = (meta.footer as string) ?? "5 minutos · Gratuito · Resultado inmediato";

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden" style={{ background: "#0D0D1A", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: -80, left: -150, background: "radial-gradient(circle, rgba(190,24,105,0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 350, height: 350, bottom: -50, right: -100, background: "radial-gradient(circle, rgba(98,36,190,0.15) 0%, transparent 70%)", filter: "blur(120px)" }} />

      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        <motion.h2 {...fadeUp(0)} className="text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-tight" style={{ color: "white", ...getStyle("title") }}>
          {title}
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-5 text-[20px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", ...getStyle("subtitle") }}>
          {subtitle}
        </motion.p>

        <motion.div {...fadeUp(0.25)} className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            {(meta.cta_style_key as string) ? (
              <DynamicCTA styleKey={meta.cta_style_key as string} onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
                {cta}
              </DynamicCTA>
            ) : (
              <Button size="lg" className="gap-2" onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
                {cta}
                <ArrowRight size={18} />
              </Button>
            )}
            {(meta.cta2_style_key as string) ? (
              <DynamicCTA styleKey={meta.cta2_style_key as string} onClick={() => window.open((meta.cta2_url as string) || "https://pulso.revopslatam.com/", "_blank")}>
                {cta2}
              </DynamicCTA>
            ) : (
              <Button size="lg" variant="outline" className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent" onClick={() => window.open((meta.cta2_url as string) || "https://pulso.revopslatam.com/", "_blank")}>
                {cta2}
              </Button>
            )}
          </div>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {footer}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
