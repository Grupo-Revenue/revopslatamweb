import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ─── Types & Data ─── */
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

const ZONE_COLORS: Record<string, string> = {
  marketing: "var(--pink)",
  ventas: "var(--purple)",
  servicio: "var(--teal)",
};

/* Zone highlight areas on the track (%, relative to image) */
const ZONE_HIGHLIGHTS: Record<string, { cx: string; cy: string; rx: string; ry: string }> = {
  marketing: { cx: "28%", cy: "72%", rx: "22%", ry: "18%" },
  ventas: { cx: "50%", cy: "48%", rx: "24%", ry: "18%" },
  servicio: { cx: "72%", cy: "22%", rx: "22%", ry: "18%" },
};

const ease = [0.25, 0.1, 0.25, 1] as const;

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
      className="relative py-24 sm:py-32 lg:py-40 px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))" }}
    >
      {/* Ambient */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800, height: 800,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, hsl(var(--pink) / 0.03) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ─── 50/50 Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ══ LEFT COLUMN — grouped content ══ */}
          <div className="flex flex-col order-2 lg:order-1">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
            >
              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.03em] text-primary-foreground">
                El problema no es tu equipo.
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(var(--pink)), hsl(var(--purple)), hsl(var(--teal)))",
                  }}
                >
                  Es el sistema donde operan.
                </span>
              </h2>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-muted-foreground max-w-lg">
                Muchas empresas intentan resolver fricciones cambiando personas,
                pero el problema casi siempre está en cómo interactúan los procesos,
                las herramientas y los datos.
              </p>
            </motion.div>

            {/* Section label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50"
            >
              Diagnóstico rápido
            </motion.p>

            {/* ─── Cards ─── */}
            <div className="flex flex-col gap-3">
              {PAIN_OPTIONS.map((pain, i) => {
                const isActive = selected === pain.id;
                const color = ZONE_COLORS[pain.zone];

                return (
                  <motion.button
                    key={pain.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease }}
                    onClick={() => handleSelect(pain.id)}
                    className="group text-left w-full rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition-all duration-500 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer relative overflow-hidden"
                    style={{
                      background: isActive
                        ? `hsl(${color} / 0.08)`
                        : "hsl(var(--muted-foreground) / 0.03)",
                      border: "1px solid transparent",
                      borderImage: isActive
                        ? `linear-gradient(135deg, hsl(${color} / 0.4), hsl(${color} / 0.1)) 1`
                        : undefined,
                      borderColor: isActive ? undefined : "hsl(var(--muted-foreground) / 0.06)",
                      boxShadow: isActive
                        ? `0 0 24px hsl(${color} / 0.12), 0 0 60px hsl(${color} / 0.06)`
                        : "none",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Accent bar */}
                      <div
                        className="mt-1 w-[3px] rounded-full shrink-0 transition-all duration-500"
                        style={{
                          height: isActive ? 22 : 16,
                          background: isActive
                            ? `hsl(${color})`
                            : "hsl(var(--muted-foreground) / 0.12)",
                          boxShadow: isActive
                            ? `0 0 12px hsl(${color} / 0.5)`
                            : "none",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[14px] sm:text-[16px] font-semibold leading-snug transition-colors duration-500"
                          style={{
                            color: isActive
                              ? "hsl(var(--primary-foreground))"
                              : "hsl(var(--muted-foreground) / 0.6)",
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
                              transition={{ duration: 0.4, ease }}
                              className="overflow-hidden"
                            >
                              <p className="text-[13px] leading-relaxed mt-2.5 pr-2 text-muted-foreground/60">
                                {pain.insight}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
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
              className="mt-8"
            >
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm sm:text-base font-semibold text-primary-foreground transition-all duration-300"
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--pink)), hsl(var(--purple)))",
                    boxShadow: "0 4px 20px hsl(var(--pink) / 0.3)",
                  }}
                >
                  <ArrowRight size={16} className="text-primary-foreground" />
                </span>
                <span className="border-b border-transparent group-hover:border-primary-foreground/30 transition-colors duration-300 pb-0.5">
                  {ctaText}
                </span>
              </a>
            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN — Track ══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="relative order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px] mx-auto">
              {/* Base track */}
              <img
                src={pistaImg}
                alt="Sistema de revenue — pista comercial"
                className="w-full h-auto select-none transition-all duration-700"
                style={{
                  opacity: selected ? 0.85 : 0.5,
                  filter: selected
                    ? "brightness(1.15)"
                    : "brightness(0.75)",
                }}
                loading="lazy"
                draggable={false}
              />

              {/* Zone highlight overlays */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {(["marketing", "ventas", "servicio"] as const).map((zone) => {
                  const isActive = activeOption?.zone === zone;
                  const color = ZONE_COLORS[zone];
                  const h = ZONE_HIGHLIGHTS[zone];

                  return (
                    <ellipse
                      key={zone}
                      cx={h.cx}
                      cy={h.cy}
                      rx={h.rx}
                      ry={h.ry}
                      fill={`hsl(${color} / ${isActive ? 0.15 : 0})`}
                      stroke={`hsl(${color} / ${isActive ? 0.25 : 0})`}
                      strokeWidth="0.3"
                      style={{
                        transition: "all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
                        filter: isActive ? `drop-shadow(0 0 8px hsl(${color} / 0.3))` : "none",
                      }}
                    />
                  );
                })}
              </svg>

              {/* Zone labels */}
              {(["marketing", "ventas", "servicio"] as const).map((zone) => {
                const isActive = activeOption?.zone === zone;
                const color = ZONE_COLORS[zone];
                const positions: Record<string, { top: string; left: string }> = {
                  marketing: { top: "72%", left: "28%" },
                  ventas: { top: "48%", left: "50%" },
                  servicio: { top: "22%", left: "72%" },
                };
                const pos = positions[zone];
                const label = zone.charAt(0).toUpperCase() + zone.slice(1);

                return (
                  <motion.div
                    key={zone}
                    className="absolute pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.85 }}
                    transition={{ duration: 0.45, ease }}
                    style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm"
                      style={{
                        color: `hsl(${color})`,
                        background: `hsl(${color} / 0.1)`,
                        border: `1px solid hsl(${color} / 0.2)`,
                        textShadow: `0 0 16px hsl(${color} / 0.4)`,
                      }}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
