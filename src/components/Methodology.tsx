import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
const pistaRota = "/images/pista-rota.png";
const pistaIncompleta = "/images/pista-incompleta.png";
const pistaArmada = "/images/pista-armada.png";

/* ── Stage data ── */
interface TrackStage {
  id: string;
  image: string;
  color: string;
  title: string;
  subtitle: string;
  signals: string[];
  consequences: { label: string; items: string[] };
  ctaText?: string;
  ctaStyle?: string;
}

const stages: TrackStage[] = [
  {
    id: "broken",
    image: pistaRota,
    color: "hsl(337 74% 44%)",
    title: "Tu crecimiento depende de personas, no de sistema.",
    subtitle: "Sin procesos integrados, sin datos confiables, sin previsibilidad.",
    signals: [
      "Equipos de venta, marketing y CS desconectados",
      "Forecast impreciso o inexistente",
      "Dependencia total de esfuerzo individual",
    ],
    consequences: {
      label: "Si no lo corriges",
      items: [
        "Inestabilidad operativa constante",
        "La rotación de personas impacta directamente tu revenue",
        "Crecimiento impredecible trimestre a trimestre",
      ],
    },
  },
  {
    id: "incomplete",
    image: pistaIncompleta,
    color: "hsl(42 93% 46%)",
    title: "Tienes estructura, pero no un sistema predecible.",
    subtitle: "Herramientas instaladas. Procesos parciales. Fricción constante.",
    signals: [
      "CRM implementado, pero mal adoptado",
      "Datos inconsistentes entre áreas",
      "Automatizaciones aisladas sin integración",
    ],
    consequences: {
      label: "Si no lo resuelves",
      items: [
        "Escalas más lento de lo que deberías",
        "Dependencia operativa de pocas personas",
        "Pérdida de eficiencia en cada handoff",
      ],
    },
  },
  {
    id: "complete",
    image: pistaArmada,
    color: "hsl(175 73% 37%)",
    title: "Tu sistema funciona. Ahora toca escalar.",
    subtitle: "Procesos integrados. Datos confiables. Revenue predecible.",
    signals: [
      "Forecast preciso con ±15% de margen",
      "Onboarding de nuevos reps en menos de 30 días",
      "Marketing y ventas alineados en un solo pipeline",
    ],
    consequences: {
      label: "Riesgo si no evolucionas",
      items: [
        "Estancamiento en el crecimiento",
        "Deuda técnica operativa acumulada",
        "Falta de optimización continua",
      ],
    },
    ctaText: "Escalar con RevOps as a Service",
    ctaStyle: "bg-[hsl(175_73%_37%)] text-white",
  },
];

/* ── Single stage block ── */
const StageBlock = ({ stage, index }: { stage: TrackStage; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [30, 0]);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative py-16 sm:py-24 md:py-32">
      {/* Subtle connecting line between stages */}
      {index < stages.length - 1 && (
        <div
          className="absolute left-1/2 -translate-x-px bottom-0 w-[1px] h-16 sm:h-24"
          style={{
            background: `linear-gradient(to bottom, ${stage.color}30, transparent)`,
          }}
        />
      )}

      <div
        className={`max-w-[1100px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
          isEven ? "" : "md:[direction:rtl]"
        }`}
      >
        {/* Image */}
        <motion.div
          style={{ y: imgY, opacity: imgOpacity }}
          className={`relative ${isEven ? "" : "md:[direction:ltr]"}`}
        >
          <img
            src={stage.image}
            alt={stage.title}
            className="w-full max-w-[420px] mx-auto h-auto"
            loading="lazy"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className={`${isEven ? "" : "md:[direction:ltr]"}`}
        >
          {/* Stage indicator */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: stage.color }}
            />
            <span
              className="text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: stage.color }}
            >
              Etapa {index + 1} de {stages.length}
            </span>
          </div>

          <h3
            className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {stage.title}
          </h3>

          <p
            className="mt-3 text-[14px] sm:text-[16px] leading-relaxed max-w-[480px]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {stage.subtitle}
          </p>

          {/* Signals */}
          <ul className="mt-6 space-y-2.5">
            {stage.signals.map((sig, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: stage.color }}
                />
                <span
                  className="text-[13px] sm:text-[14px] leading-relaxed"
                  style={{ color: "hsl(var(--foreground) / 0.8)" }}
                >
                  {sig}
                </span>
              </li>
            ))}
          </ul>

          {/* Consequences */}
          <div
            className="mt-6 pt-5"
            style={{ borderTop: `1px solid hsl(var(--foreground) / 0.06)` }}
          >
            <p
              className="text-[11px] sm:text-[12px] font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {stage.consequences.label}
            </p>
            <ul className="space-y-2">
              {stage.consequences.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/20" />
                  <span
                    className="text-[13px] sm:text-[14px] leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA for last stage */}
          {stage.ctaText && (
            <div className="mt-8">
              <a
                href="#contacto"
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] sm:text-[15px] font-bold transition-all duration-300 hover:scale-[1.03] shadow-lg ${stage.ctaStyle}`}
              >
                {stage.ctaText}
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

/* ── Main component ── */
const Methodology = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const eyebrow = section?.subtitle ?? "Nuestra metodología";
  const headline =
    section?.title ?? "¿Tu crecimiento depende de personas\no de un sistema?";
  const headlineParts = headline.split("\n");

  return (
    <section className="relative" id="metodologia">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20"
        >
          <path
            d="M0,0 L1440,0 L1440,40 Q1080,80 720,60 Q360,40 0,80 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      <div
        className="relative pt-20 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6"
        style={{ background: "#F5F5F8", ...getBgStyle() }}
      >
        {hasBg && <div style={bgLayerStyle} />}
        <div className="relative z-10">
          {/* ── Header ── */}
          <div className="max-w-[1100px] mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}
            >
              {eyebrow}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 text-[24px] sm:text-[28px] md:text-[38px] font-bold leading-[1.15] tracking-tight max-w-[700px] mx-auto"
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-4 text-[15px] sm:text-[17px] leading-relaxed max-w-[560px] mx-auto"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Tu motor de ingresos es como una pista modular. Cada pieza
              —proceso, dato, acuerdo, automatización— determina si tu revenue
              es predecible o caótico.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center my-8 sm:my-10"
            >
              <div
                className="h-[3px] w-20 rounded-full"
                style={{ background: "var(--gradient-brand)" }}
              />
            </motion.div>
          </div>

          {/* ── Stages ── */}
          {stages.map((stage, i) => (
            <StageBlock key={stage.id} stage={stage} index={i} />
          ))}

          {/* ── Bottom CTA strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-[800px] mx-auto text-center pt-8 pb-4"
          >
            <p
              className="text-[18px] sm:text-[22px] font-semibold mb-8"
              style={{ color: "hsl(var(--foreground))" }}
            >
              ¿En qué etapa está hoy tu sistema?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {[
                {
                  label: "Diagnosticar mi motor",
                  color: "hsl(337 74% 44%)",
                  href: "#diagnostico",
                },
                {
                  label: "Optimizar mi sistema",
                  color: "hsl(42 93% 46%)",
                  href: "#optimizar",
                },
                {
                  label: "Escalar con RevOps",
                  color: "hsl(175 73% 37%)",
                  href: "#escalar",
                },
              ].map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-semibold transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    color: btn.color,
                    border: `1.5px solid ${btn.color}30`,
                    background: `${btn.color}08`,
                  }}
                >
                  {btn.label}
                  <ArrowRight size={14} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
