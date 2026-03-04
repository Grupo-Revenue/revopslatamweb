import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Zap, Rocket } from "lucide-react";
import pistaImg from "@/assets/pista-negro-3.svg";
import type { HomeSection } from "@/hooks/useHomeSections";

const STEPS = [
  {
    id: "broken",
    icon: AlertTriangle,
    label: "Pista rota",
    tagline: "Sin sistema, sin previsibilidad",
    color: "#BE1869",
    rgb: "190,24,105",
    body: "Tus equipos de venta, marketing y CS trabajan con datos distintos. Cada vendedor reinventa el proceso desde cero. El forecast es ficción.",
    stat: "70%",
    statLabel: "de empresas B2B en LATAM operan así",
  },
  {
    id: "incomplete",
    icon: Zap,
    label: "Pista incompleta",
    tagline: "Base instalada, fricciones constantes",
    color: "#D4A017",
    rgb: "212,160,23",
    body: "Tienes HubSpot u otro CRM pero lo usan al 30%. Los handoffs entre marketing → ventas → CS generan fricción. La inversión en tecnología no se traduce en crecimiento.",
    stat: "30%",
    statLabel: "de uso real del CRM promedio",
  },
  {
    id: "complete",
    icon: Rocket,
    label: "Pista bien armada",
    tagline: "Sistema fluido, listo para escalar",
    color: "#1CA398",
    rgb: "28,163,152",
    body: "Procesos conectados, revenue predecible. Cada nuevo rep es productivo en menos de 30 días. El sistema escala sin depender de héroes individuales.",
    stat: "±15%",
    statLabel: "de precisión en forecast trimestral",
  },
];

export default function PistaStoryTimeline({ section }: { section?: HomeSection }) {
  const ctaUrl = section?.cta_url ?? "#";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: 100,
        paddingBottom: 120,
        background: "#F5F5F7",
      }}
    >
      {/* Parallax track background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          backgroundImage: `url(${pistaImg})`,
          backgroundSize: "360px auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          opacity: 0.06,
        }}
      />

      <div className="relative z-10 mx-auto" style={{ maxWidth: 800, paddingLeft: 24, paddingRight: 24 }}>
        {/* Label */}
        <div className="text-center mb-8">
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#86868b", background: "rgba(0,0,0,0.04)", padding: "6px 16px", borderRadius: 999 }}>
            Variante C — Timeline vertical
          </span>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              marginBottom: 20,
            }}
          >
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
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#4b5563", maxWidth: 560, margin: "0 auto" }}>
            La pelotita —el revenue— solo fluye si cada pieza encaja. Si una falla, se cae. No les falta talento, les falta un sistema bien diseñado.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.08) 90%, transparent)",
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-start gap-6 mb-20 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ paddingLeft: 56 }}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: step.color,
                    border: "3px solid #F5F5F7",
                    boxShadow: `0 0 12px rgba(${step.rgb}, 0.3)`,
                    top: 4,
                  }}
                />

                {/* Card */}
                <div
                  className="flex-1 md:w-[calc(50%-40px)]"
                  style={{
                    background: "white",
                    borderRadius: 16,
                    padding: "24px 28px",
                    border: `1px solid rgba(${step.rgb}, 0.12)`,
                    boxShadow: `0 4px 24px rgba(${step.rgb}, 0.06)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-xl"
                      style={{ background: `rgba(${step.rgb}, 0.1)` }}
                    >
                      <Icon size={18} style={{ color: step.color }} />
                    </span>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: step.color }}>{step.label}</span>
                      <span style={{ fontSize: 12, color: "#86868b", display: "block" }}>{step.tagline}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4b5563", marginBottom: 16 }}>
                    {step.body}
                  </p>

                  {/* Stat */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: `rgba(${step.rgb}, 0.04)`,
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: 800, color: step.color, lineHeight: 1 }}>
                      {step.stat}
                    </span>
                    <span style={{ fontSize: 13, color: "#6e6e73" }}>
                      {step.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Closing + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8"
        >
          <div
            style={{
              padding: "20px 28px",
              borderRadius: 14,
              background: "rgba(120,80,255,0.04)",
              borderLeft: "3px solid rgba(120,80,255,0.3)",
              display: "inline-block",
              textAlign: "left",
              marginBottom: 28,
            }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontWeight: 500 }}>
              RevOps LATAM no optimiza una pieza aislada.
              <span style={{ color: "#6e6e73", fontWeight: 400 }}>
                {" "}Ordena y conecta todo el sistema para que el revenue fluya sin fricción.
              </span>
            </p>
          </div>

          <div>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
