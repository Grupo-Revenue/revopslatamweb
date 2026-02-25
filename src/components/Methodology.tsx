import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, AlertTriangle, Zap, Rocket } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

/* ── Track illustrations (SVG inline) ── */
const TrackBroken = () => (
  <svg viewBox="0 0 120 40" className="w-full h-auto" fill="none">
    <rect x="2" y="16" width="22" height="8" rx="3" fill="hsl(337 74% 44% / 0.25)" stroke="hsl(337 74% 44%)" strokeWidth="1.5" />
    <rect x="32" y="12" width="18" height="8" rx="3" fill="hsl(337 74% 44% / 0.15)" stroke="hsl(337 74% 44%)" strokeWidth="1.5" strokeDasharray="3 2" transform="rotate(8 41 16)" />
    <rect x="58" y="20" width="20" height="8" rx="3" fill="hsl(337 74% 44% / 0.15)" stroke="hsl(337 74% 44%)" strokeWidth="1.5" strokeDasharray="3 2" transform="rotate(-5 68 24)" />
    <rect x="86" y="14" width="22" height="8" rx="3" fill="hsl(337 74% 44% / 0.1)" stroke="hsl(337 74% 44%)" strokeWidth="1.5" strokeDasharray="3 2" />
    <circle cx="10" cy="12" r="4" fill="hsl(337 74% 44%)" opacity="0.8" />
  </svg>
);

const TrackIncomplete = () => (
  <svg viewBox="0 0 120 40" className="w-full h-auto" fill="none">
    <rect x="2" y="16" width="28" height="8" rx="3" fill="hsl(42 93% 54% / 0.25)" stroke="hsl(42 93% 54%)" strokeWidth="1.5" />
    <rect x="34" y="16" width="20" height="8" rx="3" fill="hsl(42 93% 54% / 0.25)" stroke="hsl(42 93% 54%)" strokeWidth="1.5" />
    {/* Gap */}
    <line x1="58" y1="20" x2="66" y2="20" stroke="hsl(42 93% 54% / 0.3)" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="70" y="16" width="24" height="8" rx="3" fill="hsl(42 93% 54% / 0.25)" stroke="hsl(42 93% 54%)" strokeWidth="1.5" />
    <rect x="98" y="16" width="18" height="8" rx="3" fill="hsl(42 93% 54% / 0.1)" stroke="hsl(42 93% 54%)" strokeWidth="1.5" strokeDasharray="3 2" />
    <circle cx="48" cy="14" r="4" fill="hsl(42 93% 54%)" opacity="0.8" />
  </svg>
);

const TrackComplete = () => (
  <svg viewBox="0 0 120 40" className="w-full h-auto" fill="none">
    <rect x="2" y="16" width="26" height="8" rx="3" fill="hsl(175 73% 37% / 0.3)" stroke="hsl(175 73% 37%)" strokeWidth="1.5" />
    <rect x="30" y="16" width="24" height="8" rx="3" fill="hsl(175 73% 37% / 0.3)" stroke="hsl(175 73% 37%)" strokeWidth="1.5" />
    <rect x="56" y="16" width="24" height="8" rx="3" fill="hsl(175 73% 37% / 0.3)" stroke="hsl(175 73% 37%)" strokeWidth="1.5" />
    <rect x="82" y="16" width="26" height="8" rx="3" fill="hsl(175 73% 37% / 0.3)" stroke="hsl(175 73% 37%)" strokeWidth="1.5" />
    {/* Flowing ball */}
    <circle cx="105" cy="14" r="4" fill="hsl(175 73% 37%)" />
    <circle cx="105" cy="14" r="7" fill="hsl(175 73% 37% / 0.2)" />
  </svg>
);

/* ── Data ── */
type TrackStateId = "broken" | "incomplete" | "complete";

interface TrackState {
  id: TrackStateId;
  label: string;
  tagline: string;
  color: string;
  colorHsl: string;
  bgSubtle: string;
  borderSubtle: string;
  icon: typeof AlertTriangle;
  illustration: () => JSX.Element;
  headline: string;
  validation: string;
  signals: string[];
  consequences: string[];
  approach: string;
  ctaText: string;
  ctaStyle: string;
  popular?: boolean;
}

const trackStates: TrackState[] = [
  {
    id: "broken",
    label: "Pista rota",
    tagline: "Sin sistema, sin previsibilidad",
    color: "#BE1869",
    colorHsl: "337 74% 44%",
    bgSubtle: "hsl(337 74% 44% / 0.04)",
    borderSubtle: "hsl(337 74% 44% / 0.15)",
    icon: AlertTriangle,
    illustration: TrackBroken,
    headline: "Tu crecimiento depende de esfuerzos individuales, no de un sistema.",
    validation: "El 70% de las empresas B2B en LATAM operan así. No estás solo, pero seguir así tiene un costo.",
    signals: [
      "Tus equipos de venta, marketing y CS trabajan con datos distintos",
      "No puedes predecir el revenue del próximo trimestre con confianza",
      "Cada nuevo vendedor reinventa el proceso desde cero",
    ],
    consequences: [
      "Pierdes deals por falta de seguimiento, no por falta de demanda",
      "Tu CAC sube mientras tu pipeline se vuelve impredecible",
      "Escalar significa contratar más personas, no mejorar el sistema",
    ],
    approach: "Primero hay que entender dónde se rompe tu motor de ingresos. Un diagnóstico estructurado revela las 3-5 piezas críticas que están frenando tu revenue.",
    ctaText: "Diagnosticar mi motor de ingresos",
    ctaStyle: "gradient-brand text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30",
  },
  {
    id: "incomplete",
    label: "Pista incompleta",
    tagline: "Base instalada, fricciones constantes",
    color: "#D4A017",
    colorHsl: "42 93% 54%",
    bgSubtle: "hsl(42 93% 46% / 0.04)",
    borderSubtle: "hsl(42 93% 46% / 0.18)",
    icon: Zap,
    illustration: TrackIncomplete,
    headline: "Tienes herramientas y procesos, pero tu revenue sigue sin ser predecible.",
    validation: "La mayoría de empresas que ya invirtieron en CRM y automatización están aquí. El problema no es la tecnología.",
    signals: [
      "Tienes HubSpot (u otro CRM) pero lo usan al 30% de su capacidad",
      "Los handoffs entre marketing → ventas → CS generan fricción constante",
      "Generas datos, pero no los usas para tomar decisiones de revenue",
    ],
    consequences: [
      "Tu inversión en tecnología no se traduce en crecimiento real",
      "Los equipos culpan a otros departamentos por los resultados",
      "Tus mejores oportunidades se pierden en los gaps entre áreas",
    ],
    approach: "Las piezas existen, pero están desconectadas. Se necesita conectar procesos, alinear equipos y automatizar los puntos de fricción que frenan tu pipeline.",
    ctaText: "Optimizar mi sistema comercial",
    ctaStyle: "bg-[hsl(42_93%_46%)] text-[hsl(240_33%_8%)] font-bold shadow-lg shadow-yellow-500/15 hover:shadow-yellow-500/25",
    popular: true,
  },
  {
    id: "complete",
    label: "Pista bien armada",
    tagline: "Sistema fluido, listo para escalar",
    color: "#1CA398",
    colorHsl: "175 73% 37%",
    bgSubtle: "hsl(175 73% 37% / 0.04)",
    borderSubtle: "hsl(175 73% 37% / 0.18)",
    icon: Rocket,
    illustration: TrackComplete,
    headline: "Tu sistema funciona. Ahora necesitas un equipo que lo potencie sin perder foco.",
    validation: "Pocas empresas llegan aquí. Si ya tienes procesos integrados, el siguiente paso es escalar con operaciones dedicadas.",
    signals: [
      "Tus procesos de venta, marketing y CS están documentados y conectados",
      "Puedes predecir tu revenue con ±15% de precisión trimestral",
      "Cada nuevo rep es productivo en menos de 30 días",
    ],
    consequences: [
      "Sin un equipo de operaciones dedicado, la deuda técnica se acumula",
      "Tu equipo comercial pierde tiempo en tareas operativas en vez de vender",
      "El crecimiento se estanca cuando no hay quién optimice continuamente",
    ],
    approach: "Con la pista armada, lo que necesitas es un equipo de RevOps que opere, optimice y escale tu sistema de revenue con sprints continuos.",
    ctaText: "Escalar con RevOps as a Service",
    ctaStyle: "bg-[hsl(175_73%_37%)] text-white font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30",
  },
];

/* ── Component ── */
const Methodology = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const [selected, setSelected] = useState<TrackStateId | null>(null);
  const selectedState = trackStates.find((s) => s.id === selected);

  const eyebrow = section?.subtitle ?? "Nuestra metodología";
  const headline = section?.title ?? "¿Tu crecimiento depende de personas\no de un sistema?";
  const headlineParts = headline.split("\n");

  const handleSelect = (id: TrackStateId) => {
    setSelected(selected === id ? null : id);
  };

  return (
    <section className="relative" id="metodologia">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,0 L1440,0 L1440,40 Q1080,80 720,60 Q360,40 0,80 Z" fill="#FFFFFF" />
        </svg>
      </div>

      <div
        className="relative pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6"
        style={{ background: "#F5F5F8", ...getBgStyle() }}
      >
        {hasBg && <div style={bgLayerStyle} />}
        <div className="relative z-10 max-w-[1100px] mx-auto">
          {/* ── Header ── */}
          <motion.p
            {...fadeUp(0)}
            className="text-center text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            {...fadeUp(0.08)}
            className="mt-4 text-center text-[24px] sm:text-[28px] md:text-[38px] font-bold leading-[1.15] tracking-tight max-w-[700px] mx-auto"
            style={{ color: "hsl(var(--foreground))", ...getStyle("title") }}
          >
            {headlineParts[0]}
            {headlineParts[1] && (
              <>
                <br />
                <span className="text-gradient-brand">{headlineParts[1]}</span>
              </>
            )}
          </motion.h2>

          <motion.p
            {...fadeUp(0.14)}
            className="mt-4 text-center text-[15px] sm:text-[17px] leading-relaxed max-w-[560px] mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Tu motor de ingresos es como una pista modular. Cada pieza —proceso, dato, acuerdo, automatización— determina si tu lead llega al final o se pierde en el camino.
          </motion.p>

          {/* ── Gradient separator ── */}
          <motion.div {...fadeUp(0.18)} className="flex justify-center my-8 sm:my-10">
            <div className="h-[3px] w-20 rounded-full" style={{ background: "var(--gradient-brand)" }} />
          </motion.div>

          {/* ── Selector question ── */}
          <motion.p
            {...fadeUp(0.22)}
            className="text-center text-[18px] sm:text-[22px] font-semibold mb-8"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Identifica el estado de tu sistema comercial
          </motion.p>

          {/* ── Track state cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {trackStates.map((s, i) => {
              const Icon = s.icon;
              const Illust = s.illustration;
              const isSelected = selected === s.id;
              const hasSelection = selected !== null;
              const isDeemphasized = hasSelection && !isSelected;

              return (
                <motion.button
                  key={s.id}
                  {...fadeUp(0.25 + i * 0.08)}
                  onClick={() => handleSelect(s.id)}
                  className="relative text-left rounded-2xl p-5 sm:p-6 transition-all duration-500 cursor-pointer group"
                  style={{
                    background: isSelected ? s.bgSubtle : "white",
                    border: `1.5px solid ${isSelected ? s.color : "hsl(220 13% 91%)"}`,
                    borderTop: `4px solid ${isSelected ? s.color : isDeemphasized ? "hsl(220 13% 91%)" : s.color}`,
                    opacity: isDeemphasized ? 0.45 : 1,
                    transform: isSelected ? "scale(1.02)" : isDeemphasized ? "scale(0.97)" : "scale(1)",
                    filter: isDeemphasized ? "grayscale(0.3)" : "none",
                  }}
                  whileHover={!isSelected ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {s.popular && !isDeemphasized && (
                    <span
                      className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white tracking-wide"
                      style={{ background: s.color }}
                    >
                      MÁS COMÚN
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
                        style={{ background: `${s.color}15` }}
                      >
                        <Icon size={20} style={{ color: s.color }} />
                      </span>
                      <div>
                        <span
                          className="block text-[13px] sm:text-[14px] font-bold tracking-wide uppercase"
                          style={{ color: s.color }}
                        >
                          {s.label}
                        </span>
                        <span className="block text-[12px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {s.tagline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini illustration */}
                  <div className="mb-3 opacity-60 group-hover:opacity-80 transition-opacity px-2">
                    <Illust />
                  </div>

                  <p className="text-[14px] sm:text-[15px] leading-snug font-medium" style={{ color: "hsl(var(--foreground))" }}>
                    {s.headline.split(".")[0]}.
                  </p>

                  <div
                    className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                    style={{ color: s.color }}
                  >
                    {isSelected ? "Seleccionado" : "Seleccionar"}
                    <ArrowRight size={14} className={`transition-transform duration-300 ${isSelected ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Expanded content ── */}
          <AnimatePresence mode="wait">
            {selectedState && (
              <motion.div
                key={selectedState.id}
                initial={{ opacity: 0, y: 30, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div
                  className="mt-6 rounded-3xl p-6 sm:p-10 md:p-12"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(240 33% 12%) 100%)`,
                    border: `1px solid ${selectedState.color}30`,
                  }}
                >
                  {/* Accent line */}
                  <div className="w-16 h-1 rounded-full mb-6" style={{ background: selectedState.color }} />

                  {/* Headline */}
                  <h3
                    className="text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-[1.2] max-w-[600px]"
                    style={{ color: "white" }}
                  >
                    {selectedState.headline}
                  </h3>

                  {/* Validation */}
                  <p
                    className="mt-3 text-[14px] sm:text-[16px] leading-relaxed max-w-[550px]"
                    style={{ color: `${selectedState.color}` }}
                  >
                    {selectedState.validation}
                  </p>

                  {/* Two columns: Signals + Consequences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
                    {/* Signals */}
                    <div>
                      <h4 className="text-[13px] font-bold tracking-wider uppercase mb-4" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                        Señales de que estás aquí
                      </h4>
                      <ul className="space-y-3">
                        {selectedState.signals.map((sig, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="flex items-start gap-3"
                          >
                            <span
                              className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                              style={{ background: selectedState.color }}
                            />
                            <span className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
                              {sig}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Consequences */}
                    <div>
                      <h4 className="text-[13px] font-bold tracking-wider uppercase mb-4" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                        Si no lo resuelves
                      </h4>
                      <ul className="space-y-3">
                        {selectedState.consequences.map((con, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            className="flex items-start gap-3"
                          >
                            <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-white/20" />
                            <span className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.65)" }}>
                              {con}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Approach */}
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.08)" }}>
                    <h4 className="text-[13px] font-bold tracking-wider uppercase mb-3" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                      El enfoque
                    </h4>
                    <p className="text-[15px] sm:text-[17px] leading-relaxed max-w-[650px]" style={{ color: "hsl(0 0% 100% / 0.85)" }}>
                      {selectedState.approach}
                    </p>
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                  >
                    <button
                      className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] sm:text-[16px] font-bold transition-all duration-300 hover:scale-[1.03] ${selectedState.ctaStyle}`}
                    >
                      {selectedState.ctaText}
                      <ArrowRight size={18} />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom closing block ── */}
          {!selected && (
            <motion.div
              {...fadeUp(0.5)}
              className="mt-12 sm:mt-16 mx-auto max-w-[700px] rounded-[20px] p-6 sm:p-10 text-center"
              style={{
                background: "hsl(var(--dark-bg))",
                border: "1px solid hsl(0 0% 100% / 0.06)",
              }}
            >
              <p className="text-[18px] sm:text-[22px] font-semibold leading-snug" style={{ color: "white" }}>
                En RevOps LATAM llevamos 14 años armando pistas.
              </p>
              <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.6)" }}>
                Sabemos leer cómo fluye la tuya hoy, dónde se pierde, y qué hay que construir para que llegue al final.
              </p>
              <button className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-80" style={{ color: "hsl(var(--teal))" }}>
                Conoce nuestra metodología completa
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
