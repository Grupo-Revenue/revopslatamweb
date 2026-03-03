import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, RotateCcw } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ─── Types ─── */
type Checkpoint = {
  id: string;
  label: string;
  description: string;
  fixed: boolean;
};

const DEFAULT_CHECKPOINTS: Checkpoint[] = [
  {
    id: "crm",
    label: "CRM & Datos",
    description: "Tu CRM tiene datos, pero nadie confía en ellos. Las decisiones se toman con hojas de cálculo paralelas.",
    fixed: false,
  },
  {
    id: "process",
    label: "Proceso Comercial",
    description: "No hay un proceso unificado. Cada vendedor tiene su propio método y no hay visibilidad del pipeline real.",
    fixed: false,
  },
  {
    id: "alignment",
    label: "Alineación MKT ↔ Ventas",
    description: "Marketing genera leads que ventas ignora. No hay SLA, no hay feedback loop, no hay acuerdo sobre qué es un lead calificado.",
    fixed: false,
  },
  {
    id: "metrics",
    label: "Métricas & Forecast",
    description: "El forecast es un ejercicio de ficción. No hay métricas claras por etapa ni visibilidad real de conversión.",
    fixed: false,
  },
];

/* ─── Ball path positions (percentage along the track for each state) ─── */
const BALL_POSITIONS = [
  { x: "8%", y: "82%" },   // Start
  { x: "30%", y: "62%" },  // After checkpoint 1
  { x: "52%", y: "42%" },  // After checkpoint 2
  { x: "72%", y: "25%" },  // After checkpoint 3
  { x: "90%", y: "10%" },  // After checkpoint 4 (finish!)
];

/* ─── Component ─── */
export default function RevenueTrackSimulator({ section }: { section?: HomeSection }) {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "El problema no es tu equipo.";
  const subtitle = section?.subtitle ?? "Es el sistema donde opera.";
  const ctaText = section?.cta_text ?? "Diagnosticar mi sistema";
  const ctaUrl = section?.cta_url ?? "#";

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(() => {
    const metaItems = meta.checkpoints as Array<{ id: string; label: string; description: string }> | undefined;
    if (metaItems?.length) {
      return metaItems.map((c) => ({ ...c, fixed: false }));
    }
    return DEFAULT_CHECKPOINTS.map((c) => ({ ...c }));
  });

  const fixedCount = checkpoints.filter((c) => c.fixed).length;
  const allFixed = fixedCount === checkpoints.length;

  // Ball stops at the first broken checkpoint
  const ballStopIndex = (() => {
    for (let i = 0; i < checkpoints.length; i++) {
      if (!checkpoints[i].fixed) return i;
    }
    return checkpoints.length; // all fixed → finish
  })();

  const ballPos = BALL_POSITIONS[ballStopIndex];

  const toggleCheckpoint = useCallback((id: string) => {
    setCheckpoints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fixed: !c.fixed } : c))
    );
  }, []);

  const resetAll = useCallback(() => {
    setCheckpoints((prev) => prev.map((c) => ({ ...c, fixed: false })));
  }, []);

  // Keyboard support for toggles
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCheckpoint(id);
      }
    },
    [toggleCheckpoint]
  );

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))" }}
      aria-label="Simulador interactivo: el problema es el sistema"
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: -100,
          right: -200,
          background: "radial-gradient(circle, hsl(var(--pink) / 0.08) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-section font-bold leading-[1.12] tracking-tight text-primary-foreground"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto"
          >
            {subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm text-muted-foreground/70 italic"
          >
            Activa cada pieza del sistema y observa cómo fluye el revenue →
          </motion.p>
        </div>

        {/* Main grid: Track visual + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT: Track visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative aspect-[3/4] sm:aspect-square lg:aspect-[3/4] max-w-[480px] mx-auto w-full"
          >
            {/* Track image */}
            <img
              src={pistaImg}
              alt="Pista de revenue — metáfora visual del sistema comercial"
              className="w-full h-full object-contain opacity-60"
              loading="lazy"
            />

            {/* Ball */}
            <motion.div
              className="absolute z-20 will-change-transform"
              animate={{
                left: ballPos.x,
                top: ballPos.y,
                scale: allFixed ? [1, 1.3, 1] : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 18,
                duration: 0.8,
              }}
              style={{ marginLeft: -16, marginTop: -16 }}
            >
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{
                  background: allFixed
                    ? "hsl(var(--teal))"
                    : `hsl(var(--pink))`,
                  boxShadow: allFixed
                    ? "0 0 24px hsl(var(--teal) / 0.5)"
                    : "0 0 20px hsl(var(--pink) / 0.4)",
                }}
              />
              {/* Pulse ring when blocked */}
              {!allFixed && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2px solid hsl(var(--pink) / 0.4)",
                  }}
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Checkpoint markers on track */}
            {checkpoints.map((cp, i) => {
              const pos = BALL_POSITIONS[i];
              const isFixed = cp.fixed;
              return (
                <motion.div
                  key={cp.id}
                  className="absolute z-10"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    marginLeft: -12,
                    marginTop: -12,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-300"
                    style={{
                      background: isFixed
                        ? "hsl(var(--teal) / 0.2)"
                        : "hsl(var(--pink) / 0.15)",
                      border: `2px solid ${isFixed ? "hsl(var(--teal))" : "hsl(var(--pink) / 0.5)"}`,
                      color: isFixed
                        ? "hsl(var(--teal))"
                        : "hsl(var(--pink))",
                    }}
                  >
                    {isFixed ? <Check size={12} /> : <X size={10} />}
                  </div>
                </motion.div>
              );
            })}

            {/* Progress label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="flex gap-1">
                {checkpoints.map((cp, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-colors duration-300"
                    style={{
                      background: cp.fixed
                        ? "hsl(var(--teal))"
                        : "hsl(var(--muted-foreground) / 0.3)",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {fixedCount}/{checkpoints.length}
              </span>
            </div>
          </motion.div>

          {/* RIGHT: Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Piezas del sistema
              </span>
              {fixedCount > 0 && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary-foreground transition-colors"
                  aria-label="Reiniciar simulador"
                >
                  <RotateCcw size={12} />
                  Reiniciar
                </button>
              )}
            </div>

            {checkpoints.map((cp, i) => (
              <motion.div
                key={cp.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                role="switch"
                aria-checked={cp.fixed}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, cp.id)}
                onClick={() => toggleCheckpoint(cp.id)}
                className="group relative rounded-xl p-5 cursor-pointer transition-all duration-300 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  background: cp.fixed
                    ? "hsl(var(--teal) / 0.06)"
                    : "hsl(var(--dark-card))",
                  border: `1px solid ${
                    cp.fixed
                      ? "hsl(var(--teal) / 0.25)"
                      : "hsl(var(--pink) / 0.1)"
                  }`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Toggle indicator */}
                  <div
                    className="mt-0.5 w-10 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 shrink-0"
                    style={{
                      background: cp.fixed
                        ? "hsl(var(--teal))"
                        : "hsl(var(--muted-foreground) / 0.2)",
                    }}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-primary-foreground shadow-sm"
                      animate={{ x: cp.fixed ? 16 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-sm sm:text-base font-semibold transition-colors duration-300"
                        style={{
                          color: cp.fixed
                            ? "hsl(var(--teal))"
                            : "hsl(var(--primary-foreground))",
                        }}
                      >
                        {cp.label}
                      </h4>
                      {cp.fixed && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: "hsl(var(--teal) / 0.15)",
                            color: "hsl(var(--teal))",
                          }}
                        >
                          Activo
                        </motion.span>
                      )}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {cp.description}
                    </p>
                  </div>
                </div>

                {/* Accent bar */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-colors duration-300"
                  style={{
                    background: cp.fixed ? "hsl(var(--teal))" : "hsl(var(--pink) / 0.4)",
                  }}
                />
              </motion.div>
            ))}

            {/* Status message */}
            <AnimatePresence mode="wait">
              {allFixed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-xl p-6 text-center mt-6"
                  style={{
                    background: "hsl(var(--teal) / 0.08)",
                    border: "1px solid hsl(var(--teal) / 0.2)",
                  }}
                >
                  <p className="text-base sm:text-lg font-semibold" style={{ color: "hsl(var(--teal))" }}>
                    Revenue fluye. El sistema funciona.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Esto es lo que pasa cuando las piezas encajan. ¿Listo para diagnosticar tu sistema real?
                  </p>
                  <motion.a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105"
                    style={{
                      background: "hsl(var(--pink))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    {ctaText}
                    <ArrowRight size={16} />
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div
                  key="blocked"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl p-4 text-center mt-6"
                  style={{
                    background: "hsl(var(--pink) / 0.05)",
                    border: "1px solid hsl(var(--pink) / 0.1)",
                  }}
                >
                  <p className="text-sm text-muted-foreground">
                    <span style={{ color: "hsl(var(--pink))" }} className="font-semibold">
                      Revenue bloqueado.
                    </span>{" "}
                    Activa las {checkpoints.length - fixedCount} pieza{checkpoints.length - fixedCount !== 1 ? "s" : ""} restante{checkpoints.length - fixedCount !== 1 ? "s" : ""} para desbloquearlo.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
