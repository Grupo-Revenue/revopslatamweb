import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import pistaImg from "@/assets/pista-negro-3.svg";
import type { HomeSection } from "@/hooks/useHomeSections";

const STEPS = [
  {
    id: "intro",
    title: "Imagina que tu empresa es una pista de Imánix.",
    body: "La pelotita —el revenue— solo fluye si cada pieza encaja perfectamente.\nSi una falla, se cae. Aunque la pelotita sea buena.",
    trackOpacity: 0.15,
    trackFilter: "grayscale(1) brightness(0.8)",
    bgGradient: "radial-gradient(circle at 50% 50%, rgba(120,80,255,0.06), transparent 60%)",
  },
  {
    id: "broken",
    title: "Pista rota",
    subtitle: "Sin sistema, sin previsibilidad",
    body: "Tus equipos trabajan con datos distintos. Cada vendedor reinventa el proceso. El forecast es ficción.\n\nNo les falta talento. Les falta un sistema bien diseñado.",
    trackOpacity: 0.4,
    trackFilter: "grayscale(0.5) brightness(0.85) drop-shadow(0 0 40px rgba(190,24,105,0.4))",
    color: "#BE1869",
    bgGradient: "radial-gradient(circle at 50% 60%, rgba(190,24,105,0.06), transparent 50%)",
  },
  {
    id: "incomplete",
    title: "Pista incompleta",
    subtitle: "Base instalada, fricciones constantes",
    body: "Tienes CRM pero lo usan al 30%. Los handoffs generan fricción constante. La tecnología no se traduce en crecimiento real.",
    trackOpacity: 0.6,
    trackFilter: "grayscale(0.2) brightness(0.95) drop-shadow(0 0 40px rgba(212,160,23,0.35))",
    color: "#D4A017",
    bgGradient: "radial-gradient(circle at 50% 50%, rgba(212,160,23,0.06), transparent 50%)",
  },
  {
    id: "complete",
    title: "Pista bien armada",
    subtitle: "Sistema fluido, listo para escalar",
    body: "Procesos conectados, revenue predecible. RevOps LATAM ordena y conecta todo el sistema para que el revenue fluya sin fricción.\n\nPredecible, escalable, sin depender de héroes individuales.",
    trackOpacity: 1,
    trackFilter: "none",
    color: "#1CA398",
    bgGradient: "radial-gradient(circle at 50% 40%, rgba(28,163,152,0.06), transparent 50%)",
  },
];

export default function PistaStoryFullscreen({ section }: { section?: HomeSection }) {
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
      { threshold: 0.4 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ctaUrl = section?.cta_url ?? "#";

  return (
    <section className="relative" style={{ background: "#F5F5F7" }}>
      {/* Label */}
      <div className="text-center pt-24 pb-4 px-6">
        <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#86868b", background: "rgba(0,0,0,0.04)", padding: "6px 16px", borderRadius: 999 }}>
          Variante B — Fullscreen secuencial
        </span>
      </div>

      {STEPS.map((step, i) => (
        <div
          key={step.id}
          ref={(el) => { stepRefs.current[i] = el; }}
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: "100vh" }}
        >
          {/* Background gradient per step */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ background: step.bgGradient }}
          />

          {/* Track behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={pistaImg}
              alt=""
              className="select-none"
              style={{
                width: "min(55vw, 500px)",
                height: "auto",
                opacity: activeIndex === i ? step.trackOpacity : 0.05,
                filter: activeIndex === i ? step.trackFilter : "grayscale(1) brightness(0.9)",
                transition: "all 1s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              draggable={false}
            />
          </div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center px-6"
            style={{ maxWidth: 640 }}
          >
            {step.subtitle && (
              <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: step.color ?? "#86868b", marginBottom: 12 }}>
                {step.subtitle}
              </p>
            )}

            <h2
              style={{
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                marginBottom: 20,
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
            </h2>

            {step.body.split("\n\n").map((paragraph, j) => (
              <p
                key={j}
                style={{
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: "#4b5563",
                  marginBottom: 12,
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {STEPS.map((_, j) => (
                <div
                  key={j}
                  style={{
                    width: activeIndex === j ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: activeIndex === j ? (STEPS[j].color ?? "#784ba0") : "rgba(0,0,0,0.1)",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>

            {/* CTA on last step */}
            {i === STEPS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-10"
              >
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3"
                  style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", textDecoration: "none" }}
                >
                  <span
                    className="transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: 48, height: 48, borderRadius: 999,
                      background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <ArrowRight size={20} color="#fff" />
                  </span>
                  Diagnosticar mi sistema de revenue
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      ))}
    </section>
  );
}
