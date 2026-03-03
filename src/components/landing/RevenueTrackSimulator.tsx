import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowRight, RotateCcw, Play, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import pistaImg from "@/assets/pista-negro.svg";

/* ═══════════════════════════════════════════════════════════
   STATE MACHINE
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

/* ─── Track path: checkpoints the ball visits sequentially ─── */
type Checkpoint = {
  x: number;
  y: number;
  zone: "marketing" | "ventas" | "servicio";
  /** Which toggle IDs must be ON to pass this checkpoint */
  requiredToggles: string[];
};

const CHECKPOINTS: Checkpoint[] = [
  { x: 15, y: 82, zone: "marketing", requiredToggles: ["sla"] },
  { x: 28, y: 66, zone: "marketing", requiredToggles: ["stages"] },
  { x: 45, y: 48, zone: "ventas", requiredToggles: ["pipeline"] },
  { x: 62, y: 32, zone: "ventas", requiredToggles: ["crm"] },
  { x: 78, y: 18, zone: "servicio", requiredToggles: ["automation"] },
];

const START_POS = { x: 8, y: 90 };
const FINISH_POS = { x: 90, y: 6 };

const ZONE_COLORS: Record<string, string> = {
  marketing: "var(--pink)",
  ventas: "var(--purple)",
  servicio: "var(--teal)",
};

const FAIL_POSITIONS: Record<string, { x: number; y: number }> = {
  fail_marketing: { x: 20, y: 75 },
  fail_sales: { x: 52, y: 42 },
  fail_service: { x: 75, y: 22 },
};

const HOTSPOTS = [
  { label: "Marketing", zone: "marketing" as const, x: 18, y: 78 },
  { label: "Ventas", zone: "ventas" as const, x: 50, y: 44 },
  { label: "Servicio", zone: "servicio" as const, x: 80, y: 14 },
];

/* ═══════════════════════════════════════════════════════════
   CONFETTI (lightweight, no library)
   ═══════════════════════════════════════════════════════════ */
function Confetti() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const hue = [337, 263, 175, 42][i % 4]; // pink, purple, teal, yellow
    const left = 10 + Math.random() * 80;
    const delay = Math.random() * 0.6;
    const size = 4 + Math.random() * 6;
    const rotation = Math.random() * 360;
    return { hue, left, delay, size, rotation, id: i };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            left: `${p.left}%`,
            top: "-5%",
            background: `hsl(${p.hue} 70% 55%)`,
            rotate: p.rotation,
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: [0, 250 + Math.random() * 200],
            opacity: [1, 1, 0],
            rotate: p.rotation + 360 + Math.random() * 180,
            x: (Math.random() - 0.5) * 80,
          }}
          transition={{
            duration: 2 + Math.random() * 1.2,
            delay: p.delay,
            ease: "easeOut",
          }}
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
  const [failInfo, setFailInfo] = useState<{ toggle: Toggle; checkpoint: Checkpoint } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const ballControls = useAnimation();
  const runIdRef = useRef(0); // to cancel stale runs

  const activeCount = TOGGLES.filter((t) => toggles[t.id]).length;
  const allActive = activeCount === TOGGLES.length;
  const isRunning = simState === "running";
  const isFailed = simState.startsWith("fail_");
  const isSuccess = simState === "success";
  const isIdle = simState === "idle";

  // Zone active helper
  const zoneActive = useCallback(
    (zone: string) => TOGGLES.filter((t) => t.zone === zone).every((t) => toggles[t.id]),
    [toggles]
  );

  // Recently toggled glow
  const [glowZone, setGlowZone] = useState<string | null>(null);
  const glowTimeout = useRef<ReturnType<typeof setTimeout>>();

  const toggleItem = useCallback(
    (id: string) => {
      if (isRunning) return; // don't toggle while ball is moving
      const t = TOGGLES.find((t) => t.id === id);
      setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
      if (t) {
        setGlowZone(t.zone);
        clearTimeout(glowTimeout.current);
        glowTimeout.current = setTimeout(() => setGlowZone(null), 1200);
      }
    },
    [isRunning]
  );

  /* ─── Run the ball through the track ─── */
  const runSimulation = useCallback(async () => {
    const thisRun = ++runIdRef.current;
    setSimState("running");
    setFailInfo(null);
    setShowConfetti(false);

    // Start position
    await ballControls.start({
      left: `${START_POS.x}%`,
      top: `${START_POS.y}%`,
      transition: { duration: 0.01 },
    });

    // Walk each checkpoint
    for (let i = 0; i < CHECKPOINTS.length; i++) {
      if (thisRun !== runIdRef.current) return; // cancelled

      const cp = CHECKPOINTS[i];
      const duration = 1.2 + i * 0.25; // 1.2s to 2.4s

      await ballControls.start({
        left: `${cp.x}%`,
        top: `${cp.y}%`,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1], // smooth ease
        },
      });

      if (thisRun !== runIdRef.current) return;

      // Check required toggles
      const missingId = cp.requiredToggles.find((tid) => !toggles[tid]);
      if (missingId) {
        const missingToggle = TOGGLES.find((t) => t.id === missingId)!;
        const failState = missingToggle.failState;
        const failPos = FAIL_POSITIONS[failState];

        // Animate to fail position (fall/stuck/loop)
        if (failState === "fail_marketing") {
          // Ball falls down
          await ballControls.start({
            left: `${failPos.x}%`,
            top: `${failPos.y + 8}%`,
            transition: { duration: 0.5, ease: "easeIn" },
          });
        } else if (failState === "fail_sales") {
          // Ball stuck - vibrate
          await ballControls.start({
            left: [`${cp.x}%`, `${cp.x + 1}%`, `${cp.x - 1}%`, `${cp.x}%`],
            top: `${cp.y}%`,
            transition: { duration: 0.4, repeat: 2 },
          });
        } else {
          // fail_service - ball loops
          await ballControls.start({
            left: [`${cp.x}%`, `${cp.x + 4}%`, `${cp.x - 2}%`, `${cp.x + 1}%`],
            top: [`${cp.y}%`, `${cp.y - 3}%`, `${cp.y + 2}%`, `${cp.y}%`],
            transition: { duration: 1.2, ease: "easeInOut" },
          });
        }

        if (thisRun !== runIdRef.current) return;
        setSimState(failState);
        setFailInfo({ toggle: missingToggle, checkpoint: cp });
        return;
      }
    }

    if (thisRun !== runIdRef.current) return;

    // All checkpoints passed → finish!
    await ballControls.start({
      left: `${FINISH_POS.x}%`,
      top: `${FINISH_POS.y}%`,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
    });

    if (thisRun !== runIdRef.current) return;
    setSimState("success");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  }, [toggles, ballControls]);

  const handleStart = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  const handleRetry = useCallback(() => {
    setFailInfo(null);
    runSimulation();
  }, [runSimulation]);

  const handleReset = useCallback(() => {
    runIdRef.current++;
    setToggles({});
    setSimState("idle");
    setFailInfo(null);
    setShowConfetti(false);
    ballControls.start({
      left: `${START_POS.x}%`,
      top: `${START_POS.y}%`,
      transition: { duration: 0.3 },
    });
  }, [ballControls]);

  // Keyboard for toggles
  const handleToggleKey = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleItem(id);
      }
    },
    [toggleItem]
  );

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
          width: 600, height: 600, top: -150, left: -200,
          background: "radial-gradient(circle, hsl(var(--pink) / 0.06) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      <div className="relative z-10 max-w-[1140px] mx-auto">
        {/* ═══ MOBILE: visual first ═══ */}
        <div className="block lg:hidden mb-10">
          <TrackVisual
            ballControls={ballControls}
            simState={simState}
            failInfo={failInfo}
            zoneActive={zoneActive}
            glowZone={glowZone}
            showConfetti={showConfetti}
            onRetry={handleRetry}
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

            {/* ─── Toggles ─── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="mt-7 space-y-2.5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Piezas del sistema
                </span>
                {(activeCount > 0 || !isIdle) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary-foreground transition-colors"
                    aria-label="Reiniciar todo"
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
                    onKeyDown={(e) => handleToggleKey(e, t.id)}
                    onClick={() => toggleItem(t.id)}
                    className={`group flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary select-none ${
                      isRunning ? "opacity-60 pointer-events-none" : ""
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
                        color: isFailing
                          ? "hsl(var(--pink))"
                          : on
                          ? `hsl(${color})`
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {t.label}
                    </span>

                    {isFailing && (
                      <AlertTriangle
                        size={14}
                        className="shrink-0 ml-auto"
                        style={{ color: "hsl(var(--pink))" }}
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Microcopy */}
              <p className="text-[11px] text-muted-foreground/60 italic pt-1 pl-1">
                Activa piezas para eliminar fricción.
              </p>
            </motion.div>

            {/* ─── Start / Retry button ─── */}
            <div className="mt-6">
              {(isIdle || isFailed) && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={isFailed ? handleRetry : handleStart}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  style={{
                    background: "hsl(var(--pink))",
                    color: "hsl(var(--primary-foreground))",
                  }}
                >
                  {isFailed ? (
                    <>
                      <RotateCcw size={15} /> Reintentar
                    </>
                  ) : (
                    <>
                      <Play size={15} /> Iniciar flujo
                    </>
                  )}
                </motion.button>
              )}

              {isRunning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "hsl(var(--pink))" }}
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  />
                  Recorriendo la pista…
                </div>
              )}
            </div>

            {/* ─── CTA Success ─── */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  key="cta-success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-8 rounded-xl p-5 sm:p-6"
                  style={{
                    background: "hsl(var(--teal) / 0.07)",
                    border: "1px solid hsl(var(--teal) / 0.2)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 mt-0.5"
                      style={{ color: "hsl(var(--teal))" }}
                    />
                    <div>
                      <p className="text-sm sm:text-base font-semibold" style={{ color: "hsl(var(--teal))" }}>
                        Listo: el sistema está alineado.
                      </p>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                        Esto es lo que pasa cuando las piezas encajan. ¿Quieres saber cómo está tu sistema real?
                      </p>
                    </div>
                  </div>
                  <motion.a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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

          {/* ═══ RIGHT: Track visual (desktop) ═══ */}
          <div className="hidden lg:block sticky top-24">
            <TrackVisual
              ballControls={ballControls}
              simState={simState}
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
   TRACK VISUAL SUB-COMPONENT
   ═══════════════════════════════════════════════════════════ */
type TrackVisualProps = {
  ballControls: ReturnType<typeof useAnimation>;
  simState: SimState;
  failInfo: { toggle: Toggle; checkpoint: Checkpoint } | null;
  zoneActive: (zone: string) => boolean;
  glowZone: string | null;
  showConfetti: boolean;
  onRetry: () => void;
};

function TrackVisual({
  ballControls,
  simState,
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
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: "hsl(var(--dark-card))",
        border: "1px solid hsl(var(--muted-foreground) / 0.06)",
      }}
    >
      {showConfetti && <Confetti />}

      <div className="relative aspect-[4/5] sm:aspect-[3/4] p-4 sm:p-6">
        {/* Track image */}
        <img
          src={pistaImg}
          alt="Pista de revenue"
          className="w-full h-full object-contain transition-opacity duration-700"
          style={{ opacity: isIdle ? 0.3 : 0.65 }}
          loading="lazy"
        />

        {/* Zone glows */}
        {HOTSPOTS.map((hp) => {
          const active = zoneActive(hp.zone);
          const color = ZONE_COLORS[hp.zone];
          const isGlowing = glowZone === hp.zone;

          return (
            <div key={hp.zone}>
              {/* Glow effect when toggled */}
              <AnimatePresence>
                {isGlowing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 0.25, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8 }}
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      left: `${hp.x - 8}%`,
                      top: `${hp.y - 8}%`,
                      width: "16%",
                      height: "16%",
                      background: `radial-gradient(circle, hsl(${color} / 0.4) 0%, transparent 70%)`,
                      filter: "blur(20px)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Hotspot label */}
              <div
                className="absolute flex items-center gap-1.5 transition-all duration-500"
                style={{
                  left: `${hp.x}%`,
                  top: `${hp.y}%`,
                  opacity: isIdle ? 0.25 : 1,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-400"
                  style={{
                    background: active ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.25)",
                    boxShadow: active ? `0 0 10px hsl(${color} / 0.5)` : "none",
                  }}
                />
                <span
                  className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-colors duration-400"
                  style={{
                    color: active ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.35)",
                  }}
                >
                  {hp.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Ball */}
        {!isIdle && (
          <motion.div
            className="absolute z-20 will-change-transform"
            animate={ballControls}
            initial={{
              left: `${START_POS.x}%`,
              top: `${START_POS.y}%`,
            }}
            style={{ marginLeft: -14, marginTop: -14 }}
          >
            {/* Outer glow */}
            <div
              className="absolute inset-[-10px] rounded-full transition-all duration-600"
              style={{
                background: isSuccess
                  ? "hsl(var(--teal) / 0.18)"
                  : isFailed
                  ? "hsl(var(--pink) / 0.15)"
                  : "hsl(var(--pink) / 0.1)",
                filter: "blur(12px)",
              }}
            />

            {/* Core */}
            <motion.div
              className="relative w-7 h-7 rounded-full"
              animate={
                isSuccess
                  ? { scale: [1, 1.3, 1] }
                  : isFailed
                  ? {} // failure animations handled by ballControls
                  : {}
              }
              transition={isSuccess ? { duration: 0.5, repeat: 2 } : {}}
              style={{
                background: isSuccess
                  ? "hsl(var(--teal))"
                  : "hsl(var(--pink))",
                boxShadow: isSuccess
                  ? "0 0 24px hsl(var(--teal) / 0.6), 0 0 48px hsl(var(--teal) / 0.2)"
                  : "0 0 18px hsl(var(--pink) / 0.5)",
              }}
            />

            {/* Pulse ring */}
            {isFailed && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid hsl(var(--pink) / 0.35)" }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </motion.div>
        )}

        {/* Idle overlay */}
        {isIdle && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/40 font-medium tracking-wide uppercase text-center px-4">
              Configura los toggles y presiona "Iniciar flujo"
            </p>
          </div>
        )}

        {/* ─── Failure tooltip ─── */}
        <AnimatePresence>
          {isFailed && failInfo && (
            <motion.div
              key="fail-tooltip"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute z-30 rounded-xl px-4 py-3.5 backdrop-blur-md max-w-[280px]"
              style={{
                left: `${failInfo.checkpoint.x > 50 ? failInfo.checkpoint.x - 30 : failInfo.checkpoint.x + 5}%`,
                top: `${failInfo.checkpoint.y + 8}%`,
                background: "hsl(var(--dark-bg) / 0.92)",
                border: "1px solid hsl(var(--pink) / 0.25)",
                boxShadow: "0 8px 32px hsl(var(--pink) / 0.08)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle size={13} style={{ color: "hsl(var(--pink))" }} />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "hsl(var(--pink))" }}>
                  Fricción detectada
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {failInfo.toggle.failMessage}
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground/70 italic">
                Activa "{failInfo.toggle.label}" y reintenta.
              </p>
              <button
                onClick={onRetry}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:brightness-110"
                style={{ color: "hsl(var(--pink))" }}
              >
                <RotateCcw size={11} /> Reintentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Success overlay ─── */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              key="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 rounded-lg px-4 py-3 backdrop-blur-sm z-30"
              style={{
                background: "hsl(var(--dark-bg) / 0.85)",
                border: "1px solid hsl(var(--teal) / 0.25)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "hsl(var(--teal))" }}>
                ✓ Revenue fluye sin fricción. El sistema funciona.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
