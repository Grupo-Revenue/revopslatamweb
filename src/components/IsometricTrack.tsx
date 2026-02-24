import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import trackImage from "@/assets/track-illustration.png";

/**
 * IsometricTrack — Uses the static track illustration as base,
 * with animated marble, glows, and floating labels on top.
 */

type Phase = "gap" | "connect" | "complete";

const PHASE_DUR: Record<Phase, number> = {
  gap: 2500,
  connect: 1200,
  complete: 3500,
};

// Path the ball follows over the image (pixel coords in 380x480 viewBox)
// Traces the spiral and arrows visible in the illustration
const BALL_PATH = [
  { x: 220, y: 80 },   // top area near spiral start
  { x: 260, y: 110 },
  { x: 280, y: 150 },
  { x: 270, y: 200 },  // spiral outer
  { x: 240, y: 230 },
  { x: 210, y: 220 },  // spiral inner
  { x: 220, y: 190 },
  { x: 250, y: 180 },  // spiral exit
  { x: 270, y: 210 },
  { x: 280, y: 260 },  // going down toward arrows
  { x: 260, y: 300 },  // near blue piece
  { x: 220, y: 340 },  // following arrows down
  { x: 250, y: 370 },
  { x: 280, y: 390 },
  { x: 300, y: 410 },  // end
];

// Gap is between indices 4-6 (inside spiral)
const GAP_STOP = 4;

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function lerp(
  pts: { x: number; y: number }[],
  t: number
): { x: number; y: number } {
  const n = pts.length - 1;
  const clamped = Math.max(0, Math.min(1, t));
  const idx = Math.min(Math.floor(clamped * n), n - 1);
  const frac = clamped * n - idx;
  return {
    x: pts[idx].x + (pts[idx + 1].x - pts[idx].x) * frac,
    y: pts[idx].y + (pts[idx + 1].y - pts[idx].y) * frac,
  };
}

const IsometricTrack = () => {
  const [phase, setPhase] = useState<Phase>("gap");
  const [ballT, setBallT] = useState(0);
  const [showLost, setShowLost] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [gapPulse, setGapPulse] = useState(true);
  const [flashConnect, setFlashConnect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pausedRef = useRef(false);
  const animRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Animation loop
  const runLoop = useCallback(() => {
    let cur: Phase = "gap";
    let start = performance.now();
    let lastTime = start;

    const reset = () => {
      cur = "gap";
      start = performance.now();
      lastTime = start;
      setPhase("gap");
      setBallT(0);
      setShowLost(false);
      setShowEnd(false);
      setGapPulse(true);
      setFlashConnect(false);
    };

    const tick = (now: number) => {
      if (pausedRef.current) {
        start += now - lastTime;
        lastTime = now;
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = now;
      const elapsed = now - start;
      const dur = PHASE_DUR[cur];

      if (cur === "gap") {
        const t = Math.min(elapsed / dur, 1);
        const stopNorm = GAP_STOP / (BALL_PATH.length - 1);
        if (t < 0.55) {
          setBallT(easeInOut(t / 0.55) * stopNorm);
        } else {
          const bt = (t - 0.55) / 0.45;
          const bounce = Math.sin(bt * Math.PI * 2) * 0.008;
          setBallT(stopNorm + bounce);
        }
        setShowLost(t > 0.5 && t < 0.9);

        if (elapsed >= dur) {
          cur = "connect";
          start = now;
          setPhase("connect");
          setShowLost(false);
          setGapPulse(false);
        }
      } else if (cur === "connect") {
        const t = Math.min(elapsed / dur, 1);
        setFlashConnect(t > 0.3 && t < 0.7);

        if (elapsed >= dur) {
          cur = "complete";
          start = now;
          setPhase("complete");
          setFlashConnect(false);
          setBallT(0);
        }
      } else if (cur === "complete") {
        const t = Math.min(elapsed / dur, 1);
        setBallT(easeInOut(t));
        setShowEnd(t > 0.85);

        if (elapsed >= dur) {
          setTimeout(reset, 600);
          return;
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const cleanup = runLoop();
    return cleanup;
  }, [runLoop]);

  const ballPos = lerp(BALL_PATH, ballT);
  // Fully fluid — container controls the size
  const scale = 1;

  // Trail points
  const trailCount = 10;
  const trailPoints = phase === "complete"
    ? Array.from({ length: trailCount }, (_, i) => {
        const offset = (i + 1) * 0.015;
        const tt = Math.max(0, ballT - offset);
        return { ...lerp(BALL_PATH, tt), o: (i + 1) / trailCount };
      }).reverse()
    : [];

  // Gap glow position (between points 4-6)
  const gapCenter = lerp(BALL_PATH, 5 / (BALL_PATH.length - 1));

  return (
    <div
      className="relative w-full will-change-transform"
      style={{ aspectRatio: "380 / 480" }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Base illustration */}
      <img
        src={trackImage}
        alt="Revenue track illustration"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        loading="lazy"
        draggable={false}
      />

      {/* SVG overlay for animations */}
      <svg
        viewBox="0 0 380 480"
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          <filter id="ball-glow-f" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#F7BE1A" floodOpacity="0.7" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="flash-f" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pulse-f" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor="#BE1869" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ball-grad-f">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="40%" stopColor="#F7BE1A" />
            <stop offset="100%" stopColor="#D4960E" />
          </radialGradient>
        </defs>

        {/* Gap pulse glow */}
        {gapPulse && phase === "gap" && (
          <circle
            cx={gapCenter.x}
            cy={gapCenter.y}
            r={25}
            fill="none"
            stroke="#BE1869"
            strokeWidth={2}
            opacity={0.6}
            filter="url(#pulse-f)"
          >
            <animate attributeName="r" values="18;30;18" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Connection flash */}
        {flashConnect && (
          <>
            <circle cx={gapCenter.x} cy={gapCenter.y} r={30} fill="white" opacity={0.5} filter="url(#flash-f)" />
            <circle cx={gapCenter.x} cy={gapCenter.y} r={12} fill="#1CA398" opacity={0.8} filter="url(#flash-f)" />
          </>
        )}

        {/* Ball trail */}
        {trailPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={2 + pt.o * 3}
            fill="#F7BE1A"
            opacity={pt.o * 0.45}
          />
        ))}

        {/* Ball */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={8}
          fill="url(#ball-grad-f)"
          filter="url(#ball-glow-f)"
        />
        {/* Ball highlight */}
        <circle
          cx={ballPos.x - 2}
          cy={ballPos.y - 2}
          r={3}
          fill="rgba(255,255,255,0.7)"
        />
      </svg>

      {/* Floating labels */}
      <AnimatePresence>
        {showLost && (
          <motion.div
            key="lost"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-none"
            style={{
              left: `${(ballPos.x / 380) * 100 + 6}%`,
              top: `${(ballPos.y / 480) * 100 - 3}%`,
            }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-medium"
              style={{
                background: "rgba(190,24,105,0.15)",
                color: "#BE1869",
                border: "1px solid rgba(190,24,105,0.3)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              Lead perdido
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEnd && (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300 }}
            className="absolute pointer-events-none"
            style={{
              left: `${(BALL_PATH[BALL_PATH.length - 1].x / 380) * 100 - 8}%`,
              top: `${(BALL_PATH[BALL_PATH.length - 1].y / 480) * 100 + 3}%`,
            }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{
                background: "rgba(28,163,152,0.15)",
                color: "#1CA398",
                border: "1px solid rgba(28,163,152,0.3)",
                fontFamily: "Lexend, sans-serif",
              }}
            >
              Revenue ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IsometricTrack;
