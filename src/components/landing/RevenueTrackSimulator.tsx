import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ─── Data ─── */
type PainOption = {
  id: string;
  label: string;
  insight: string;
  zone: "marketing" | "ventas" | "servicio";
};

const PAIN_OPTIONS: PainOption[] = [
  {
    id: "marketing",
    label: "Generamos leads, pero ventas dice que son malos.",
    insight:
      "Marketing y Ventas no comparten definición de MQL/SQL. Sin un SLA claro, el esfuerzo se diluye antes de llegar al pipeline.",
    zone: "marketing",
  },
  {
    id: "ventas",
    label: "Tenemos pipeline, pero el cierre es impredecible.",
    insight:
      "Sin etapas estandarizadas ni un CRM configurado por proceso, cada vendedor opera distinto. El forecast se vuelve ficción.",
    zone: "ventas",
  },
  {
    id: "servicio",
    label: "Vendemos, pero el crecimiento se estanca.",
    insight:
      "Sin automatización post-venta y métricas de retención, el revenue depende siempre de nuevos clientes. El sistema no escala.",
    zone: "servicio",
  },
];

const ZONE_COLORS: Record<string, { h: string; rgb: string }> = {
  marketing: { h: "var(--pink)", rgb: "255,60,172" },
  ventas: { h: "var(--purple)", rgb: "120,75,160" },
  servicio: { h: "var(--teal)", rgb: "43,134,197" },
};

const ZONE_HIGHLIGHTS: Record<string, { cx: string; cy: string; rx: string; ry: string }> = {
  marketing: { cx: "28%", cy: "72%", rx: "22%", ry: "18%" },
  ventas: { cx: "50%", cy: "48%", rx: "24%", ry: "18%" },
  servicio: { cx: "72%", cy: "22%", rx: "22%", ry: "18%" },
};

const ZONE_LABEL_POS: Record<string, { top: string; left: string }> = {
  marketing: { top: "72%", left: "28%" },
  ventas: { top: "48%", left: "50%" },
  servicio: { top: "22%", left: "72%" },
};

/* ═══════════════════════════════════════════════════════════ */
export default function RevenueTrackSimulator({ section }: { section?: HomeSection }) {
  const ctaText = section?.cta_text ?? "Diagnosticar mi sistema de revenue";
  const ctaUrl = section?.cta_url ?? "#";

  const [selected, setSelected] = useState<string | null>(null);
  const handleSelect = useCallback((id: string) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);
  const activeOption = PAIN_OPTIONS.find((p) => p.id === selected);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        paddingTop: 120,
        paddingBottom: 120,
        background: `
          radial-gradient(circle at 20% 30%, rgba(120,80,255,0.15), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,0,120,0.12), transparent 40%),
          #0b0b0f
        `,
      }}
    >
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 1280, paddingLeft: 40, paddingRight: 40 }}
      >
        {/* ─── 50 / 50 Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ══════ LEFT ══════ */}
          <div className="flex flex-col order-2 lg:order-1">
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                maxWidth: 700,
                color: "#ffffff",
              }}
            >
              El problema no es tu equipo.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#ff3cac,#784ba0,#2b86c5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Es el sistema donde operan.
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "#9ca3af",
                maxWidth: 560,
                marginTop: 20,
              }}
            >
              Muchas empresas intentan resolver fricciones cambiando personas,
              pero el problema casi siempre está en cómo interactúan procesos,
              herramientas y datos.
            </motion.p>

            {/* Diagnosis label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: 14,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#6b7280",
                marginTop: 40,
                marginBottom: 16,
              }}
            >
              Diagnóstico rápido
            </motion.p>

            {/* ─── Cards ─── */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              {PAIN_OPTIONS.map((pain, i) => {
                const isActive = selected === pain.id;
                const zc = ZONE_COLORS[pain.zone];

                return (
                  <motion.button
                    key={pain.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.15 + i * 0.07,
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => handleSelect(pain.id)}
                    className="text-left w-full outline-none cursor-pointer"
                    style={{
                      background: isActive
                        ? `rgba(${zc.rgb}, 0.15)`
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? `1px solid rgba(${zc.rgb}, 0.6)`
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "18px 20px",
                      transition: "all 0.25s ease",
                      boxShadow: isActive
                        ? `0 0 30px rgba(${zc.rgb}, 0.25)`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#ffffff",
                        margin: 0,
                      }}
                    >
                      {pain.label}
                    </p>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="insight"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            style={{
                              fontSize: 14,
                              color: "#9ca3af",
                              marginTop: 6,
                              lineHeight: 1.5,
                              margin: 0,
                              paddingTop: 6,
                            }}
                          >
                            {pain.insight}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ marginTop: 28 }}
            >
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <span
                  className="transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: "linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ArrowRight size={18} color="#fff" />
                </span>
                <span className="border-b border-transparent group-hover:border-white/30 transition-colors duration-300 pb-0.5">
                  {ctaText}
                </span>
              </a>
            </motion.div>
          </div>

          {/* ══════ RIGHT — Sticky Track ══════ */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-32 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-[520px] mx-auto"
            >
              {/* Track image */}
              <img
                src={pistaImg}
                alt="Sistema de revenue — pista comercial"
                className="w-full h-auto select-none"
                style={{
                  opacity: selected ? 0.9 : 0.5,
                  filter: selected ? "brightness(1.2)" : "brightness(0.7)",
                  transition: "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
                loading="lazy"
                draggable={false}
              />

              {/* SVG zone highlights */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {(["marketing", "ventas", "servicio"] as const).map((zone) => {
                  const isActive = activeOption?.zone === zone;
                  const zc = ZONE_COLORS[zone];
                  const h = ZONE_HIGHLIGHTS[zone];

                  return (
                    <ellipse
                      key={zone}
                      cx={h.cx}
                      cy={h.cy}
                      rx={h.rx}
                      ry={h.ry}
                      fill={`rgba(${zc.rgb}, ${isActive ? 0.18 : 0})`}
                      stroke={`rgba(${zc.rgb}, ${isActive ? 0.3 : 0})`}
                      strokeWidth="0.4"
                      style={{
                        transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
                        filter: isActive
                          ? `drop-shadow(0 0 12px rgba(${zc.rgb}, 0.4))`
                          : "none",
                      }}
                    />
                  );
                })}
              </svg>

              {/* Zone labels */}
              {(["marketing", "ventas", "servicio"] as const).map((zone) => {
                const isActive = activeOption?.zone === zone;
                const zc = ZONE_COLORS[zone];
                const pos = ZONE_LABEL_POS[zone];
                const label = zone.charAt(0).toUpperCase() + zone.slice(1);

                return (
                  <motion.div
                    key={zone}
                    className="absolute pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.85 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.15em",
                        color: `rgba(${zc.rgb}, 1)`,
                        background: `rgba(${zc.rgb}, 0.12)`,
                        border: `1px solid rgba(${zc.rgb}, 0.25)`,
                        backdropFilter: "blur(8px)",
                        textShadow: `0 0 16px rgba(${zc.rgb}, 0.5)`,
                      }}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
