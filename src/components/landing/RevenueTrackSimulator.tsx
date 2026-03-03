import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Play } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ─── Toggle definitions ─── */
type Toggle = { id: string; label: string; zone: "marketing" | "ventas" | "servicio" };

const TOGGLES: Toggle[] = [
  { id: "sla", label: "SLA Marketing → Ventas", zone: "marketing" },
  { id: "pipeline", label: "Pipeline definido", zone: "marketing" },
  { id: "stages", label: "Etapas con criterios (MQL/SQL)", zone: "ventas" },
  { id: "automation", label: "Automatización conectada", zone: "ventas" },
  { id: "crm", label: "CRM configurado por proceso", zone: "servicio" },
];

/* ─── Ball path keyframes (SVG-relative %) ─── */
const PATH_POINTS = [
  { x: 12, y: 85 },  // start
  { x: 22, y: 68 },  // after sla
  { x: 38, y: 52 },  // after pipeline
  { x: 55, y: 38 },  // after stages
  { x: 72, y: 22 },  // after automation
  { x: 88, y: 8 },   // finish (crm)
];

const HOTSPOTS: { label: string; zone: "marketing" | "ventas" | "servicio"; x: number; y: number }[] = [
  { label: "Marketing", zone: "marketing", x: 18, y: 76 },
  { label: "Ventas", zone: "ventas", x: 48, y: 44 },
  { label: "Servicio", zone: "servicio", x: 78, y: 16 },
];

const ZONE_COLORS: Record<string, string> = {
  marketing: "var(--pink)",
  ventas: "var(--purple)",
  servicio: "var(--teal)",
};

/* ─── Failure messages per toggle ─── */
const FAILURE_MSG: Record<string, string> = {
  sla: "Sin SLA, los leads se pierden entre equipos.",
  pipeline: "Sin pipeline, no hay visibilidad de oportunidades.",
  stages: "Sin criterios claros, todo es un 'lead caliente'.",
  automation: "Sin automatización, el equipo pierde tiempo en tareas manuales.",
  crm: "Sin CRM alineado al proceso, los datos mienten.",
};

export default function RevenueTrackSimulator({ section }: { section?: HomeSection }) {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const ctaText = section?.cta_text ?? "Diagnosticar mi sistema";
  const ctaUrl = section?.cta_url ?? "#";

  const [active, setActive] = useState<Record<string, boolean>>({});
  const [started, setStarted] = useState(false);

  const activeCount = TOGGLES.filter((t) => active[t.id]).length;
  const allActive = activeCount === TOGGLES.length;

  // Ball stops at the first inactive toggle
  const ballStopIndex = useMemo(() => {
    if (!started) return 0;
    for (let i = 0; i < TOGGLES.length; i++) {
      if (!active[TOGGLES[i].id]) return i;
    }
    return TOGGLES.length;
  }, [active, started]);

  const ballPos = PATH_POINTS[ballStopIndex];

  // First inactive toggle (for failure message)
  const firstBroken = started ? TOGGLES.find((t) => !active[t.id]) : null;

  // Zone status
  const zoneActive = useCallback(
    (zone: string) => TOGGLES.filter((t) => t.zone === zone).every((t) => active[t.id]),
    [active]
  );

  const toggle = useCallback((id: string) => {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!started) setStarted(true);
  }, [started]);

  const reset = useCallback(() => {
    setActive({});
    setStarted(false);
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))" }}
      aria-label="Simulador: el problema es el sistema"
    >
      {/* Ambient */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, top: -150, left: -200,
          background: "radial-gradient(circle, hsl(var(--pink) / 0.06) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      <div className="relative z-10 max-w-[1140px] mx-auto">
        {/* ═══ MOBILE: visual first ═══ */}
        <div className="block lg:hidden mb-10">
          <TrackVisual
            ballPos={ballPos}
            started={started}
            allActive={allActive}
            firstBroken={firstBroken}
            zoneActive={zoneActive}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* ═══ LEFT: Content ═══ */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block self-start px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] mb-5"
              style={{
                border: "1px solid hsl(var(--pink) / 0.3)",
                color: "hsl(var(--pink))",
              }}
            >
              14 Años Construyendo Revenue
            </motion.span>

            {/* H2 */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-[1.1] tracking-tight text-primary-foreground"
            >
              El problema no es tu equipo.{" "}
              <span className="text-gradient-brand">Es el sistema donde operan.</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="mt-4 text-base sm:text-lg text-muted-foreground"
            >
              Haz correr el revenue por tu pista.
            </motion.p>

            {/* Start button */}
            {!started && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleStart}
                className="mt-6 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                style={{
                  background: "hsl(var(--pink))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                <Play size={16} />
                Iniciar flujo
              </motion.button>
            )}

            {/* Toggles — show after start */}
            <AnimatePresence>
              {started && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 space-y-2.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Piezas del sistema
                    </span>
                    {activeCount > 0 && (
                      <button
                        onClick={reset}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary-foreground transition-colors"
                        aria-label="Reiniciar"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                    )}
                  </div>

                  {TOGGLES.map((t, i) => {
                    const on = !!active[t.id];
                    const color = ZONE_COLORS[t.zone];
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        role="switch"
                        aria-checked={on}
                        aria-label={t.label}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(t.id);
                          }
                        }}
                        onClick={() => toggle(t.id)}
                        className="group flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
                        style={{
                          background: on
                            ? `hsl(${color} / 0.07)`
                            : "hsl(var(--dark-card))",
                          border: `1px solid ${on ? `hsl(${color} / 0.25)` : "hsl(var(--muted-foreground) / 0.08)"}`,
                        }}
                      >
                        {/* Mini toggle */}
                        <div
                          className="w-9 h-[22px] rounded-full flex items-center px-[2px] shrink-0 transition-colors duration-200"
                          style={{
                            background: on
                              ? `hsl(${color})`
                              : "hsl(var(--muted-foreground) / 0.18)",
                          }}
                        >
                          <motion.div
                            className="w-[18px] h-[18px] rounded-full shadow-sm"
                            style={{ background: "hsl(var(--primary-foreground))" }}
                            animate={{ x: on ? 14 : 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          />
                        </div>

                        <span
                          className="text-[13px] sm:text-sm font-medium transition-colors duration-200"
                          style={{
                            color: on
                              ? `hsl(${color})`
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {t.label}
                        </span>
                      </motion.div>
                    );
                  })}

                  {/* Microcopy */}
                  <p className="text-[11px] text-muted-foreground/60 italic pt-1 pl-1">
                    Activa piezas para eliminar fricción.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CTA final (all ON) ── */}
            <AnimatePresence>
              {allActive && started && (
                <motion.div
                  key="cta-success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mt-8 rounded-xl p-5 sm:p-6"
                  style={{
                    background: "hsl(var(--teal) / 0.07)",
                    border: "1px solid hsl(var(--teal) / 0.2)",
                  }}
                >
                  <p className="text-sm sm:text-base font-semibold" style={{ color: "hsl(var(--teal))" }}>
                    ✓ Listo: el sistema está alineado.
                  </p>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                    Esto es lo que pasa cuando las piezas encajan. ¿Quieres saber cómo está tu sistema real?
                  </p>
                  <motion.a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105"
                    style={{
                      background: "hsl(var(--pink))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    {ctaText}
                    <ArrowRight size={15} />
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT: Track visual (desktop only) ═══ */}
          <div className="hidden lg:block">
            <TrackVisual
              ballPos={ballPos}
              started={started}
              allActive={allActive}
              firstBroken={firstBroken}
              zoneActive={zoneActive}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Track Visual Sub-component
   ═══════════════════════════════════════════ */
type TrackVisualProps = {
  ballPos: { x: number; y: number };
  started: boolean;
  allActive: boolean;
  firstBroken: Toggle | null;
  zoneActive: (zone: string) => boolean;
};

function TrackVisual({ ballPos, started, allActive, firstBroken, zoneActive }: TrackVisualProps) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "hsl(var(--dark-card))",
        border: "1px solid hsl(var(--muted-foreground) / 0.06)",
      }}
    >
      <div className="relative aspect-[4/5] sm:aspect-[3/4] p-4 sm:p-6">
        {/* Track image */}
        <img
          src={pistaImg}
          alt="Pista de revenue"
          className="w-full h-full object-contain transition-opacity duration-500"
          style={{ opacity: started ? 0.7 : 0.35 }}
          loading="lazy"
        />

        {/* Hotspot labels */}
        {HOTSPOTS.map((hp) => {
          const isActive = zoneActive(hp.zone);
          const color = ZONE_COLORS[hp.zone];
          return (
            <div
              key={hp.zone}
              className="absolute flex items-center gap-1.5 transition-opacity duration-300"
              style={{
                left: `${hp.x}%`,
                top: `${hp.y}%`,
                opacity: started ? 1 : 0.3,
              }}
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: isActive ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.3)",
                  boxShadow: isActive ? `0 0 8px hsl(${color} / 0.5)` : "none",
                }}
              />
              <span
                className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300"
                style={{
                  color: isActive ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.4)",
                }}
              >
                {hp.label}
              </span>
            </div>
          );
        })}

        {/* Ball */}
        {started && (
          <motion.div
            className="absolute z-20 will-change-transform"
            animate={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 16,
              mass: 1.2,
            }}
            style={{ marginLeft: -14, marginTop: -14 }}
          >
            {/* Glow */}
            <div
              className="absolute inset-[-8px] rounded-full transition-all duration-500"
              style={{
                background: allActive
                  ? "hsl(var(--teal) / 0.15)"
                  : "hsl(var(--pink) / 0.12)",
                filter: "blur(10px)",
              }}
            />

            {/* Core ball */}
            <motion.div
              className="relative w-7 h-7 rounded-full"
              animate={
                allActive
                  ? { scale: [1, 1.2, 1] }
                  : firstBroken
                  ? { x: [0, -2, 2, -1, 0] } // shake when blocked
                  : {}
              }
              transition={
                allActive
                  ? { duration: 0.6, repeat: 2 }
                  : { duration: 0.4, repeat: Infinity, repeatDelay: 2 }
              }
              style={{
                background: allActive
                  ? "hsl(var(--teal))"
                  : "hsl(var(--pink))",
                boxShadow: allActive
                  ? "0 0 20px hsl(var(--teal) / 0.6), 0 0 40px hsl(var(--teal) / 0.2)"
                  : "0 0 16px hsl(var(--pink) / 0.5)",
              }}
            />

            {/* Pulse ring when blocked */}
            {!allActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid hsl(var(--pink) / 0.3)" }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}

        {/* Failure message overlay */}
        <AnimatePresence>
          {firstBroken && started && (
            <motion.div
              key="fail"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute bottom-4 left-4 right-4 rounded-lg px-4 py-3 backdrop-blur-sm"
              style={{
                background: "hsl(var(--dark-bg) / 0.85)",
                border: "1px solid hsl(var(--pink) / 0.15)",
              }}
            >
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                <span style={{ color: "hsl(var(--pink))" }} className="font-semibold">
                  ⚠ Bloqueo:{" "}
                </span>
                {FAILURE_MSG[firstBroken.id]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {allActive && started && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 rounded-lg px-4 py-3 backdrop-blur-sm"
              style={{
                background: "hsl(var(--dark-bg) / 0.85)",
                border: "1px solid hsl(var(--teal) / 0.2)",
              }}
            >
              <p className="text-[11px] sm:text-xs font-medium" style={{ color: "hsl(var(--teal))" }}>
                ✓ Revenue fluye sin fricción.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state */}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/40 font-medium tracking-wide uppercase">
              Presiona "Iniciar flujo" para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
