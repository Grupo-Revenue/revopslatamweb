import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import pistaInicio from "@/assets/pista-inicio.svg";
import pistaMarketing from "@/assets/pista-marketing.svg";
import pistaVentas from "@/assets/pista-ventas.svg";
import pistaServicio from "@/assets/pista-servicio.svg";
import pistaCompleta from "@/assets/pista-completa.svg";
import type { HomeSection } from "@/hooks/useHomeSections";

/* ─── Track layers: each step reveals a new piece ─── */
const TRACK_LAYERS = [
  pistaInicio,         // 0 – pieces
  pistaMarketing,      // 1 – fall
  pistaVentas,         // 2 – broken
  pistaServicio,       // 3 – incomplete
  pistaCompleta,       // 4 – complete
];

/* ─── Story steps ─── */
const STEPS = [
  {
    id: "pieces",
    eyebrow: "Las piezas",
    title: "Cada pieza importa.",
    body: "Marketing, ventas, CRM, automatizaciones, procesos de servicio… cada una es una pieza de la pista. La pelotita, tu revenue, solo fluye si todas encajan perfectamente entre sí.",
    accent: "hsl(208 95% 44%)",
    accentHsl: "208 95% 44%",
  },
  {
    id: "fall",
    eyebrow: "La realidad",
    title: "Si una pieza falla, se cae.",
    body: "Aunque la pelotita sea buena, aunque tengas talento, producto y mercado, si las piezas no encajan, el revenue se frena, se desvía o se pierde. Y no sabes exactamente dónde.",
    highlight: "No les falta talento. Les falta un sistema bien diseñado.",
    accent: "hsl(266 66% 44%)",
    accentHsl: "266 66% 44%",
  },
  {
    id: "broken",
    eyebrow: "Estado 1, Pista rota",
    title: "Sin sistema, sin previsibilidad.",
    body: "Tus equipos trabajan con datos distintos. Cada vendedor reinventa el proceso desde cero. El forecast es ficción. Pierdes deals por falta de seguimiento, no por falta de demanda.",
    highlight: "El 70% de las empresas B2B en LATAM operan así. No estás solo, pero seguir así tiene un costo.",
    accent: "hsl(337 74% 44%)",
    accentHsl: "337 74% 44%",
  },
  {
    id: "incomplete",
    eyebrow: "Estado 2, Pista incompleta",
    title: "Base instalada, fricciones constantes.",
    body: "Tienes HubSpot u otro CRM pero lo usan al 30%. Los handoffs entre marketing, ventas y CS generan fricción constante. Generas datos, pero no los usas para tomar decisiones de revenue.",
    highlight: "Tu inversión en tecnología no se traduce en crecimiento real. Las mejores oportunidades se pierden en los gaps entre áreas.",
    accent: "hsl(42 93% 54%)",
    accentHsl: "42 93% 54%",
  },
  {
    id: "complete",
    eyebrow: "Estado 3, Pista bien armada",
    title: "Sistema fluido, listo para escalar.",
    body: "Procesos conectados. Revenue predecible con ±15% de precisión trimestral. Cada nuevo rep es productivo en menos de 30 días. El sistema escala sin depender de héroes individuales.",
    accent: "hsl(175 73% 37%)",
    accentHsl: "175 73% 37%",
  },
];

export default function PistaStorySticky({ section }: { section?: HomeSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActive, setMobileActive] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"situacion" | "senales">("situacion");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeStep = STEPS[activeIndex];
  const ctaUrl = section?.cta_url ?? "#";

  return (
    <section
      style={{
        background: `
          radial-gradient(circle at 20% 30%, hsl(var(--purple) / 0.04), transparent 40%),
          radial-gradient(circle at 80% 70%, hsl(var(--pink) / 0.03), transparent 40%),
          #F5F5F7
        `,
      }}
    >
      {/* ── Section intro title ── */}
      <div className="pt-24 pb-6 px-6 text-center max-w-[800px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "hsl(var(--pink))",
            marginBottom: 12,
          }}
        >
          El problema no es tu equipo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#1d1d1f",
          }}
        >
          Imagina que tu empresa es una{" "}
          <span className="text-gradient-brand">pista de Imánix.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#86868b",
            marginTop: 16,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          ¿Recuerdas esas pistas modulares donde una pelotita baja por rampas, curvas y túneles? El revenue de tu empresa funciona exactamente igual. Descubre cómo se rompe —y cómo se arma.
        </motion.p>
      </div>

      {/* ── Desktop: sticky layout ── */}
      <div
        className="mx-auto hidden lg:grid grid-cols-2"
        style={{ maxWidth: 1280, paddingLeft: 48, paddingRight: 48 }}
      >
        {/* ── Left: scrolling text ── */}
        <div className="flex flex-col" style={{ paddingTop: 16, paddingBottom: 60 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="flex flex-col justify-start"
              style={{ paddingTop: 32, paddingBottom: 48 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  style={{
                    borderLeft: `3px solid ${step.accent}`,
                    paddingLeft: 28,
                    opacity: activeIndex === i ? 1 : 0.35,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: 10,
                      color: step.accent,
                    }}
                  >
                    {step.eyebrow}
                  </p>

                  <h3
                    style={{
                      fontSize: "clamp(24px, 2.8vw, 40px)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.025em",
                      color: "#1d1d1f",
                      marginBottom: 14,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 17,
                      lineHeight: 1.7,
                      color: "#6e6e73",
                      maxWidth: 480,
                      marginBottom: step.highlight ? 14 : 0,
                    }}
                  >
                    {step.body}
                  </p>

                  {step.highlight && (
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.5,
                        color: step.accent,
                        padding: "12px 16px",
                        borderRadius: 12,
                        background: `${step.accent.replace(")", " / 0.06)")}`,
                        border: `1px solid ${step.accent.replace(")", " / 0.12)")}`,
                      }}
                    >
                      {step.highlight}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* ── Right: sticky layered track ── */}
        <div
          className="flex items-start justify-center sticky top-0"
          style={{ height: "100vh", paddingTop: "8vh" }}
        >
          <div className="relative" style={{ maxWidth: 540, width: "100%" }}>
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeStep.accent.replace(")", " / 0.1)")}, transparent 70%)`,
                transition: "background 1s ease",
                transform: "scale(1.5)",
              }}
            />

            {/* Layered SVG pieces */}
            <div className="relative w-full" style={{ aspectRatio: "779 / 881" }}>
              {TRACK_LAYERS.map((src, i) => {
                const isVisible = i <= activeIndex;
                const isComplete = i === 4;
                return (
                  <motion.img
                    key={`layer-${i}`}
                    src={src}
                    alt=""
                    className="absolute inset-0 w-full h-full select-none"
                    initial={false}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      scale: isVisible ? 1 : 0.95,
                      filter: isComplete && activeIndex === 4
                        ? "drop-shadow(0 0 40px hsl(175 73% 37% / 0.3))"
                        : "none",
                    }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    draggable={false}
                  />
                );
              })}
            </div>

            {/* Progress dots */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
              style={{ marginRight: -32 }}
            >
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: activeIndex === i ? 22 : 6,
                    borderRadius: 3,
                    background: activeIndex === i ? s.accent : "rgba(0,0,0,0.08)",
                    transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: narrative + states ── */}
      <div className="lg:hidden px-5 py-6">

        {/* ── Bloque A: Narrativa (siempre visible) ── */}
        <div className="flex flex-col gap-8 mb-10">
          {STEPS.slice(0, 2).map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{
                borderLeft: `3px solid ${step.accent}`,
                paddingLeft: 20,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: step.accent,
                  marginBottom: 6,
                }}
              >
                {step.eyebrow}
              </p>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#1d1d1f",
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "#6e6e73",
                  marginBottom: 14,
                }}
              >
                {step.body}
              </p>

              {/* Inline track image */}
              <div
                style={{
                  borderRadius: 14,
                  background: "#F5F5F7",
                  padding: "16px 12px",
                  marginBottom: step.highlight ? 14 : 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 60%, ${step.accent.replace(")", " / 0.06)")}, transparent 70%)`,
                  }}
                />
                <img
                  src={TRACK_LAYERS[i]}
                  alt=""
                  style={{ width: "100%", maxWidth: 180, margin: "0 auto", display: "block", position: "relative", zIndex: 1 }}
                  draggable={false}
                />
              </div>

              {step.highlight && (
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: step.accent,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: `${step.accent.replace(")", " / 0.05)")}`,
                    borderLeft: `3px solid ${step.accent}`,
                  }}
                >
                  {step.highlight}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Divider: transición a estados ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div
            style={{
              width: 40,
              height: 2,
              borderRadius: 1,
              background: "rgba(0,0,0,0.08)",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "hsl(var(--pink))",
              marginBottom: 6,
            }}
          >
            Identifica tu situación
          </p>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
            }}
          >
            ¿Dónde estás hoy?
          </h3>
        </motion.div>

        {/* ── Progress dots (3 estados) ── */}
        <div className="flex items-center gap-2 justify-center mb-5">
          {STEPS.slice(2).map((s, i) => (
            <div
              key={i}
              style={{
                width: mobileActive === i + 2 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: mobileActive === i + 2 ? s.accent : "rgba(0,0,0,0.08)",
                transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
          ))}
        </div>

        {/* ── Bloque B: 3 estados (accordion) ── */}
        <div className="flex flex-col gap-3">
          {STEPS.slice(2).map((step, realIdx) => {
            const i = realIdx + 2;
            const isOpen = mobileActive === i;
            return (
              <motion.div
                key={step.id}
                layout
                style={{
                  borderRadius: 20,
                  border: `1.5px solid ${isOpen ? step.accent : "rgba(0,0,0,0.06)"}`,
                  background: isOpen ? "#fff" : "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                  boxShadow: isOpen
                    ? `0 8px 32px ${step.accent.replace(")", " / 0.1)")}`
                    : "0 1px 4px rgba(0,0,0,0.03)",
                }}
                transition={{ layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
              >
                {/* Header */}
                <button
                  onClick={() => { setMobileActive(isOpen ? null : i); }}
                  className="w-full flex items-center gap-4 px-5 py-4"
                >
                  {/* Color badge */}
                  <div
                    className="shrink-0"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: step.accent,
                      boxShadow: isOpen ? `0 0 8px ${step.accent.replace(")", " / 0.4)")}` : "none",
                      transition: "box-shadow 0.3s ease",
                    }}
                  />

                  <div className="flex-1 text-left min-w-0">
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: isOpen ? step.accent : "#9ca3af",
                        marginBottom: 1,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {step.eyebrow}
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1d1d1f",
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </p>
                  </div>

                  <ChevronDown
                    size={18}
                    style={{
                      color: isOpen ? step.accent : "#c7c7cc",
                      transition: "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        {/* Track image */}
                        <div
                          style={{
                            borderRadius: 16,
                            background: "#F5F5F7",
                            padding: "20px 16px",
                            marginBottom: 16,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 50% 60%, ${step.accent.replace(")", " / 0.06)")}, transparent 70%)`,
                            }}
                          />
                          <motion.img
                            src={TRACK_LAYERS[i]}
                            alt=""
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{ width: "100%", maxWidth: 200, margin: "0 auto", display: "block", position: "relative", zIndex: 1 }}
                            draggable={false}
                          />
                        </div>

                        <p style={{ fontSize: 15, lineHeight: 1.65, color: "#6e6e73", marginBottom: step.highlight ? 12 : 0 }}>
                          {step.body}
                        </p>

                        {step.highlight && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              lineHeight: 1.5,
                              color: step.accent,
                              padding: "12px 14px",
                              borderRadius: 12,
                              background: `${step.accent.replace(")", " / 0.05)")}`,
                              borderLeft: `3px solid ${step.accent}`,
                            }}
                          >
                            {step.highlight}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom CTA closure (La solución) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center px-6 pb-24 pt-8"
        style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "hsl(var(--pink))",
            marginBottom: 16,
          }}
        >
          La solución
        </p>
        <h3
          style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#1d1d1f",
            marginBottom: 16,
          }}
        >
          No optimizamos una pieza aislada.{" "}
          <span className="text-gradient-brand">Conectamos todo el sistema.</span>
        </h3>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#6e6e73",
            marginBottom: 32,
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Diagnosticamos dónde se rompe tu pista y la reconstruimos pieza a pieza para que el revenue fluya sin fricción: predecible, escalable y sin depender de héroes.
        </p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3"
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            background: "var(--gradient-brand)",
            padding: "16px 36px",
            borderRadius: 999,
            boxShadow: "0 4px 24px hsl(var(--pink) / 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 6px 32px hsl(var(--pink) / 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 24px hsl(var(--pink) / 0.3)";
          }}
        >
          Diagnosticar mi sistema de revenue
          <ArrowRight size={18} />
        </a>
      </motion.div>
    </section>
  );
}
