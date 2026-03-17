import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, TrendingUp, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const iconMap: Record<string, typeof Stethoscope> = {
  Stethoscope, TrendingUp, Heart, BookOpen,
};

const defaultValues = [
  { icon: "Stethoscope", title: "Primero diagnosticar, luego construir", desc: "Entendemos antes de tocar cualquier herramienta." },
  { icon: "TrendingUp", title: "Crecimiento real, no solo rápido", desc: "Construimos para que dure, no para impresionar." },
  { icon: "Heart", title: "Lideramos sirviendo", desc: "El éxito de nuestros clientes es el nuestro." },
  { icon: "BookOpen", title: "Nunca paramos de aprender", desc: "Nos certificamos, experimentamos y enseñamos." },
];

const AboutTeaser = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const values = (meta.values as typeof defaultValues) ?? defaultValues;
  const eyebrow = section?.subtitle ?? "Nuestra esencia";
  const title = section?.title ?? "Construimos crecimiento real, sano y sostenible.";
  const bodyText = section?.body ?? "No ejecutamos tareas por cumplir. Nos comprometemos con el resultado de cada cliente como si fuera nuestro propio negocio. Somos Arquitectos del Revenue: diseñamos antes de construir, diagnosticamos antes de implementar, y medimos para mejorar de manera continua.";
  const ctaText = section?.cta_text ?? "Conocer a Revops LATAM";
  const paragraphs = bodyText.split("\n\n");

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6" style={{ background: "#0D0D1A", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.p {...fadeUp(0)} className="text-[13px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#BE1869", ...getStyle("subtitle") }}>
            {eyebrow}
          </motion.p>
          <motion.h2 {...fadeUp(0.1)} className="mt-4 text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "white", ...getStyle("title") }}>
            {title}
          </motion.h2>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", ...getStyle("body") }}>
            {paragraphs.map((p, i) => (
              <motion.p key={i} {...fadeUp(0.2 + i * 0.05)}>{p}</motion.p>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)}>
            <Link to="/nosotros" className="mt-8 inline-flex items-center gap-2 text-[16px] font-medium transition-opacity hover:opacity-80" style={{ color: "#1CA398" }}>
              {ctaText} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.2)} className="rounded-[20px] p-5 sm:p-8" style={{ background: (meta.card_bg as string) || "#13132A", border: "1px solid rgba(255,255,255,0.06)" }}>
          {values.map((v, i) => {
            const Icon = iconMap[v.icon] || Stethoscope;
            return (
              <div key={v.title}>
                <div className="flex items-start gap-4 py-5">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] gradient-brand rounded-full" />
                    <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2 shrink-0" style={{ background: "rgba(190,24,105,0.15)", border: "1px solid rgba(190,24,105,0.3)" }}>
                      <Icon size={20} color="#BE1869" />
                    </div>
                    <h4 className="text-[16px] font-semibold" style={{ color: "white" }}>{v.title}</h4>
                    <p className="mt-1" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{v.desc}</p>
                  </div>
                </div>
                {i < values.length - 1 && <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeaser;
