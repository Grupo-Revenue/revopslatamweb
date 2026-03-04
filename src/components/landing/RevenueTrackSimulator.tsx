import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ─── Pain options ─── */
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

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
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
      {/* Subtle ambient light */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800,
          height: 800,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, hsl(var(--pink) / 0.03) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ─── Header — centered, Apple-style ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-primary-foreground">
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
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Muchas empresas intentan resolver fricciones cambiando personas,
            pero el problema casi siempre está en cómo interactúan los procesos,
            las herramientas y los datos.
          </p>
        </motion.div>

        {/* ─── Two columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT: Pain options */}
          <div className="flex flex-col gap-4 order-2 lg:order-1">
            {PAIN_OPTIONS.map((pain, i) => {
              const isActive = selected === pain.id;
              const color = ZONE_COLORS[pain.zone];

              return (
                <motion.button
                  key={pain.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onClick={() => handleSelect(pain.id)}
                  className="group text-left w-full rounded-2xl px-6 py-5 sm:px-7 sm:py-6 transition-all duration-500 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  style={{
                    background: isActive
                      ? `hsl(${color} / 0.05)`
                      : "transparent",
                    border: `1px solid ${
                      isActive
                        ? `hsl(${color} / 0.15)`
                        : "hsl(var(--muted-foreground) / 0.06)"
                    }`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Accent line */}
                    <div
                      className="mt-2 w-[3px] h-5 rounded-full shrink-0 transition-all duration-500"
                      style={{
                        background: isActive
                          ? `hsl(${color})`
                          : "hsl(var(--muted-foreground) / 0.12)",
                        boxShadow: isActive
                          ? `0 0 16px hsl(${color} / 0.4)`
                          : "none",
                        height: isActive ? 20 : 16,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[15px] sm:text-[17px] font-semibold leading-snug transition-colors duration-500"
                        style={{
                          color: isActive
                            ? "hsl(var(--primary-foreground))"
                            : "hsl(var(--muted-foreground) / 0.7)",
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
                            transition={{
                              duration: 0.4,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p
                              className="text-sm leading-relaxed mt-3 pr-4"
                              style={{
                                color: "hsl(var(--muted-foreground) / 0.65)",
                              }}
                            >
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

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 pl-1"
            >
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm sm:text-base font-semibold transition-all duration-300"
                style={{ color: "hsl(var(--primary-foreground))" }}
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--pink)), hsl(var(--purple)))",
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

          {/* RIGHT: Track SVG — clean, no white bg box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-1 lg:order-2 flex items-center justify-center"
          >
            {/* Glow behind the track */}
            <AnimatePresence>
              {activeOption && (
                <motion.div
                  key={`glow-${activeOption.zone}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at ${
                      activeOption.zone === "marketing"
                        ? "35% 70%"
                        : activeOption.zone === "ventas"
                        ? "50% 45%"
                        : "65% 20%"
                    }, hsl(${ZONE_COLORS[activeOption.zone]} / 0.08) 0%, transparent 60%)`,
                    filter: "blur(40px)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Track image — no container box, blends into dark bg */}
            <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
              <img
                src={pistaImg}
                alt="Sistema de revenue — pista comercial"
                className="w-full h-auto select-none transition-all duration-700"
                style={{
                  opacity: selected ? 0.9 : 0.5,
                  filter: selected
                    ? "brightness(1.1) drop-shadow(0 0 30px hsl(var(--muted-foreground) / 0.05))"
                    : "brightness(0.8)",
                }}
                loading="lazy"
                draggable={false}
              />

              {/* Zone label overlays */}
              {(["marketing", "ventas", "servicio"] as const).map((zone) => {
                const isActive = activeOption?.zone === zone;
                const color = ZONE_COLORS[zone];
                const positions: Record<string, { top: string; left: string }> = {
                  marketing: { top: "72%", left: "25%" },
                  ventas: { top: "42%", left: "50%" },
                  servicio: { top: "12%", left: "70%" },
                };
                const pos = positions[zone];
                const label = zone.charAt(0).toUpperCase() + zone.slice(1);

                return (
                  <motion.div
                    key={zone}
                    className="absolute pointer-events-none"
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm"
                      style={{
                        color: `hsl(${color})`,
                        background: `hsl(${color} / 0.08)`,
                        border: `1px solid hsl(${color} / 0.15)`,
                        textShadow: `0 0 20px hsl(${color} / 0.3)`,
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
