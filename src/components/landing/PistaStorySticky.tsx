import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import pistaImg from "@/assets/pista-negro-3.svg";
import type { HomeSection } from "@/hooks/useHomeSections";

/* ─── Story steps — longer narrative ─── */
const STEPS = [
  {
    id: "metaphor",
    eyebrow: "La metáfora",
    title: "Imagina que tu empresa es una pista de Imánix.",
    body: "¿Recuerdas esas pistas modulares donde una pelotita baja por rampas, curvas y túneles? El revenue de tu empresa funciona exactamente igual.",
    accent: "#784ba0",
    accentRgb: "120,75,160",
    trackStyle: { opacity: 0.15, filter: "grayscale(1) brightness(0.9)", transform: "scale(0.92)" },
  },
  {
    id: "pieces",
    eyebrow: "Las piezas",
    title: "Cada pieza importa.",
    body: "Marketing, ventas, CRM, automatizaciones, procesos de servicio… cada una es una pieza de la pista. La pelotita —tu revenue— solo fluye si todas encajan perfectamente entre sí.",
    accent: "#6366f1",
    accentRgb: "99,102,241",
    trackStyle: { opacity: 0.3, filter: "grayscale(0.7) brightness(0.9)", transform: "scale(0.96)" },
  },
  {
    id: "fall",
    eyebrow: "La realidad",
    title: "Si una pieza falla, se cae.",
    body: "Aunque la pelotita sea buena —aunque tengas talento, producto y mercado— si las piezas no encajan, el revenue se frena, se desvía o se pierde. Y no sabes exactamente dónde.",
    highlight: "No les falta talento. Les falta un sistema bien diseñado.",
    accent: "#ef4444",
    accentRgb: "239,68,68",
    trackStyle: { opacity: 0.4, filter: "grayscale(0.5) brightness(0.85) drop-shadow(0 0 30px rgba(239,68,68,0.25))", transform: "scale(1)" },
  },
  {
    id: "broken",
    eyebrow: "Estado 1 — Pista rota",
    title: "Sin sistema, sin previsibilidad.",
    body: "Tus equipos trabajan con datos distintos. Cada vendedor reinventa el proceso desde cero. El forecast es ficción. Pierdes deals por falta de seguimiento, no por falta de demanda.",
    highlight: "El 70% de las empresas B2B en LATAM operan así. No estás solo, pero seguir así tiene un costo.",
    accent: "#BE1869",
    accentRgb: "190,24,105",
    trackStyle: { opacity: 0.5, filter: "grayscale(0.4) brightness(0.85) drop-shadow(0 0 35px rgba(190,24,105,0.35))", transform: "scale(1)" },
  },
  {
    id: "incomplete",
    eyebrow: "Estado 2 — Pista incompleta",
    title: "Base instalada, fricciones constantes.",
    body: "Tienes HubSpot u otro CRM pero lo usan al 30%. Los handoffs entre marketing, ventas y CS generan fricción constante. Generas datos, pero no los usas para tomar decisiones de revenue.",
    highlight: "Tu inversión en tecnología no se traduce en crecimiento real. Las mejores oportunidades se pierden en los gaps entre áreas.",
    accent: "#D4A017",
    accentRgb: "212,160,23",
    trackStyle: { opacity: 0.7, filter: "grayscale(0.2) brightness(0.95) drop-shadow(0 0 35px rgba(212,160,23,0.3))", transform: "scale(1.01)" },
  },
  {
    id: "complete",
    eyebrow: "Estado 3 — Pista bien armada",
    title: "Sistema fluido, listo para escalar.",
    body: "Procesos conectados. Revenue predecible con ±15% de precisión trimestral. Cada nuevo rep es productivo en menos de 30 días. El sistema escala sin depender de héroes individuales.",
    accent: "#1CA398",
    accentRgb: "28,163,152",
    trackStyle: { opacity: 0.9, filter: "brightness(1.05) drop-shadow(0 0 30px rgba(28,163,152,0.25))", transform: "scale(1.03)" },
  },
  {
    id: "solution",
    eyebrow: "La solución",
    title: "RevOps LATAM no optimiza una pieza aislada.",
    body: "Ordena y conecta todo el sistema para que el revenue fluya sin fricción: predecible, escalable y sin depender de héroes individuales. Diagnosticamos dónde se rompe tu pista y la reconstruimos pieza a pieza.",
    accent: "#2b86c5",
    accentRgb: "43,134,197",
    trackStyle: { opacity: 1, filter: "none", transform: "scale(1.05)" },
  },
];

export default function PistaStorySticky({ section }: { section?: HomeSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
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
      { threshold: 0.55, rootMargin: "-15% 0px -15% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeStep = STEPS[activeIndex];
  const ctaUrl = section?.cta_url ?? "#";

  return (
    <section
      className="relative"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(120,80,255,0.04), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,0,120,0.03), transparent 40%),
          #F5F5F7
        `,
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2"
        style={{ maxWidth: 1280, paddingLeft: 40, paddingRight: 40 }}
      >
        {/* ── Left: scrolling text blocks ── */}
        <div className="flex flex-col" style={{ paddingTop: 100, paddingBottom: 100 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="flex flex-col justify-center"
              style={{ minHeight: "50vh", paddingTop: 24, paddingBottom: 24 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5 }}
                style={{
                  borderLeft: `3px solid`,
                  borderImage: `linear-gradient(180deg, rgba(${step.accentRgb},0.5), rgba(${step.accentRgb},0.05)) 1`,
                  paddingLeft: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 8,
                    color: step.accent,
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.eyebrow}
                </p>

                <h3
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 36px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "#1d1d1f",
                    marginBottom: 12,
                  }}
                >
                  {step.title.includes("Imánix") ? (
                    <>
                      Imagina que tu empresa es una{" "}
                      <span
                        style={{
                          background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        pista de Imánix.
                      </span>
                    </>
                  ) : (
                    step.title
                  )}
                </h3>

                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "#4b5563",
                    maxWidth: 480,
                    marginBottom: step.highlight ? 12 : 0,
                  }}
                >
                  {step.body}
                </p>

                {step.highlight && (
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.5,
                      color: step.accent,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: `rgba(${step.accentRgb}, 0.06)`,
                    }}
                  >
                    {step.highlight}
                  </p>
                )}

                {/* CTA on last step */}
                {i === STEPS.length - 1 && (
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 mt-5"
                    style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", textDecoration: "none" }}
                  >
                    <span
                      className="transition-transform duration-300 group-hover:scale-105"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowRight size={18} color="#fff" />
                    </span>
                    Diagnosticar mi sistema de revenue
                  </a>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* ── Right: sticky track ── */}
        <div
          className="hidden lg:flex items-center justify-center sticky top-0"
          style={{ height: "100vh" }}
        >
          <div className="relative" style={{ maxWidth: 440, width: "100%" }}>
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(${activeStep.accentRgb}, 0.08), transparent 70%)`,
                transition: "background 0.8s ease",
                transform: "scale(1.4)",
              }}
            />

            <img
              src={pistaImg}
              alt="Pista modular Imánix"
              className="w-full h-auto select-none relative z-10"
              style={{
                ...activeStep.trackStyle,
                transition: "all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              draggable={false}
            />

            {/* State label */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
              style={{
                padding: "5px 14px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: activeStep.accent,
                background: `rgba(${activeStep.accentRgb}, 0.08)`,
                border: `1px solid rgba(${activeStep.accentRgb}, 0.15)`,
                backdropFilter: "blur(8px)",
                transition: "all 0.5s ease",
                whiteSpace: "nowrap",
              }}
            >
              {activeStep.eyebrow}
            </div>

            {/* Progress indicator */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
              style={{ marginRight: -28 }}
            >
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: activeIndex === i ? 20 : 6,
                    borderRadius: 2,
                    background: activeIndex === i ? STEPS[i].accent : "rgba(0,0,0,0.1)",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: show track inline */}
        <div className="lg:hidden flex justify-center py-6">
          <img
            src={pistaImg}
            alt="Pista modular Imánix"
            style={{ maxWidth: 280, width: "100%", opacity: 0.5 }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
