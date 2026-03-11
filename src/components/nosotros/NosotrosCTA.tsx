import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import { useLeadForm } from "@/hooks/useLeadForm";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const NosotrosCTA = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { openLeadForm } = useLeadForm();
  const title = section?.title ?? "Si esto resuena contigo, probablemente trabajemos bien juntos.";
  const body = section?.body ?? "No trabajamos con todos. Trabajamos con empresas que quieren crecer de forma real, sana y sostenible — y con personas que valoran la honestidad por encima del discurso bonito.";
  const ctaText = section?.cta_text ?? "Hacer el Pulso Comercial";
  const ctaUrl = section?.cta_url || "https://pulso.revopslatam.com/";
  const cta2Text = (meta.cta2_text as string) ?? "Prefiero hablar directo → Agendar conversación";
  const cta2Url = (meta.cta2_url as string) ?? "#";

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "#F5F5F8" };

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10" style={sectionBg}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        <motion.h2 {...fadeUp(0)} className="text-[28px] sm:text-[36px] md:text-[44px] font-bold leading-[1.12] tracking-tight" style={{ color: "#1A1A2E", ...getStyle("title") }}>
          {title}
        </motion.h2>

        <motion.p {...fadeUp(0.1)} className="mt-6 text-[17px] sm:text-[18px] leading-[1.7]" style={{ color: "#6B7280", ...getStyle("body") }}>
          {body}
        </motion.p>

        <motion.div {...fadeUp(0.22)} className="mt-10 flex flex-col items-center gap-4">
          <Button size="lg" className="gap-2 text-[16px] px-8" onClick={() => window.open(ctaUrl, "_blank")}>
            {ctaText}
            <ArrowRight size={18} />
          </Button>

          <button onClick={() => openLeadForm("nosotros-cta")} className="text-[15px] font-medium transition-colors duration-200 cursor-pointer hover:underline" style={{ color: "hsl(var(--pink))", ...getStyle("cta") }}>
            {cta2Text}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default NosotrosCTA;
