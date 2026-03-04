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

/* ─── Zone highlight positions (% on the SVG image) ─── */
const ZONE_HIGHLIGHTS: Record<string, { x: number; y: number; w: number; h: number; color: string }> = {
  marketing: { x: 15, y: 55, w: 35, h: 30, color: "var(--pink)" },
  ventas:    { x: 30, y: 25, w: 40, h: 30, color: "var(--purple)" },
  servicio:  { x: 50, y: 2,  w: 40, h: 25, color: "var(--teal)" },
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
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))" }}
    >
      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14 sm:mb-20"
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold leading-[1.1] tracking-tight text-primary-foreground">
            El problema no es tu equipo.{" "}
            <br className="hidden sm:block" />
            <span style={{ color: "hsl(var(--pink))" }}>Es el sistema donde operan.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
            Muchas empresas intentan resolver fricciones cambiando personas, pero el problema casi siempre está en cómo interactúan los procesos, las herramientas y los datos.
          </p>
        </motion.div>

        {/* ─── Two columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT: Pain options */}
          <div className="flex flex-col gap-3">
            {PAIN_OPTIONS.map((pain, i) => {
              const isActive = selected === pain.id;
              const zoneColor = ZONE_HIGHLIGHTS[pain.zone].color;

              return (
                <motion.button
                  key={pain.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => handleSelect(pain.id)}
                  className="group text-left w-full rounded-2xl px-6 py-5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  style={{
                    background: isActive
                      ? `hsl(${zoneColor} / 0.06)`
                      : "hsl(var(--dark-card))",
                    border: `1px solid ${
                      isActive
                        ? `hsl(${zoneColor} / 0.2)`
                        : "hsl(var(--muted-foreground) / 0.06)"
                    }`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Indicator dot */}
                    <div
                      className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300"
                      style={{
                        background: isActive ? `hsl(${zoneColor})` : "hsl(var(--muted-foreground) / 0.2)",
                        boxShadow: isActive ? `0 0 12px hsl(${zoneColor} / 0.5)` : "none",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[15px] sm:text-base font-medium leading-snug transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "hsl(var(--primary-foreground))"
                            : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {pain.label}
                      </p>

                      {/* Insight — collapses open/closed */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            key="insight"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden text-[13px] sm:text-sm leading-relaxed mt-3"
                            style={{ color: "hsl(var(--muted-foreground) / 0.8)" }}
                          >
                            {pain.insight}
                          </motion.p>
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
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-6"
            >
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background: "hsl(var(--pink))",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 4px 24px hsl(var(--pink) / 0.25)",
                }}
              >
                {ctaText}
                <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Track SVG with highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:sticky lg:top-24"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "#F5F5F8",
                border: "1px solid hsl(var(--muted-foreground) / 0.08)",
              }}
            >
              <div className="relative p-4 sm:p-6">
                {/* Base track image */}
                <img
                  src={pistaImg}
                  alt="Sistema de revenue — pista comercial"
                  className="w-full h-auto select-none transition-opacity duration-500"
                  style={{ opacity: selected ? 0.35 : 0.55 }}
                  loading="lazy"
                  draggable={false}
                />

                {/* Zone highlight overlay */}
                <div className="absolute inset-0 m-4 sm:m-6" style={{ pointerEvents: "none" }}>
                  <AnimatePresence>
                    {activeOption && (() => {
                      const hl = ZONE_HIGHLIGHTS[activeOption.zone];
                      return (
                        <motion.div
                          key={activeOption.zone}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute rounded-3xl"
                          style={{
                            left: `${hl.x}%`,
                            top: `${hl.y}%`,
                            width: `${hl.w}%`,
                            height: `${hl.h}%`,
                            background: `radial-gradient(ellipse at center, hsl(${hl.color} / 0.15) 0%, hsl(${hl.color} / 0.04) 60%, transparent 100%)`,
                            border: `1.5px solid hsl(${hl.color} / 0.2)`,
                            boxShadow: `0 0 40px hsl(${hl.color} / 0.1), inset 0 0 30px hsl(${hl.color} / 0.05)`,
                          }}
                        />
                      );
                    })()}
                  </AnimatePresence>

                  {/* Zone labels */}
                  {Object.entries(ZONE_HIGHLIGHTS).map(([zone, hl]) => {
                    const isActive = activeOption?.zone === zone;
                    const label = zone.charAt(0).toUpperCase() + zone.slice(1);
                    return (
                      <div
                        key={zone}
                        className="absolute transition-all duration-500"
                        style={{
                          left: `${hl.x + hl.w / 2}%`,
                          top: `${hl.y + hl.h / 2}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <motion.span
                          animate={{ opacity: isActive ? 1 : 0.15 }}
                          transition={{ duration: 0.4 }}
                          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]"
                          style={{
                            color: isActive
                              ? `hsl(${hl.color})`
                              : "hsl(var(--muted-foreground) / 0.4)",
                            textShadow: isActive
                              ? `0 0 12px hsl(${hl.color} / 0.4)`
                              : "none",
                          }}
                        >
                          {label}
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
