import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowRight, RotateCcw, Play, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ═══════════════════════════════════════════════════════════
   STATE MACHINE
   idle → running → fail_marketing | fail_sales | fail_service | success
   ═══════════════════════════════════════════════════════════ */
type SimState =
  | "idle"
  | "running"
  | "fail_marketing"
  | "fail_sales"
  | "fail_service"
  | "success";

/* ─── Toggle definitions ─── */
type Toggle = {
  id: string;
  label: string;
  zone: "marketing" | "ventas" | "servicio";
  failState: "fail_marketing" | "fail_sales" | "fail_service";
  failMessage: string;
};

const TOGGLES: Toggle[] = [
  {
    id: "sla",
    label: "SLA Marketing → Ventas",
    zone: "marketing",
    failState: "fail_marketing",
    failMessage: "Sin SLA definido, los leads se pierden entre Marketing y Ventas.",
  },
  {
    id: "stages",
    label: "Etapas con criterios (MQL/SQL)",
    zone: "marketing",
    failState: "fail_marketing",
    failMessage: "Sin criterios claros de calificación, todo parece un 'lead caliente'.",
  },
  {
    id: "pipeline",
    label: "Pipeline definido",
    zone: "ventas",
    failState: "fail_sales",
    failMessage: "Sin pipeline estructurado, no hay visibilidad real de oportunidades.",
  },
  {
    id: "crm",
    label: "CRM configurado por proceso",
    zone: "ventas",
    failState: "fail_sales",
    failMessage: "El CRM no refleja tu proceso real. Los datos mienten.",
  },
  {
    id: "automation",
    label: "Automatización conectada",
    zone: "servicio",
    failState: "fail_service",
    failMessage: "Sin automatización, el equipo pierde horas en tareas repetitivas.",
  },
];

/* ─── Path points mapped to the SVG viewBox (786.67 × 1113.29) as % ─── 
   The track is isometric, flowing bottom→top:
   - Start: bottom-center circular area
   - Marketing zone: lower ramp sections
   - Ventas zone: middle zig-zag
   - Servicio zone: top gear mechanism
   - Finish: top of gear/flag area
*/
type PathPoint = { x: number; y: number };

// Percentage coordinates relative to the image container
const TRACK_PATH: PathPoint[] = [
  // START — bottom circular area
  { x: 46, y: 92 },
  { x: 43, y: 86 },
  { x: 38, y: 78 },
  // MARKETING ZONE — lower ramps (checkpoint after index 4)
  { x: 30, y: 72 },
  { x: 28, y: 65 },
  { x: 42, y: 58 },   // CP1: sla — index 5
  { x: 55, y: 54 },
  { x: 58, y: 48 },
  { x: 45, y: 42 },   // CP2: stages — index 8
  // VENTAS ZONE — middle zig-zag (checkpoint after index 11)
  { x: 35, y: 38 },
  { x: 55, y: 32 },
  { x: 65, y: 28 },   // CP3: pipeline — index 11
  { x: 75, y: 24 },
  { x: 80, y: 20 },   // CP4: crm — index 13
  // SERVICIO ZONE — gear mechanism at top
  { x: 85, y: 15 },
  { x: 88, y: 10 },   // CP5: automation — index 15
  // FINISH
  { x: 82, y: 6 },
  { x: 75, y: 4 },
];

// Checkpoint definitions: which path index corresponds to each toggle
const CHECKPOINTS: { toggleId: string; pathIndex: number }[] = [
  { toggleId: "sla", pathIndex: 5 },
  { toggleId: "stages", pathIndex: 8 },
  { toggleId: "pipeline", pathIndex: 11 },
  { toggleId: "crm", pathIndex: 13 },
  { toggleId: "automation", pathIndex: 15 },
];

const FAIL_TOOLTIPS = {
  fail_marketing: {
    cause: "Marketing y Ventas no están alineados.",
    action: "Activa SLA y criterios (MQL/SQL) para que la pelota no se caiga.",
  },
  fail_sales: {
    cause: "Ventas está operando sin un proceso claro.",
    action: "Activa Pipeline y CRM por proceso para que el flujo no se atasque.",
  },
  fail_service: {
    cause: "El sistema no está automatizado.",
    action: "Activa automatización conectada para evitar loops y desvíos.",
  },
};

// Zone hotspot areas (percentage positions on the image)
const HOTSPOTS = [
  { label: "Marketing", zone: "marketing" as const, x: 22, y: 68 },
  { label: "Ventas", zone: "ventas" as const, x: 42, y: 34 },
  { label: "Servicio", zone: "servicio" as const, x: 90, y: 12 },
];

const ZONE_COLORS: Record<string, string> = {
  marketing: "var(--pink)",
  ventas: "var(--purple)",
  servicio: "var(--teal)",
};

/* ═══ Lightweight confetti ═══ */
function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const hues = [337, 263, 175, 42];
    return {
      id: i,
      hue: hues[i % 4],
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.5,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * 360,
    };
  });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            left: `${p.left}%`,
            top: "-4%",
            background: `hsl(${p.hue} 70% 55%)`,
            rotate: p.rotation,
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: [0, 200 + Math.random() * 150],
            opacity: [1, 1, 0],
            rotate: p.rotation + 300 + Math.random() * 200,
            x: (Math.random() - 0.5) * 60,
          }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function RevenueTrackSimulator({ section }: { section?: HomeSection }) {
  const ctaText = section?.cta_text ?? "Diagnosticar mi sistema";
  const ctaUrl = section?.cta_url ?? "#";

  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [simState, setSimState] = useState<SimState>("idle");
  const [failInfo, setFailInfo] = useState<{ toggle: Toggle; pos: PathPoint } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ballPos, setBallPos] = useState<PathPoint>(TRACK_PATH[0]);

  const ballControls = useAnimation();
  const runIdRef = useRef(0);

  const activeCount = TOGGLES.filter((t) => toggles[t.id]).length;
  const allActive = activeCount === TOGGLES.length;
  const isRunning = simState === "running";
  const isFailed = simState.startsWith("fail_");
  const isSuccess = simState === "success";
  const isIdle = simState === "idle";

  const zoneActive = useCallback(
    (zone: string) => TOGGLES.filter((t) => t.zone === zone).every((t) => toggles[t.id]),
    [toggles]
  );

  // Glow on toggle
  const [glowZone, setGlowZone] = useState<string | null>(null);
  const glowTimer = useRef<ReturnType<typeof setTimeout>>();

  const toggleItem = useCallback(
    (id: string) => {
      if (isRunning) return;
      const t = TOGGLES.find((t) => t.id === id);
      setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
      if (t) {
        setGlowZone(t.zone);
        clearTimeout(glowTimer.current);
        glowTimer.current = setTimeout(() => setGlowZone(null), 1200);
      }
    },
    [isRunning]
  );

  /* ─── Animate ball along the path ─── */
  const runSimulation = useCallback(async () => {
    const thisRun = ++runIdRef.current;
    setSimState("running");
    setFailInfo(null);
    setShowConfetti(false);

    // Reset to start
    const start = TRACK_PATH[0];
    setBallPos(start);
    await ballControls.start({
      left: `${start.x}%`,
      top: `${start.y}%`,
      transition: { duration: 0.01 },
    });

    // Walk the path point by point
    for (let i = 1; i < TRACK_PATH.length; i++) {
      if (thisRun !== runIdRef.current) return;

      const pt = TRACK_PATH[i];
      const segDuration = 0.35 + Math.random() * 0.25; // 0.35–0.6s per segment

      await ballControls.start({
        left: `${pt.x}%`,
        top: `${pt.y}%`,
        transition: {
          duration: segDuration,
          ease: [0.4, 0, 0.2, 1],
        },
      });

      if (thisRun !== runIdRef.current) return;
      setBallPos(pt);

      // Check if this index is a checkpoint
      const cp = CHECKPOINTS.find((c) => c.pathIndex === i);
      if (cp && !toggles[cp.toggleId]) {
        const missingToggle = TOGGLES.find((t) => t.id === cp.toggleId)!;
        const failState = missingToggle.failState;

        // Failure animation based on zone
        if (failState === "fail_marketing") {
          // Ball falls down & bounces
          await ballControls.start({
            top: `${pt.y + 5}%`,
            transition: { duration: 0.4, ease: "easeIn" },
          });
          await ballControls.start({
            top: `${pt.y + 3}%`,
            transition: { duration: 0.2, ease: "easeOut" },
          });
        } else if (failState === "fail_sales") {
          // Ball stuck — vibrate
          for (let v = 0; v < 3; v++) {
            if (thisRun !== runIdRef.current) return;
            await ballControls.start({
              left: `${pt.x + 1.5}%`,
              transition: { duration: 0.08 },
            });
            await ballControls.start({
              left: `${pt.x - 1.5}%`,
              transition: { duration: 0.08 },
            });
          }
          await ballControls.start({
            left: `${pt.x}%`,
            transition: { duration: 0.1 },
          });
        } else {
          // fail_service — ball loops/orbits
          await ballControls.start({
            left: [`${pt.x}%`, `${pt.x + 3}%`, `${pt.x}%`, `${pt.x - 2}%`, `${pt.x}%`],
            top: [`${pt.y}%`, `${pt.y - 2}%`, `${pt.y + 2}%`, `${pt.y - 1}%`, `${pt.y}%`],
            transition: { duration: 1, ease: "easeInOut" },
          });
        }

        if (thisRun !== runIdRef.current) return;
        setSimState(failState);
        setFailInfo({ toggle: missingToggle, pos: pt });
        return;
      }
    }

    if (thisRun !== runIdRef.current) return;
    setSimState("success");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  }, [toggles, ballControls]);

  const handleStart = useCallback(() => runSimulation(), [runSimulation]);
  const handleRetry = useCallback(() => runSimulation(), [runSimulation]);

  const handleReset = useCallback(() => {
    runIdRef.current++;
    setToggles({});
    setSimState("idle");
    setFailInfo(null);
    setShowConfetti(false);
    const start = TRACK_PATH[0];
    setBallPos(start);
    ballControls.start({
      left: `${start.x}%`,
      top: `${start.y}%`,
      transition: { duration: 0.3 },
    });
  }, [ballControls]);

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))" }}
      aria-label="Simulador interactivo de revenue"
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, top: -120, left: -200,
          background: "radial-gradient(circle, hsl(var(--pink) / 0.06) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      <div className="relative z-10 max-w-[1140px] mx-auto">
        {/* ═══ MOBILE: Track visual first ═══ */}
        <div className="block lg:hidden mb-10">
          <TrackVisual
            ballControls={ballControls}
            simState={simState}
            ballPos={ballPos}
            failInfo={failInfo}
            zoneActive={zoneActive}
            glowZone={glowZone}
            showConfetti={showConfetti}
            onRetry={handleRetry}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* ═══ LEFT COLUMN: Content & Controls ═══ */}
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
            <AnimatePresence mode="wait">
              {(isIdle || isFailed) && (
                <motion.button
                  key={isFailed ? "retry" : "start"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  onClick={isFailed ? handleRetry : handleStart}
                  className="mt-6 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  style={{
                    background: "hsl(var(--pink))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  {isFailed ? (
                    <><RotateCcw size={15} /> Reintentar</>
                  ) : (
                    <><Play size={15} /> Iniciar flujo</>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {isRunning && (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "hsl(var(--pink))" }}
                  animate={{ opacity: [1, 0.3] }}
                  transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
                />
                Recorriendo la pista…
              </div>
            )}

            {/* ─── Toggles ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="mt-7 space-y-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Piezas del sistema
                </span>
                {(activeCount > 0 || !isIdle) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                )}
              </div>

              {TOGGLES.map((t, i) => {
                const on = !!toggles[t.id];
                const color = ZONE_COLORS[t.zone];
                const isFailing = failInfo?.toggle.id === t.id;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    role="switch"
                    aria-checked={on}
                    aria-label={t.label}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleItem(t.id);
                      }
                    }}
                    onClick={() => toggleItem(t.id)}
                    className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary select-none ${
                      isRunning ? "opacity-50 pointer-events-none" : ""
                    }`}
                    style={{
                      background: isFailing
                        ? "hsl(var(--pink) / 0.1)"
                        : on
                        ? `hsl(${color} / 0.07)`
                        : "hsl(var(--dark-card))",
                      border: `1px solid ${
                        isFailing
                          ? "hsl(var(--pink) / 0.4)"
                          : on
                          ? `hsl(${color} / 0.25)`
                          : "hsl(var(--muted-foreground) / 0.08)"
                      }`,
                    }}
                  >
                    {/* Toggle switch */}
                    <div
                      className="w-9 h-[22px] rounded-full flex items-center px-[2px] shrink-0 transition-colors duration-200"
                      style={{
                        background: on ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.18)",
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
                        color: isFailing ? "hsl(var(--pink))" : on ? `hsl(${color})` : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {t.label}
                    </span>
                    {isFailing && (
                      <AlertTriangle size={14} className="shrink-0 ml-auto" style={{ color: "hsl(var(--pink))" }} />
                    )}
                  </motion.div>
                );
              })}

              <p className="text-[11px] text-muted-foreground/50 italic pt-1 pl-1">
                Activa piezas para eliminar fricción.
              </p>
            </motion.div>

            {/* ─── Success CTA ─── */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  key="cta-ok"
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
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: "hsl(var(--teal))" }} />
                    <div>
                      <p className="text-sm sm:text-base font-semibold" style={{ color: "hsl(var(--teal))" }}>
                        Listo: el sistema está alineado.
                      </p>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                        ¿Quieres saber cómo está tu sistema real?
                      </p>
                    </div>
                  </div>
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

          {/* ═══ RIGHT COLUMN: Track visual (desktop) ═══ */}
          <div className="hidden lg:block sticky top-20">
            <TrackVisual
              ballControls={ballControls}
              simState={simState}
              ballPos={ballPos}
              failInfo={failInfo}
              zoneActive={zoneActive}
              glowZone={glowZone}
              showConfetti={showConfetti}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRACK VISUAL — overlays ball & hotspots on the image
   ═══════════════════════════════════════════════════════════ */
type TrackVisualProps = {
  ballControls: ReturnType<typeof useAnimation>;
  simState: SimState;
  ballPos: PathPoint;
  failInfo: { toggle: Toggle; pos: PathPoint } | null;
  zoneActive: (zone: string) => boolean;
  glowZone: string | null;
  showConfetti: boolean;
  onRetry: () => void;
};

function TrackVisual({
  ballControls,
  simState,
  ballPos,
  failInfo,
  zoneActive,
  glowZone,
  showConfetti,
  onRetry,
}: TrackVisualProps) {
  const isIdle = simState === "idle";
  const isSuccess = simState === "success";
  const isFailed = simState.startsWith("fail_");

  return (
    <div className="relative w-full">
      {/* Image container — position: relative as requested */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#F5F5F8",
          border: "1px solid hsl(var(--muted-foreground) / 0.1)",
        }}
      >
        {showConfetti && <Confetti />}

        <div className="relative p-3 sm:p-5">
          {/* Base track image */}
          <img
            src={pistaImg}
            alt="Pista de revenue — sistema comercial"
            className="w-full h-auto transition-opacity duration-700 select-none"
            style={{ opacity: isIdle ? 0.3 : 0.7 }}
            loading="lazy"
            draggable={false}
          />

          {/* ─── Overlay layer for ball, hotspots, tooltips ─── */}
          <div className="absolute inset-0 m-3 sm:m-5" style={{ pointerEvents: "none" }}>
            {/* Zone glow effects */}
            {HOTSPOTS.map((hp) => {
              const color = ZONE_COLORS[hp.zone];
              const isGlowing = glowZone === hp.zone;
              return (
                <AnimatePresence key={`glow-${hp.zone}`}>
                  {isGlowing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.2, scale: 1.3 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.8 }}
                      className="absolute pointer-events-none rounded-full"
                      style={{
                        left: `${hp.x - 10}%`,
                        top: `${hp.y - 6}%`,
                        width: "20%",
                        height: "12%",
                        background: `radial-gradient(circle, hsl(${color} / 0.4) 0%, transparent 70%)`,
                        filter: "blur(24px)",
                      }}
                    />
                  )}
                </AnimatePresence>
              );
            })}

            {/* Hotspot labels */}
            {HOTSPOTS.map((hp) => {
              const active = zoneActive(hp.zone);
              const color = ZONE_COLORS[hp.zone];
              return (
                <div
                  key={hp.zone}
                  className="absolute flex items-center gap-1.5 transition-all duration-500 pointer-events-none"
                  style={{
                    left: `${hp.x}%`,
                    top: `${hp.y}%`,
                    opacity: isIdle ? 0.2 : 1,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all duration-400"
                    style={{
                      background: active ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.2)",
                      boxShadow: active ? `0 0 10px hsl(${color} / 0.5)` : "none",
                    }}
                  />
                  <span
                    className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors duration-400"
                    style={{
                      color: active ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.3)",
                      textShadow: active ? `0 0 8px hsl(${color} / 0.3)` : "none",
                    }}
                  >
                    {hp.label}
                  </span>
                </div>
              );
            })}

            {/* ─── BALL ─── */}
            {!isIdle && (
              <motion.div
                className="absolute z-20 will-change-transform"
                animate={ballControls}
                initial={{
                  left: `${TRACK_PATH[0].x}%`,
                  top: `${TRACK_PATH[0].y}%`,
                }}
                style={{
                  marginLeft: -11,
                  marginTop: -11,
                  pointerEvents: "none",
                }}
              >
                {/* Glow halo */}
                <div
                  className="absolute inset-[-10px] rounded-full transition-all duration-500"
                  style={{
                    background: isSuccess
                      ? "hsl(var(--teal) / 0.2)"
                      : "hsl(var(--pink) / 0.15)",
                    filter: "blur(10px)",
                  }}
                />
                {/* Core ball */}
                <motion.div
                  className="relative w-[22px] h-[22px] rounded-full"
                  animate={
                    isSuccess
                      ? { scale: [1, 1.4, 1] }
                      : {}
                  }
                  transition={isSuccess ? { duration: 0.5, repeat: 2 } : {}}
                  style={{
                    background: isSuccess ? "hsl(var(--teal))" : "hsl(var(--pink))",
                    boxShadow: isSuccess
                      ? "0 0 20px hsl(var(--teal) / 0.6), 0 0 40px hsl(var(--teal) / 0.2)"
                      : "0 0 16px hsl(var(--pink) / 0.5), 0 0 32px hsl(var(--pink) / 0.15)",
                  }}
                />
                {/* Pulse ring when failed */}
                {isFailed && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "2px solid hsl(var(--pink) / 0.35)" }}
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity }}
                  />
                )}
              </motion.div>
            )}

            {/* ─── Failure tooltip ─── */}
            <AnimatePresence>
              {isFailed && failInfo && (
                <motion.div
                  key="fail-tt"
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  className="absolute z-30 rounded-xl px-4 py-3.5 backdrop-blur-md max-w-[280px]"
                  style={{
                    left: `${Math.min(failInfo.pos.x + 4, 65)}%`,
                    top: `${Math.max(failInfo.pos.y - 2, 4)}%`,
                    background: "hsl(var(--dark-bg) / 0.92)",
                    border: "1px solid hsl(var(--pink) / 0.25)",
                    boxShadow: "0 8px 32px hsl(var(--pink) / 0.08)",
                    pointerEvents: "auto",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={12} style={{ color: "hsl(var(--pink))" }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "hsl(var(--pink))" }}>
                      Fricción detectada
                    </span>
                  </div>
                  <p className="text-[11px] text-primary-foreground/90 font-medium leading-relaxed">
                    {FAIL_TOOLTIPS[simState as keyof typeof FAIL_TOOLTIPS]?.cause}
                  </p>
                  <p className="mt-1.5 text-[10px] text-muted-foreground/70 italic leading-relaxed">
                    {FAIL_TOOLTIPS[simState as keyof typeof FAIL_TOOLTIPS]?.action}
                  </p>
                  <button
                    onClick={onRetry}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:brightness-110"
                    style={{ color: "hsl(var(--pink))" }}
                  >
                    <RotateCcw size={10} /> Reintentar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Success banner ─── */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  key="ok-banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-3 right-3 rounded-lg px-4 py-3 backdrop-blur-sm z-30"
                  style={{
                    background: "hsl(var(--dark-bg) / 0.85)",
                    border: "1px solid hsl(var(--teal) / 0.25)",
                    pointerEvents: "none",
                  }}
                >
                  <p className="text-[11px] font-bold" style={{ color: "hsl(var(--teal))" }}>
                    ✓ Flujo continuo.
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Cuando el sistema encaja, el revenue avanza sin fricción.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Idle overlay */}
          {isIdle && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[11px] sm:text-xs text-muted-foreground/35 font-medium tracking-wide uppercase text-center px-6">
                Configura los toggles y presiona "Iniciar flujo"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
