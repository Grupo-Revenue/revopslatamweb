import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, X, Zap, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const GradientSeparator = () => (
  <div className="flex flex-col items-center justify-center" style={{ height: 48 }}>
    <div className="relative flex items-center justify-center">
      <div className="rounded-full" style={{ width: 80, height: 3, background: "linear-gradient(90deg, #BE1869, #6224BE, #1CA398)", borderRadius: 9999 }} />
      <div className="absolute rounded-full" style={{ width: 8, height: 8, background: "linear-gradient(135deg, #BE1869, #6224BE, #1CA398)", borderRadius: 9999 }} />
    </div>
  </div>
);

const trackStates = [
  { id: "broken" as const, label: "PISTA ROTA", accent: "#BE1869", accentBg: "rgba(190,24,105,0.04)", accentBorder: "rgba(190,24,105,0.2)", icon: X, title: "Procesos manuales, datos dispersos, equipos desconectados.", sub: "La bolita se pierde antes de la mitad.", badge: null, response: "Necesitas diagnóstico urgente. Empecemos por entender dónde se rompe tu pista.", cta: "Ver Diagnóstico del Motor de Ingresos" },
  { id: "incomplete" as const, label: "PISTA INCOMPLETA", accent: "#F7BE1A", labelColor: "#B8860B", accentBg: "rgba(247,190,26,0.04)", accentBorder: "rgba(247,190,26,0.25)", icon: Zap, title: "Herramientas instaladas, algunos procesos definidos.", sub: "La bolita avanza, pero lento, con fricciones constantes.", badge: null, response: "Tienes base para crecer. Te ayudamos a conectar las piezas que faltan.", cta: "Conocer nuestros servicios" },
  { id: "complete" as const, label: "PISTA BIEN ARMADA", accent: "#1CA398", accentBg: "rgba(28,163,152,0.06)", accentBorder: "rgba(28,163,152,0.3)", icon: CheckCircle, title: "Procesos integrados, datos confiables, equipos alineados.", sub: "La bolita fluye. El revenue es predecible y escalable.", badge: "El objetivo", response: "Perfecto. Ahora es momento de escalar y potenciar con RevOps as a Service.", cta: "Ver RevOps as a Service" },
];

const Methodology = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const eyebrow = section?.subtitle ?? "Nuestra metodología";
  const headline = section?.title ?? "El revenue no se improvisa.\nSe diseña, pieza a pieza.";
  const headlineParts = headline.split("\n");
  const bodyText = section?.body ?? "Piensa en una pista modular, de esas que se arman pieza a pieza para que una bolita llegue al final sin caerse. Eso es exactamente un sistema de revenue.\n\nCada pieza es un proceso, un acuerdo, una automatización, un dato, un rol. La bolita es tu lead, moviéndose desde el primer contacto hasta el cliente que renueva y refiere. La meta es que llegue al final, siempre, de manera predecible.";
  const bodyParagraphs = bodyText.split("\n\n");
  const closingTitle = (meta.closing_title as string) ?? "En Revops LATAM llevamos 14 años armando pistas.";
  const closingText = (meta.closing_text as string) ?? "Sabemos leer cómo fluye la tuya hoy, dónde se pierde, y qué hay que construir para que llegue al final.";
  const closingCta = (meta.closing_cta as string) ?? "Conoce nuestra metodología completa";
  const question = (meta.question as string) ?? "¿En qué estado está tu pista hoy?";
  const [selected, setSelected] = useState<string | null>(null);
  const selectedState = trackStates.find((s) => s.id === selected);

  return (
    <section className="relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,0 L1440,0 L1440,40 Q1080,80 720,60 Q360,40 0,80 Z" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6" style={{ background: "#F5F5F8", ...getBgStyle() }}>
        {hasBg && <div style={bgLayerStyle} />}
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <motion.p {...fadeUp(0)} className="text-center text-[13px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#BE1869", ...getStyle("subtitle") }}>
            {eyebrow}
          </motion.p>

          <motion.h2 {...fadeUp(0.1)} className="mt-4 text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight max-w-[650px] mx-auto" style={{ color: "#1A1A2E", ...getStyle("title") }}>
            {headlineParts[0]}
            {headlineParts[1] && (
              <>
                <br />
                <span className="text-gradient-brand">{headlineParts[1]}</span>
              </>
            )}
          </motion.h2>

          <motion.div {...fadeUp(0.2)} className="mt-8 mx-auto max-w-[620px] text-center text-[18px] leading-relaxed space-y-4" style={{ color: "#6B7280", ...getStyle("body") }}>
            {bodyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="mt-10">
            <GradientSeparator />
          </motion.div>

          <div className="h-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 items-stretch">
            {trackStates.map((s, i) => {
              const Icon = s.icon;
              const lColor = (s as any).labelColor || s.accent;
              return (
                <div key={s.id} className="flex items-stretch">
                  <motion.div {...fadeUp(0.35 + i * 0.1)} className="relative flex-1 rounded-2xl p-7 transition-all duration-300" style={{ background: s.accentBg, border: `1px solid ${s.accentBorder}`, borderTop: `4px solid ${s.accent}` }}>
                    {s.badge && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: s.accent }}>{s.badge}</span>
                    )}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: s.accent }} />
                        <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: s.accent }} />
                      </span>
                      <span className="text-[13px] font-bold tracking-wide uppercase" style={{ color: lColor }}>{s.label}</span>
                      <Icon size={28} style={{ color: s.accent }} className="ml-auto shrink-0" />
                    </div>
                    <h4 className="text-[17px] leading-snug mb-3" style={{ color: "#1A1A2E", fontWeight: 700 }}>{s.title}</h4>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#6B7280" }}>{s.sub}</p>
                  </motion.div>
                  {i < trackStates.length - 1 && (
                    <div className="hidden md:flex items-center justify-center px-2 shrink-0">
                      <ChevronRight size={24} style={{ color: "#D1D5DB" }} />
                    </div>
                  )}
                  {i < trackStates.length - 1 && (
                    <div className="flex md:hidden items-center justify-center py-2 shrink-0">
                      <ChevronRight size={24} className="rotate-90" style={{ color: "#D1D5DB" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <motion.div {...fadeUp(0.6)} className="mt-14 text-center">
            <p className="text-[20px] font-semibold mb-6" style={{ color: "#1A1A2E" }}>{question}</p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
              {trackStates.map((s) => {
                const isActive = selected === s.id;
                const lColor = (s as any).labelColor || s.accent;
                return (
                  <button key={s.id} onClick={() => setSelected(isActive ? null : s.id)} className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all duration-300" style={{ background: isActive ? s.accent : "transparent", color: isActive ? "white" : lColor, border: `2px solid ${s.accent}` }}>
                    {s.label.charAt(0) + s.label.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {selectedState && (
                <motion.div key={selectedState.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-6 max-w-[500px] mx-auto">
                  <p className="text-[17px] leading-relaxed mb-4" style={{ color: "#1A1A2E" }}>{selectedState.response}</p>
                  <Button size="lg" className="gap-2">
                    {selectedState.cta}
                    <ArrowRight size={18} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div {...fadeUp(0.7)} className="mt-12 sm:mt-16 mx-auto max-w-[800px] rounded-[20px] p-6 sm:p-12 text-center" style={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-[20px] sm:text-[24px] font-semibold leading-snug" style={{ color: "white" }}>{closingTitle}</p>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{closingText}</p>
            <button className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-medium transition-opacity hover:opacity-80" style={{ color: "#1CA398" }}>
              {closingCta}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
