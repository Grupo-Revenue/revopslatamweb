import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, Monitor, BarChart3, UserRound } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const iconMap: Record<string, typeof TrendingUp> = {
  TrendingUp, MessageSquare, Monitor, BarChart3, UserRound,
};

const defaultSymptoms = [
  {
    icon: "TrendingUp",
    accent: "#BE1869",
    title: "El crecimiento expuso el desorden.",
    text: "Más clientes. Más equipo. Más herramientas.\nPero ningún sistema que lo sostenga.",
  },
  {
    icon: "MessageSquare",
    accent: "#6224BE",
    title: "Cada equipo defiende su versión de la realidad.",
    text: "Marketing mide una cosa.\nVentas culpa a otra.\nEl revenue se enfría.",
  },
  {
    icon: "Monitor",
    accent: "#0779D7",
    title: "Pagaste la herramienta. No diseñaste el sistema.",
    text: "HubSpot no está mal.\nTu arquitectura sí.",
  },
  {
    icon: "BarChart3",
    accent: "#F7BE1A",
    title: "No puedes proyectar con certeza.",
    text: "El directorio pregunta.\nTú estimas.\n\nEso no escala.",
  },
  {
    icon: "UserRound",
    accent: "#1CA398",
    title: "Ni el mejor líder puede arreglar un sistema roto.",
    text: "Sin procesos claros ni datos confiables,\ntodo depende de esfuerzo individual.",
  },
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

interface SymptomData { icon: string; accent: string; title: string; text: string; }

const SymptomCard = ({ s, delay }: { s: SymptomData; delay: number }) => {
  const Icon = iconMap[s.icon] || TrendingUp;
  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative"
      style={{
        background: "#FFFFFF",
        borderLeft: `3px solid ${s.accent}`,
        borderRadius: "6px",
        padding: "clamp(24px, 4vw, 36px)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      whileHover={{
        boxShadow: `0 8px 30px ${hexToRgba(s.accent, 0.1)}`,
        y: -2,
        transition: { duration: 0.3 },
      }}
    >
      <div
        className="w-9 h-9 rounded flex items-center justify-center mb-5"
        style={{ background: hexToRgba(s.accent, 0.08) }}
      >
        <Icon size={17} style={{ color: s.accent }} strokeWidth={2.5} />
      </div>
      <h4
        className="mb-3"
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "#1A1A2E",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {s.title}
      </h4>
      <p
        style={{
          fontSize: "14px",
          color: "#6B7280",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {s.text}
      </p>
    </motion.div>
  );
};

const Symptoms = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const cards = (meta.cards as SymptomData[]) ?? defaultSymptoms;
  const eyebrow = section?.subtitle ?? "Señales que no puedes seguir ignorando";
  const headline = section?.title ?? "Tu empresa creció.\nTu sistema no.";
  const subheadline = (meta.subheadline as string) ?? "Y ahora el desorden está empezando a costarte margen, foco y previsibilidad.";
  const closingText = (meta.closing_text as string) ?? "Si reconoces dos o más de estos puntos,\nno tienes un problema de talento.";
  const closingBold = (meta.closing_bold as string) ?? "Tienes un problema de sistema.";
  const closingSmall = (meta.closing_small as string) ?? "Y los sistemas mal diseñados no escalan.";

  const sectionBg = getBgStyle();

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6"
      style={{ background: "#F5F5F8", ...sectionBg }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="text-center uppercase tracking-[0.2em]"
          style={{
            color: "#BE1869",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            ...getStyle("subtitle"),
          }}
        >
          {eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-5 text-center mx-auto"
          style={{
            color: "#1A1A2E",
            fontSize: "clamp(30px, 5vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "600px",
            whiteSpace: "pre-line",
            ...getStyle("title"),
          }}
        >
          {headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.14)}
          className="mt-5 text-center mx-auto"
          style={{
            color: "#6B7280",
            fontSize: "17px",
            lineHeight: 1.5,
            maxWidth: "520px",
            fontWeight: 400,
          }}
        >
          {subheadline}
        </motion.p>

        {/* Cards grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.slice(0, 3).map((s, i) => (
            <SymptomCard key={i} s={s} delay={0.15 + i * 0.08} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 md:max-w-[calc(66.666%+0.625rem)] mx-auto">
          {cards.slice(3).map((s, i) => (
            <SymptomCard key={i + 3} s={s} delay={0.39 + i * 0.08} />
          ))}
        </div>

        {/* Closing diagnostic block */}
        <motion.div
          {...fadeUp(0.55)}
          className="mt-16 sm:mt-20 mx-auto max-w-[680px] text-center"
          style={{
            background: "#1A1A2E",
            borderRadius: "8px",
            padding: "clamp(28px, 5vw, 44px) clamp(24px, 5vw, 56px)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "16px",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              ...getStyle("body"),
            }}
          >
            {closingText}
          </p>
          <p
            className="mt-4"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {closingBold}
          </p>
          {closingSmall && (
            <p
              className="mt-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              {closingSmall}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Symptoms;
