import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import pistaImg from "@/assets/pista-negro-3.svg";
import type { HomeSection } from "@/hooks/useHomeSections";

/* ─── Story steps ─── */
const STEPS = [
  {
    id: "intro",
    eyebrow: "La metáfora",
    title: "Imagina que tu empresa es una pista de Imánix.",
    body: "La pelotita —el revenue— solo fluye si cada pieza encaja perfectamente: marketing, ventas, CRM, automatizaciones y procesos.",
    highlight: "Si una pieza falla, se cae. Aunque la pelotita sea buena.",
    trackStyle: { opacity: 0.25, filter: "grayscale(1) brightness(0.9)", transform: "scale(0.95)" },
  },
  {
    id: "broken",
    eyebrow: "Estado 1",
    title: "Pista rota",
    body: "Tus equipos trabajan con datos distintos. Cada vendedor reinventa el proceso desde cero. El forecast es ficción. No les falta talento, les falta sistema.",
    highlight: "El 70% de las empresas B2B en LATAM operan así.",
    trackStyle: { opacity: 0.5, filter: "grayscale(0.6) brightness(0.85) drop-shadow(0 0 30px rgba(190,24,105,0.3))", transform: "scale(1)" },
    color: "#BE1869",
    rgb: "190,24,105",
  },
  {
    id: "incomplete",
    eyebrow: "Estado 2",
    title: "Pista incompleta",
    body: "Tienes CRM pero lo usan al 30%. Los handoffs entre marketing, ventas y CS generan fricción constante. Generas datos pero no los usas para decidir.",
    highlight: "La tecnología no se traduce en crecimiento real.",
    trackStyle: { opacity: 0.7, filter: "grayscale(0.25) brightness(0.95) drop-shadow(0 0 30px rgba(212,160,23,0.3))", transform: "scale(1)" },
    color: "#D4A017",
    rgb: "212,160,23",
  },
  {
    id: "complete",
    eyebrow: "Estado 3",
    title: "Pista bien armada",
    body: "Tus procesos están conectados, el revenue es predecible y cada nuevo rep es productivo rápido. RevOps LATAM ordena y conecta todo el sistema.",
    highlight: "Revenue predecible, escalable, sin depender de héroes individuales.",
    trackStyle: { opacity: 1, filter: "none", transform: "scale(1.02)" },
    color: "#1CA398",
    rgb: "28,163,152",
  },
];

export default function PistaStorySticky({ section }: { section?: HomeSection }) {
  const containerRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeStep = STEPS[activeIndex];
  const ctaUrl = section?.cta_url ?? "#";

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(120,80,255,0.04), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,0,120,0.03), transparent 40%),
          #F5F5F7
        `,
      }}
    >
      {/* Label */}
      <div className="text-center pt-24 pb-8 px-6">
        <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#86868b", background: "rgba(0,0,0,0.04)", padding: "6px 16px", borderRadius: 999 }}>
          Variante A — Sticky lateral
        </span>
      </div>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2" style={{ maxWidth: 1280, paddingLeft: 40, paddingRight: 40 }}>
        {/* ── Left: scrolling text blocks ── */}
        <div className="flex flex-col" style={{ paddingTop: 80, paddingBottom: 80 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="flex flex-col justify-center"
              style={{ minHeight: "70vh", paddingTop: 40, paddingBottom: 40 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6 }}
              >
                <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: step.color ?? "#86868b", marginBottom: 12 }}>
                  {step.eyebrow}
                </p>
                <h3
                  style={{
                    fontSize: "clamp(24px, 3vw, 40px)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "#1d1d1f",
                    marginBottom: 16,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: "#4b5563", maxWidth: 480, marginBottom: 12 }}>
                  {step.body}
                </p>
                {step.highlight && (
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: step.color ?? "#1d1d1f",
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: step.color ? `rgba(${step.rgb},0.06)` : "rgba(120,80,255,0.04)",
                      borderLeft: `3px solid ${step.color ?? "rgba(120,80,255,0.3)"}`,
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
                    className="group inline-flex items-center gap-3 mt-6"
                    style={{ fontSize: 16, fontWeight: 500, color: "#1d1d1f", textDecoration: "none" }}
                  >
                    <span
                      className="transition-transform duration-300 group-hover:scale-105"
                      style={{
                        width: 44, height: 44, borderRadius: 999,
                        background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
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
        <div className="hidden lg:flex items-center justify-center sticky top-0" style={{ height: "100vh" }}>
          <div className="relative" style={{ maxWidth: 440, width: "100%" }}>
            <img
              src={pistaImg}
              alt="Pista modular Imánix"
              className="w-full h-auto select-none"
              style={{
                ...activeStep.trackStyle,
                transition: "all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              draggable={false}
            />

            {/* Color ring overlay */}
            {activeStep.color && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: `2px solid ${activeStep.color}`,
                  opacity: 0.15,
                  transform: "scale(1.1)",
                  transition: "all 0.6s ease",
                }}
              />
            )}

            {/* State label */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: activeStep.color ?? "#86868b",
                background: activeStep.color ? `rgba(${activeStep.rgb},0.08)` : "rgba(0,0,0,0.04)",
                border: `1px solid ${activeStep.color ? `rgba(${activeStep.rgb},0.2)` : "rgba(0,0,0,0.06)"}`,
                backdropFilter: "blur(8px)",
                transition: "all 0.5s ease",
              }}
            >
              {activeStep.title}
            </div>
          </div>
        </div>

        {/* Mobile: show track inline after intro */}
        <div className="lg:hidden flex justify-center py-8">
          <img
            src={pistaImg}
            alt="Pista modular Imánix"
            style={{ maxWidth: 300, width: "100%", opacity: 0.6 }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
