import { motion } from "framer-motion";
import { Gauge, Zap, Compass } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const iconList = [Gauge, Zap, Compass];

const defaultBenefits = [
  { line1: "Tu Score de", line2: "Madurez RevOps" },
  { line1: "Los 3 principales", line2: "puntos de fricción" },
  { line1: "Recomendación de", line2: "siguiente paso" },
];

const PulsoComercial = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const benefits = (meta.benefits as typeof defaultBenefits) ?? defaultBenefits;
  const footer = (meta.footer as string) ?? "Es gratuito · Toma 5 minutos · Resultado inmediato";
  const pill = section?.subtitle ?? "Diagnóstico gratuito";
  const title = section?.title ?? "¿Qué tan bien armada está tu pista?";
  const body = section?.body ?? "El Pulso Comercial analiza el estado de tu motor de ingresos en 5 minutos. Sin formularios largos. Sin llamadas previas. Solo claridad.";
  const cta = section?.cta_text ?? "Tomar el Pulso Comercial";

  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #BE1869 0%, #6224BE 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(255,255,255,0.05)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full" style={{ background: "rgba(255,255,255,0.08)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-block rounded-full uppercase" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.5)", color: "#FFFFFF", padding: "6px 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em" }}>
            {pill}
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.1)} className="mt-6 text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "white" }}>
          {title}
        </motion.h2>

        <motion.p {...fadeUp(0.2)} className="mt-5 text-[18px] leading-relaxed max-w-[580px] mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
          {body}
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
          {benefits.map((b, i) => {
            const Icon = iconList[i] || Gauge;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center text-center px-6 sm:px-8">
                  <div className="flex items-center justify-center rounded-full mb-3" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    <Icon size={24} color="#FFFFFF" />
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.4 }}>{b.line1}</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{b.line2}</span>
                </div>
                {i < benefits.length - 1 && (
                  <div className="hidden sm:block w-px shrink-0" style={{ height: 40, background: "rgba(255,255,255,0.2)" }} />
                )}
              </div>
            );
          })}
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="mt-10">
          <button
            className="px-12 py-[18px] rounded-full text-[18px] font-bold transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "white", color: "hsl(337 74% 44%)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
            onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}
          >
            {cta}
          </button>
        </motion.div>

        <motion.p {...fadeUp(0.5)} className="mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          {footer}
        </motion.p>
      </div>
    </section>
  );
};

export default PulsoComercial;
