import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, AlertTriangle, Zap, Rocket } from "lucide-react";
import pistaRotaImg from "@/assets/pista-rota.png";
import pistaIncompletaImg from "@/assets/pista-incompleta.png";
import pistaArmadaImg from "@/assets/pista-armada.png";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

/* ── Track illustrations (imported images) ── */

const TrackBroken = () => (
  <div className="relative w-full flex justify-center">
    <img src={pistaRotaImg} alt="Pista rota - sistema desconectado" className="w-full max-w-[180px] h-auto opacity-80 drop-shadow-sm" />
  </div>
);

const TrackIncomplete = () => (
  <div className="relative w-full flex justify-center">
    <img src={pistaIncompletaImg} alt="Pista incompleta - gaps en el sistema" className="w-full max-w-[180px] h-auto opacity-80 drop-shadow-sm" />
  </div>
);

const TrackComplete = () => (
  <div className="relative w-full flex justify-center">
    <img src={pistaArmadaImg} alt="Pista bien armada - sistema integrado" className="w-full max-w-[180px] h-auto opacity-80 drop-shadow-sm" />
  </div>
);

/* ── Data ── */
type TrackStateId = string;

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

/* ── Reusable expanded content ── */
const TrackExpandedContent = ({
  state,
  cardBg,
  compact = false,
}: {
  state: TrackState;
  cardBg?: string;
  compact?: boolean;
}) => (
  <div
    className={compact ? "mt-3 rounded-2xl p-5" : "mt-6 rounded-3xl p-6 sm:p-10 md:p-12"}
    style={{
      background: cardBg || "hsl(var(--dark-bg))",
      border: `1px solid ${state.color}20`,
    }}
  >
    <div className="w-16 h-1 rounded-full mb-6" style={{ background: state.color }} />

    <h3
      className={compact
        ? "text-[18px] sm:text-[20px] font-bold leading-[1.25]"
        : "text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-[1.2] max-w-[600px]"}
      style={{ color: "white" }}
    >
      {state.headline}
    </h3>

    <p
      className={compact
        ? "mt-3 text-[14px] leading-relaxed"
        : "mt-3 text-[14px] sm:text-[16px] leading-relaxed max-w-[550px]"}
      style={{ color: state.color }}
    >
      {state.validation}
    </p>

    <div className={compact ? "grid grid-cols-1 gap-5 mt-6" : "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8"}>
      <div>
        <h4 className="text-[13px] font-bold tracking-wider uppercase mb-4" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
          Señales de que estás aquí
        </h4>
        <ul className="space-y-3">
          {state.signals.map((sig, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.06 }}
              className="flex items-start gap-3"
            >
              <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: state.color }} />
              <span className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
                {sig}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[13px] font-bold tracking-wider uppercase mb-4" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
          Si no lo resuelves
        </h4>
        <ul className="space-y-3">
          {state.consequences.map((con, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 + i * 0.06 }}
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

    <div className={compact ? "mt-6 pt-5" : "mt-8 pt-6"} style={{ borderTop: "1px solid hsl(0 0% 100% / 0.08)" }}>
      <h4 className="text-[13px] font-bold tracking-wider uppercase mb-3" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
        El enfoque
      </h4>
      <p className={compact ? "text-[14px] leading-relaxed" : "text-[15px] sm:text-[17px] leading-relaxed max-w-[650px]"} style={{ color: "hsl(0 0% 100% / 0.85)" }}>
        {state.approach}
      </p>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className={compact ? "mt-6" : "mt-8"}
    >
      <a
        href={(state as any).ctaUrl || "#"}
        className={`inline-flex items-center justify-center gap-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.03] ${state.ctaStyle} ${compact ? "w-full px-5 py-3 text-[14px]" : "px-7 py-3.5 text-[15px] sm:text-[16px]"}`}
        style={{ backgroundColor: state.color, color: "white" }}
      >
        {state.ctaText}
        <ArrowRight size={compact ? 16 : 18} />
      </a>
    </motion.div>
  </div>
);

/* ── Component ── */
const Methodology = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const [selected, setSelected] = useState<TrackStateId | null>(null);

  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const metaTracks = meta.track_states as Array<{
    id: string; label: string; tagline: string; color: string; icon: string;
    headline: string; validation: string; signals: string[]; consequences: string[];
    approach: string; ctaText: string; popular?: boolean;
  }> | undefined;

  // Helper: hex to HSL string
  const hexToHsl = (hex: string | undefined): string => {
    if (!hex || hex.length < 7) return "0 0% 50%";
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Merge metadata track states with hardcoded defaults (fill empty fields from defaults)
  const resolvedTracks: TrackState[] = (() => {
    if (!metaTracks || !Array.isArray(metaTracks)) return trackStates;

    const iconMap: Record<string, typeof AlertTriangle> = { AlertTriangle, Zap, Rocket };
    const illustMap: Record<string, () => JSX.Element> = {
      broken: TrackBroken, incomplete: TrackIncomplete, complete: TrackComplete,
    };

    return trackStates.map((base) => {
      const mt = metaTracks.find((t) => t.id === base.id);
      if (!mt) return base;

      // Merge: use metadata value only if it's non-empty, otherwise keep default
      const merged = { ...base };
      if (mt.label) merged.label = mt.label;
      if (mt.tagline) merged.tagline = mt.tagline;
      if (mt.headline) merged.headline = mt.headline;
      if (mt.validation) merged.validation = mt.validation;
      if (mt.approach) merged.approach = mt.approach;
      if (mt.ctaText) merged.ctaText = mt.ctaText;
      if ((mt as any).ctaUrl) (merged as any).ctaUrl = (mt as any).ctaUrl;
      if (mt.popular !== undefined) merged.popular = mt.popular;
      if (Array.isArray(mt.signals) && mt.signals.length > 0) merged.signals = mt.signals;
      if (Array.isArray(mt.consequences) && mt.consequences.length > 0) merged.consequences = mt.consequences;
      if (mt.color) {
        merged.color = mt.color;
        const hsl = hexToHsl(mt.color);
        merged.colorHsl = hsl;
        merged.bgSubtle = `hsl(${hsl} / 0.04)`;
        merged.borderSubtle = `hsl(${hsl} / 0.15)`;
      }
      if (mt.icon && iconMap[mt.icon]) merged.icon = iconMap[mt.icon];
      if (illustMap[mt.id]) merged.illustration = illustMap[mt.id];

      return merged;
    });
  })();

  const selectedState = resolvedTracks.find((s) => s.id === selected);

  const eyebrow = section?.subtitle ?? "Nuestra metodología";
  const headline = section?.title ?? "El revenue no se improvisa.\nSe diseña, pieza a pieza.";
  const headlineParts = headline.includes("\n")
    ? headline.split("\n")
    : headline.includes(". ")
      ? [headline.split(". ")[0] + ".", headline.split(". ").slice(1).join(". ")]
      : [headline];

  // Read from both old and new metadata keys for backward compatibility
  const selectorQuestion = (meta.selector_question as string) || (meta.question as string) || "Identifica el estado de tu sistema comercial";
  const introText = (meta.intro_text as string) || "Tu motor de ingresos es como una pista modular. Cada pieza —proceso, dato, acuerdo, automatización— determina si tu lead llega al final o se pierde en el camino.";

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
            {introText}
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
            {selectorQuestion}
          </motion.p>

          {/* ── Track state cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {resolvedTracks.map((s, i) => {
              const Icon = s.icon;
              const Illust = s.illustration;
              const isSelected = selected === s.id;
              const hasSelection = selected !== null;
              const isDeemphasized = hasSelection && !isSelected;

              return (
                <motion.div
                  key={s.id}
                  {...fadeUp(0.25 + i * 0.08)}
                  className="relative"
                >
                  <motion.button
                    onClick={() => handleSelect(s.id)}
                    type="button"
                    className="relative w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-500 cursor-pointer group"
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
                      {(s.headline ?? "").split(".")[0]}.
                    </p>

                    <div
                      className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                      style={{ color: s.color }}
                    >
                      {isSelected ? "Seleccionado" : "Seleccionar"}
                      <ArrowRight size={14} className={`transition-transform duration-300 ${isSelected ? "rotate-90" : "group-hover:translate-x-1"}`} />
                    </div>
                  </motion.button>

                  {/* Mobile: expanded content directly below selected card */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -6 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="md:hidden overflow-hidden"
                      >
                        <TrackExpandedContent
                          state={s}
                          cardBg={(meta.card_bg as string) || undefined}
                          compact
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                    background: (meta.card_bg as string) || "hsl(var(--dark-bg))",
                    border: `1px solid ${selectedState.color}20`,
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
                    <a
                      href={(selectedState as any).ctaUrl || "#"}
                      className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] sm:text-[16px] font-bold transition-all duration-300 hover:scale-[1.03] ${selectedState.ctaStyle}`}
                      style={{ backgroundColor: selectedState.color, color: "white" }}
                    >
                      {selectedState.ctaText}
                      <ArrowRight size={18} />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default Methodology;
