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
  { icon: "TrendingUp", title: "Crecimos, pero el caos creció más.", text: "Más clientes, más herramientas, y cada mes es más difícil predecir y escalar." },
  { icon: "MessageSquare", title: "Marketing y ventas no se hablan.", text: "Cada equipo tiene su versión de la realidad. Los leads se enfrían." },
  { icon: "Monitor", title: "Tienes HubSpot pero no lo usas bien.", text: "Pagaste la licencia y hoy es un Excel con login. El potencial está ahí." },
  { icon: "BarChart3", title: "No puedes predecir el cierre de mes.", text: "Tu forecast es intuición, no proyección. Eso no escala." },
  { icon: "UserRound", title: "Contrataste un Gerente Comercial y sigue el caos.", text: "Sin procesos ni datos confiables, hasta el mejor opera a ciegas." },
];

interface SymptomData { icon: string; title: string; text: string; accent?: string; }

const SymptomCard = ({ s, delay }: { s: SymptomData; delay: number }) => {
  const Icon = iconMap[s.icon] || TrendingUp;
  return (
    <motion.div
      {...fadeUp(delay)}
      className="text-left rounded-2xl p-7 sm:p-8 transition-shadow duration-300 hover:shadow-md"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: "hsl(var(--muted))" }}
        >
          <Icon size={18} className="text-muted-foreground" />
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
  const cards = (meta.cards as SymptomData[]) ?? defaultSymptoms;
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
        <motion.div
          {...fadeUp(0.6)}
          className="mt-16 sm:mt-20 mx-auto max-w-[680px] text-center rounded-2xl"
          style={{
            background: "hsl(var(--dark-bg))",
            padding: "clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)",
          }}
        >
          <p className="text-[17px] sm:text-lg leading-relaxed" style={{ color: "hsl(0 0% 100% / 0.6)" }}>
            No es un problema de talento.
          </p>
          <p className="mt-1 text-[20px] sm:text-[22px] font-bold leading-snug" style={{ color: "hsl(0 0% 100% / 0.95)" }}>
            Es un problema de sistema.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Symptoms;
