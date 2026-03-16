import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, Zap, Rocket } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro-3.svg";

/* ─── Track States (Imanix narrative) ─── */
type TrackStateId = "broken" | "incomplete" | "complete";

interface TrackState {
  id: TrackStateId;
  label: string;
  tagline: string;
  color: string;
  rgb: string;
  icon: typeof AlertTriangle;
  headline: string;
  insight: string;
  signals: string[];
  approach: string;
  ctaLabel: string;
}

const TRACK_STATES: TrackState[] = [
  {
    id: "broken",
    label: "Pista rota",
    tagline: "Sin sistema, sin previsibilidad",
    color: "#BE1869",
    rgb: "190,24,105",
    icon: AlertTriangle,
    headline: "Tu crecimiento depende de esfuerzos individuales, no de un sistema.",
    insight:
      "Tus equipos de venta, marketing y CS trabajan con datos distintos. Cada vendedor reinventa el proceso desde cero. El forecast es ficción.",
    signals: [
      "No puedes predecir el revenue del próximo trimestre con confianza",
      "Pierdes deals por falta de seguimiento, no por falta de demanda",
      "Escalar significa contratar más personas, no mejorar el sistema",
    ],
    approach:
      "Un diagnóstico estructurado revela las 3-5 piezas críticas que están frenando tu revenue.",
    ctaLabel: "Diagnosticar mi motor de ingresos",
  },
  {
    id: "incomplete",
    label: "Pista incompleta",
    tagline: "Base instalada, fricciones constantes",
    color: "#D4A017",
    rgb: "212,160,23",
    icon: Zap,
    headline: "Tienes herramientas y procesos, pero tu revenue sigue sin ser predecible.",
    insight:
      "Tienes CRM pero lo usan al 30%. Los handoffs entre marketing → ventas → CS generan fricción. Generas datos pero no los usas para decidir.",
    signals: [
      "Tu inversión en tecnología no se traduce en crecimiento real",
      "Los equipos culpan a otros departamentos por los resultados",
      "Tus mejores oportunidades se pierden en los gaps entre áreas",
    ],
    approach:
      "Conectar procesos, alinear equipos y automatizar los puntos de fricción que frenan tu pipeline.",
    ctaLabel: "Optimizar mi sistema comercial",
  },
  {
    id: "complete",
    label: "Pista bien armada",
    tagline: "Sistema fluido, listo para escalar",
    color: "#1CA398",
    rgb: "28,163,152",
    icon: Rocket,
    headline: "Tu sistema funciona. Ahora necesitas un equipo que lo potencie.",
    insight:
      "Tus procesos están documentados y conectados. Puedes predecir tu revenue. Cada nuevo rep es productivo rápido. El siguiente paso es escalar con operaciones dedicadas.",
    signals: [
      "Sin un equipo de operaciones dedicado, la deuda técnica se acumula",
      "Tu equipo comercial pierde tiempo en tareas operativas",
      "El crecimiento se estanca cuando no hay quién optimice continuamente",
    ],
    approach:
      "Un equipo de RevOps que opere, optimice y escale tu sistema de revenue con sprints continuos.",
    ctaLabel: "Escalar con RevOps as a Service",
  },
];

/* ─── Zone mapping for SVG highlight positions ─── */
const ZONE_HIGHLIGHT: Record<TrackStateId, { cx: string; cy: string; rx: string; ry: string }> = {
  broken:     { cx: "50%", cy: "78%", rx: "38%", ry: "18%" },
  incomplete: { cx: "50%", cy: "50%", rx: "40%", ry: "18%" },
  complete:   { cx: "50%", cy: "22%", rx: "38%", ry: "18%" },
};

/* ═══════════════════════════════════════════════════════════ */
export default function PistaDiagnostico({ section }: { section?: HomeSection }) {
  const ctaUrl = section?.cta_url ?? "#";
  const [selected, setSelected] = useState<TrackStateId | null>(null);
  const handleSelect = useCallback((id: TrackStateId) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);
  const activeState = TRACK_STATES.find((s) => s.id === selected);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        paddingTop: 120,
        paddingBottom: 120,
        background: `
          radial-gradient(circle at 20% 30%, rgba(120,80,255,0.04), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,0,120,0.03), transparent 40%),
          #F5F5F7
        `,
      }}
    >
      <div className="relative z-10 mx-auto" style={{ maxWidth: 1280, paddingLeft: 40, paddingRight: 40 }}>
        {/* ── Storytelling intro ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-20 lg:mb-28">
          {/* Left: narrative text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p
              style={{
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#86868b",
                marginBottom: 20,
              }}
            >
              La metáfora que lo explica todo
            </p>

            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 44px)",
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                margin: 0,
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

            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.6 }}
                style={{ fontSize: 17, lineHeight: 1.7, color: "#4b5563", margin: 0 }}
              >
                La pelotita, el revenue, solo fluye si cada pieza encaja perfectamente:
                marketing, ventas, CRM, automatizaciones y procesos.
                <br />
                <strong style={{ color: "#1d1d1f" }}>Si una pieza falla, se cae.</strong> Aunque la pelotita sea buena.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.6 }}
                style={{ fontSize: 17, lineHeight: 1.7, color: "#4b5563", margin: 0 }}
              >
                Eso es lo que les pasa a muchas empresas en crecimiento:
                <strong style={{ color: "#1d1d1f" }}> no les falta talento, les falta un sistema bien diseñado.</strong>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{
                  marginTop: 8,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "rgba(120,80,255,0.04)",
                  borderLeft: "3px solid rgba(120,80,255,0.3)",
                }}
              >
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontWeight: 500 }}>
                  RevOps LATAM no optimiza una pieza aislada.
                  <span style={{ color: "#6e6e73", fontWeight: 400 }}>
                    {" "}Ordena y conecta todo el sistema para que el revenue fluya sin fricción: predecible, escalable y sin depender de héroes individuales.
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: track image as hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <img
              src={pistaImg}
              alt="Pista modular Imánix — metáfora del sistema de revenue"
              className="w-full h-auto select-none"
              style={{ maxWidth: 420, opacity: 0.75 }}
              loading="lazy"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── Gradient divider ── */}
        <div className="flex justify-center mb-16">
          <div style={{ width: 80, height: 3, borderRadius: 2, background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)", opacity: 0.4 }} />
        </div>

        {/* ── Two columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ══════ LEFT COLUMN ══════ */}
          <div className="flex flex-col order-1">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: "clamp(22px, 2.5vw, 34px)",
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                maxWidth: 500,
                margin: 0,
              }}
            >
              ¿Cómo está tu pista hoy?
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "#6e6e73",
                maxWidth: 480,
                marginTop: 12,
              }}
            >
              Selecciona el estado que mejor describe tu sistema comercial y descubre qué necesitas.
            </motion.p>

            {/* Diagnostic label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#86868b",
                marginTop: 36,
                marginBottom: 14,
              }}
            >
              ¿En qué estado está tu pista?
            </motion.p>

            {/* ── Cards ── */}
            <div className="flex flex-col" style={{ gap: 14 }}>
              {TRACK_STATES.map((state, i) => {
                const isActive = selected === state.id;
                const Icon = state.icon;

                return (
                  <motion.button
                    key={state.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.2 + i * 0.08,
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => handleSelect(state.id)}
                    className="text-left w-full outline-none cursor-pointer"
                    style={{
                      background: isActive
                        ? `rgba(${state.rgb}, 0.08)`
                        : "rgba(0,0,0,0.02)",
                      border: isActive
                        ? `1px solid rgba(${state.rgb}, 0.35)`
                        : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 14,
                      padding: "16px 18px",
                      transition: "all 0.25s ease",
                      boxShadow: isActive
                        ? `0 0 24px rgba(${state.rgb}, 0.12)`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{ background: `rgba(${state.rgb}, 0.1)` }}
                      >
                        <Icon size={16} style={{ color: state.color }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>
                            {state.label}
                          </span>
                          <span style={{ fontSize: 12, color: "#86868b" }}>
                            {state.tagline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="insight"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.5, margin: 0, paddingTop: 10 }}>
                            {state.insight}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Track — mobile only */}
            <div className="block lg:hidden" style={{ marginTop: 40 }}>
              <TrackVisual activeState={activeState} selected={selected} mobile />
            </div>

            {/* ── Expanded detail panel ── */}
            <AnimatePresence mode="wait">
              {activeState && (
                <motion.div
                  key={activeState.id}
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                  style={{ marginTop: 20 }}
                >
                  <div
                    style={{
                      background: "white",
                      border: `1px solid rgba(${activeState.rgb}, 0.15)`,
                      borderRadius: 16,
                      padding: "20px 22px",
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      style={{
                        width: 40,
                        height: 3,
                        borderRadius: 2,
                        background: activeState.color,
                        marginBottom: 14,
                      }}
                    />

                    <h4 style={{ fontSize: 18, fontWeight: 600, color: "#1d1d1f", lineHeight: 1.3, marginBottom: 12 }}>
                      {activeState.headline}
                    </h4>

                    {/* Signals */}
                    <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", marginBottom: 8 }}>
                      Señales
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {activeState.signals.map((sig, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          className="flex items-start gap-2.5"
                          style={{ marginBottom: 6 }}
                        >
                          <span
                            className="mt-1.5 shrink-0"
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 999,
                              background: activeState.color,
                            }}
                          />
                          <span style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                            {sig}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Approach */}
                    <p style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.6, marginTop: 14 }}>
                      <strong style={{ color: "#1d1d1f" }}>El enfoque:</strong> {activeState.approach}
                    </p>

                    {/* CTA */}
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
                        fontWeight: 600,
                        color: activeState.color,
                        textDecoration: "none",
                        marginTop: 16,
                      }}
                    >
                      {activeState.ctaLabel}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══════ RIGHT COLUMN — Desktop sticky track ══════ */}
          <div className="hidden lg:flex order-2 lg:sticky lg:top-32 items-center justify-end">
            <TrackVisual activeState={activeState} selected={selected} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRACK VISUAL
   ═══════════════════════════════════════════════════════════ */
function TrackVisual({
  activeState,
  selected,
  mobile = false,
}: {
  activeState?: TrackState;
  selected: string | null;
  mobile?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative"
      style={{
        width: "100%",
        maxWidth: mobile ? 360 : 520,
        marginLeft: mobile ? "auto" : "auto",
        marginRight: mobile ? "auto" : 0,
      }}
    >
      {/* Track image */}
      <img
        src={pistaImg}
        alt="Sistema de revenue — pista modular Imanix"
        className="w-full h-auto select-none"
        style={{
          opacity: selected ? 0.35 : 0.7,
          transition: "opacity 0.35s ease",
          filter: "none",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* SVG zone highlight ellipses */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {TRACK_STATES.map((state) => {
          const isActive = activeState?.id === state.id;
          const zone = ZONE_HIGHLIGHT[state.id];

          return (
            <ellipse
              key={state.id}
              cx={zone.cx}
              cy={zone.cy}
              rx={zone.rx}
              ry={zone.ry}
              fill={`rgba(${state.rgb}, ${isActive ? 0.12 : 0})`}
              stroke={`rgba(${state.rgb}, ${isActive ? 0.18 : 0})`}
              strokeWidth="0.3"
              style={{
                transition: "all 0.35s ease",
                filter: isActive
                  ? `drop-shadow(0 0 18px rgba(${state.rgb}, 0.4))`
                  : "none",
                opacity: isActive ? 1 : 0,
              }}
            />
          );
        })}
      </svg>

      {/* Bright track overlay for active zone */}
      {activeState && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: `radial-gradient(ellipse ${ZONE_HIGHLIGHT[activeState.id].rx} ${ZONE_HIGHLIGHT[activeState.id].ry} at ${ZONE_HIGHLIGHT[activeState.id].cx} ${ZONE_HIGHLIGHT[activeState.id].cy}, black 40%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse ${ZONE_HIGHLIGHT[activeState.id].rx} ${ZONE_HIGHLIGHT[activeState.id].ry} at ${ZONE_HIGHLIGHT[activeState.id].cx} ${ZONE_HIGHLIGHT[activeState.id].cy}, black 40%, transparent 100%)`,
            transition: "opacity 0.35s ease",
          }}
        >
          <img
            src={pistaImg}
            alt=""
            className="w-full h-auto"
            style={{
              opacity: 1,
              filter: `drop-shadow(0 0 14px rgba(${activeState.rgb}, 0.35))`,
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Zone labels */}
      {TRACK_STATES.map((state) => {
        const isActive = activeState?.id === state.id;
        const zone = ZONE_HIGHLIGHT[state.id];

        return (
          <div
            key={state.id}
            className="absolute pointer-events-none"
            style={{
              top: zone.cy,
              left: zone.cx,
              transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0.85})`,
              opacity: isActive ? 1 : 0,
              transition: "all 0.35s ease",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: state.color,
                background: `rgba(${state.rgb}, 0.1)`,
                border: `1px solid rgba(${state.rgb}, 0.2)`,
                backdropFilter: "blur(6px)",
              }}
            >
              {state.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}
