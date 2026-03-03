import { useState } from "react";
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
  { icon: "TrendingUp", accent: "#BE1869", title: "Crecimos, pero el caos creció más.", text: "Más clientes, más herramientas, y cada mes es más difícil predecir y escalar." },
  { icon: "MessageSquare", accent: "#6224BE", title: "Marketing y ventas no se hablan.", text: "Cada equipo tiene su versión de la realidad. Los leads se enfrían." },
  { icon: "Monitor", accent: "#0779D7", title: "Tienes HubSpot pero no lo usas bien.", text: "Pagaste la licencia y hoy es un Excel con login. El potencial está ahí." },
  { icon: "BarChart3", accent: "#F7BE1A", title: "No puedes predecir el cierre de mes.", text: "Tu forecast es intuición, no proyección. Eso no escala." },
  { icon: "UserRound", accent: "#1CA398", title: "Contrataste un Gerente Comercial y sigue el caos.", text: "Sin procesos ni datos confiables, hasta el mejor opera a ciegas." },
];

interface SymptomData { icon: string; title: string; text: string; accent?: string; }

const SymptomCard = ({ s, delay }: { s: SymptomData; delay: number }) => {
  const Icon = iconMap[s.icon] || TrendingUp;
  const accent = s.accent || "#BE1869";
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left rounded-2xl p-7 sm:p-8 transition-all duration-300"
      style={{
        background: "transparent",
        border: "1px solid #22262A",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300"
          style={{ background: hovered ? `${accent}15` : "hsl(var(--muted))" }}
        >
          <Icon
            size={18}
            className="transition-colors duration-300"
            style={{ color: hovered ? accent : "hsl(var(--muted-foreground))" }}
          />
        </span>
        <h3
          className="text-[15px] sm:text-base font-semibold leading-tight"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {s.title}
        </h3>
      </div>
      <p className="text-[13px] sm:text-sm leading-relaxed text-muted-foreground">
        {s.text}
      </p>
    </motion.div>
  );
};

const Symptoms = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const cards: SymptomData[] = Array.isArray(meta.cards)
    ? meta.cards.filter((item): item is SymptomData => {
        if (!item || typeof item !== "object") return false;
        const card = item as Record<string, unknown>;
        return typeof card.icon === "string" && typeof card.title === "string" && typeof card.text === "string";
      })
    : defaultSymptoms;
  const eyebrow = section?.subtitle ?? "¿Te suena familiar?";
  const headline = section?.title ?? "Si diriges una empresa que ya creció, probablemente reconoces esto.";

  const sectionBg = getBgStyle();

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6" style={{ background: "hsl(var(--background))", ...sectionBg }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.p {...fadeUp(0)} className="text-center font-semibold tracking-[0.15em] uppercase text-[13px] text-muted-foreground" style={getStyle("subtitle")}>
          {eyebrow}
        </motion.p>
        <motion.h2 {...fadeUp(0.1)} className="mt-4 text-center text-[26px] md:text-[36px] leading-[1.25] tracking-tight max-w-[800px] mx-auto font-bold" style={{ color: "hsl(var(--foreground))", ...getStyle("title") }}>
          {headline}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.slice(0, 3).map((s, i) => (
            <SymptomCard key={i} s={s} delay={0.15 + i * 0.08} />
          ))}
        </div>
        <div className="mt-5 lg:mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 md:max-w-[calc(66.666%+0.75rem)] mx-auto">
          {cards.slice(3).map((s, i) => (
            <SymptomCard key={i + 3} s={s} delay={0.4 + i * 0.08} />
          ))}
        </div>

        {/* Bloque final — diagnóstico sobrio */}
        {(() => {
          const closingBgImage = meta.closing_bg_image as string | undefined;
          const closingGradient = meta.closing_gradient as string | undefined;
          const closingBgColor = meta.closing_bg_color as string | undefined;
          const closingLine1 = (meta.closing_line1 as string) || "No es un problema de talento.";
          const closingLine2 = (meta.closing_line2 as string) || "Es un problema de sistema.";
          const closingOpacity = typeof meta.closing_bg_opacity === "number" ? meta.closing_bg_opacity : 1;

          return (
            <motion.div
              {...fadeUp(0.6)}
              className="relative mt-16 sm:mt-20 mx-auto max-w-[680px] text-center rounded-2xl overflow-hidden"
              style={{
                background: closingGradient || closingBgColor || "hsl(var(--dark-bg))",
                padding: "clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)",
              }}
            >
              {closingBgImage && (
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url(${closingBgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: closingOpacity,
                  }}
                />
              )}
              <div className="relative z-10">
                <p className="text-[17px] sm:text-lg leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.6)" }}>
                  {closingLine1}
                </p>
                <p className="mt-1 text-[20px] sm:text-[22px] font-bold leading-snug" style={{ color: "hsl(0 0% 100% / 0.95)" }}>
                  {closingLine2}
                </p>
              </div>
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
};

export default Symptoms;
