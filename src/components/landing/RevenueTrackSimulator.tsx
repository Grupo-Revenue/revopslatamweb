import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Settings } from "lucide-react";
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

const ZONE_META: Record<string, { rgb: string; cx: string; cy: string; rx: string; ry: string; labelTop: string; labelLeft: string }> = {
  marketing: { rgb: "255,80,200", cx: "28%", cy: "72%", rx: "22%", ry: "18%", labelTop: "72%", labelLeft: "28%" },
  ventas:    { rgb: "140,100,255", cx: "50%", cy: "48%", rx: "24%", ry: "18%", labelTop: "48%", labelLeft: "50%" },
  servicio:  { rgb: "60,180,220", cx: "72%", cy: "22%", rx: "22%", ry: "18%", labelTop: "22%", labelLeft: "72%" },
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
          radial-gradient(circle at 20% 30%, rgba(120,80,255,0.04), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255,0,120,0.03), transparent 40%),
          #F5F5F7
        `,
      }}
    >
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 1280, paddingLeft: 40, paddingRight: 40 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ══════ LEFT COLUMN ══════ */}
          <div className="flex flex-col order-1 lg:order-1">

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: "clamp(32px, 4.5vw, 64px)",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                maxWidth: 700,
                color: "#1d1d1f",
                margin: 0,
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "#6e6e73",
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
                textTransform: "uppercase",
                color: "#86868b",
                marginTop: 40,
                marginBottom: 16,
              }}
            >
              Diagnóstico rápido
            </motion.p>

            {/* Cards */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              {PAIN_OPTIONS.map((pain, i) => {
                const isActive = selected === pain.id;
                const meta = ZONE_META[pain.zone];

                return (
                  <motion.button
                    key={pain.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.2 + i * 0.08,
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => handleSelect(pain.id)}
                    className="text-left w-full outline-none cursor-pointer"
                    style={{
                      background: isActive
                        ? `rgba(${meta.rgb}, 0.08)`
                        : "rgba(0,0,0,0.02)",
                      border: isActive
                        ? `1px solid rgba(${meta.rgb}, 0.35)`
                        : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: 14,
                      padding: "18px 20px",
                      transition: "all 0.25s ease",
                      boxShadow: isActive
                        ? `0 0 24px rgba(${meta.rgb}, 0.15)`
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
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#1d1d1f", margin: 0 }}>
                      {pain.label}
                    </p>
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
                          <p style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.5, margin: 0, paddingTop: 8 }}>
                            {pain.insight}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Track — mobile only (order 4, after cards) */}
            <div className="block lg:hidden" style={{ marginTop: 40 }}>
              <TrackVisual activeOption={activeOption} selected={selected} mobile />
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.5 }}
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
                  color: "#1d1d1f",
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
                <span className="border-b border-transparent group-hover:border-black/20 transition-colors duration-300 pb-0.5">
                  {ctaText}
                </span>
              </a>
            </motion.div>
          </div>

          {/* ══════ RIGHT COLUMN — Desktop sticky track ══════ */}
          <div className="hidden lg:flex order-2 lg:sticky lg:top-32 items-center justify-end">
            <TrackVisual activeOption={activeOption} selected={selected} />
          </div>
        </div>
      </div>

      {/* Gear rotation keyframe */}
      <style>{`
        @keyframes gear-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRACK VISUAL — extracted sub-component
   ═══════════════════════════════════════════════════════════ */
function TrackVisual({
  activeOption,
  selected,
  mobile = false,
}: {
  activeOption?: (typeof PAIN_OPTIONS)[number];
  selected: string | null;
  mobile?: boolean;
}) {
  const isVentasActive = activeOption?.zone === "ventas";

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
        alt="Sistema de revenue — pista comercial"
        className="w-full h-auto select-none"
        style={{
          opacity: selected ? 0.4 : 0.7,
          transition: "opacity 0.35s ease, filter 0.35s ease",
          filter: "none",
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
          const meta = ZONE_META[zone];

          return (
            <ellipse
              key={zone}
              cx={meta.cx}
              cy={meta.cy}
              rx={meta.rx}
              ry={meta.ry}
              fill={`rgba(${meta.rgb}, ${isActive ? 0.15 : 0})`}
              stroke={`rgba(${meta.rgb}, ${isActive ? 0.2 : 0})`}
              strokeWidth="0.3"
              style={{
                transition: "all 0.35s ease",
                filter: isActive
                  ? `drop-shadow(0 0 18px rgba(${meta.rgb}, 0.5))`
                  : "none",
                opacity: isActive ? 1 : 0,
              }}
            />
          );
        })}
      </svg>

      {/* Bright track overlay per zone — shows the track at full brightness in the active area */}
      {activeOption && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: `radial-gradient(ellipse ${ZONE_META[activeOption.zone].rx} ${ZONE_META[activeOption.zone].ry} at ${ZONE_META[activeOption.zone].cx} ${ZONE_META[activeOption.zone].cy}, black 40%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse ${ZONE_META[activeOption.zone].rx} ${ZONE_META[activeOption.zone].ry} at ${ZONE_META[activeOption.zone].cx} ${ZONE_META[activeOption.zone].cy}, black 40%, transparent 100%)`,
            transition: "opacity 0.35s ease",
          }}
        >
          <img
            src={pistaImg}
            alt=""
            className="w-full h-auto"
            style={{
              opacity: 1,
              filter: `drop-shadow(0 0 14px rgba(${ZONE_META[activeOption.zone].rgb}, 0.4))`,
            }}
            draggable={false}
          />
        </div>
      )}

      {/* Gear icon — rotates when ventas is active */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "48%",
          left: "50%",
          width: 28,
          height: 28,
          opacity: isVentasActive ? 0.6 : 0,
          transition: "opacity 0.35s ease",
          animation: isVentasActive ? "gear-rotate 6s linear infinite" : "none",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Settings size={28} color={`rgba(${ZONE_META.ventas.rgb}, 0.8)`} />
      </div>

      {/* Zone labels */}
      {(["marketing", "ventas", "servicio"] as const).map((zone) => {
        const isActive = activeOption?.zone === zone;
        const meta = ZONE_META[zone];
        const label = zone.charAt(0).toUpperCase() + zone.slice(1);

        return (
          <div
            key={zone}
            className="absolute pointer-events-none"
            style={{
              top: meta.labelTop,
              left: meta.labelLeft,
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
                color: `rgba(${meta.rgb}, 1)`,
                background: `rgba(${meta.rgb}, 0.1)`,
                border: `1px solid rgba(${meta.rgb}, 0.2)`,
                backdropFilter: "blur(6px)",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}
