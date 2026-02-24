import { useEffect, useRef, useState, useCallback } from "react";

/**
 * IsometricTrack — 2D flat top-down serpentine track with animated marble.
 * Three phases loop: gap → connect → complete run.
 */

/* ─── Track path segments (4 curves forming an S-shape) ─── */
const SEG1 = "M 190 40 Q 310 40 310 120";
const SEG2 = "M 310 128 Q 310 210 190 210";
const SEG3 = "M 190 218 Q 70 218 70 300";
const SEG4 = "M 70 308 Q 70 390 190 390";
const FULL_PATH = "M 190 40 Q 310 40 310 120 Q 310 210 190 210 Q 70 210 70 300 Q 70 390 190 390";

const COLORS = ["#BE1869", "#6224BE", "#0779D7", "#1CA398"];

// Connector positions (between segments)
const CONNECTORS = [
  { x: 310, y: 124 },
  { x: 190, y: 214 },
  { x: 70, y: 304 },
];

// The broken segment index (segment 2 is missing)
const BROKEN_SEG = 1;

type Phase = "gap" | "connect" | "complete";

const PHASE_DUR: Record<Phase, number> = {
  gap: 2000,
  connect: 1000,
  complete: 3000,
};

// Ease in-out quad
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const IsometricTrack = () => {
  const [phase, setPhase] = useState<Phase>("gap");
  const [ballT, setBallT] = useState(0);
  const [seg2Visible, setSeg2Visible] = useState(false);
  const [seg2Scale, setSeg2Scale] = useState(0);
  const [flash, setFlash] = useState(false);
  const [showLost, setShowLost] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pausedRef = useRef(false);
  const animRef = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [ballPos, setBallPos] = useState({ x: 190, y: 40 });
  const [trail, setTrail] = useState<{ x: number; y: number; o: number }[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Get point on full path at t [0,1]
  const getPoint = useCallback((t: number) => {
    if (!pathRef.current) return { x: 190, y: 40 };
    const len = pathRef.current.getTotalLength();
    const pt = pathRef.current.getPointAtLength(t * len);
    return { x: pt.x, y: pt.y };
  }, []);

  // Update ball position from ballT
  useEffect(() => {
    const pos = getPoint(ballT);
    setBallPos(pos);
    if (phase === "complete" && ballT > 0.02) {
      setTrail((prev) => [...prev, { ...pos, o: 1 }].slice(-14));
    }
  }, [ballT, getPoint, phase]);

  // Animation loop
  const runLoop = useCallback(() => {
    let cur: Phase = "gap";
    let start = performance.now();
    let lastTime = start;

    const reset = () => {
      cur = "gap";
      start = performance.now();
      setPhase("gap");
      setBallT(0);
      setSeg2Visible(false);
      setSeg2Scale(0);
      setFlash(false);
      setShowLost(false);
      setShowEnd(false);
      setTrail([]);
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
        // Ball moves to ~22% (end of seg1 area) then bounces
        const stopT = 0.22;
        if (t < 0.6) {
          setBallT(easeInOut(t / 0.6) * stopT);
        } else {
          // Small bounce
          const bt = (t - 0.6) / 0.4;
          const bounce = Math.sin(bt * Math.PI) * 0.015;
          setBallT(stopT - bounce);
        }
        setShowLost(t > 0.55 && t < 0.92);

        if (elapsed >= dur) {
          cur = "connect";
          start = now;
          setPhase("connect");
          setShowLost(false);
          setBallT(0.22);
        }
      } else if (cur === "connect") {
        const t = Math.min(elapsed / dur, 1);
        // Spring-like scale for segment appearing
        setSeg2Visible(true);
        const spring = t < 0.7
          ? easeInOut(t / 0.7) * 1.08
          : 1.08 - 0.08 * easeInOut((t - 0.7) / 0.3);
        setSeg2Scale(Math.min(spring, 1.08));
        setFlash(t > 0.4 && t < 0.7);

        if (elapsed >= dur) {
          cur = "complete";
          start = now;
          setPhase("complete");
          setSeg2Scale(1);
          setFlash(false);
          setBallT(0);
          setTrail([]);
        }
      } else if (cur === "complete") {
        const t = Math.min(elapsed / dur, 1);
        setBallT(easeInOut(t));
        setShowEnd(t > 0.88);

        if (elapsed >= dur) {
          setTimeout(reset, 500);
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

  const w = isMobile ? 320 : 380;
  const h = isMobile ? 400 : 500;

  const segments = [SEG1, SEG2, SEG3, SEG4];

  // Lost label position (near end of seg1)
  const lostPos = getPoint(0.24);
  // End label position
  const endPos = { x: 190, y: 390 };

  return (
    <div
      className="relative flex items-center justify-center will-change-transform"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      style={{ width: w, height: h }}
    >
      <svg viewBox="0 0 380 440" width={w} height={h} className="overflow-visible">
        <defs>
          {/* Hidden full path for measuring */}
          <path id="full-track-path" d={FULL_PATH} />

          {/* Segment glow filters */}
          {COLORS.map((c, i) => (
            <filter key={i} id={`seg-glow-${i}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={c} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Ball glow */}
          <filter id="ball-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#F7BE1A" floodOpacity="0.7" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* White flash */}
          <filter id="white-flash" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connector glow */}
          <filter id="conn-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for ball */}
          <radialGradient id="ball-fill">
            <stop offset="0%" stopColor="#FFF4C2" />
            <stop offset="50%" stopColor="#F7BE1A" />
            <stop offset="100%" stopColor="#D4960E" />
          </radialGradient>

          {/* Pulse animation for broken gap */}
          <radialGradient id="pulse-grad">
            <stop offset="0%" stopColor="#BE1869" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BE1869" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ═══ Track background (subtle fill) ═══ */}
        {segments.map((d, i) => {
          const isHidden = i === BROKEN_SEG && !seg2Visible && phase === "gap";
          return (
            <path
              key={`bg-${i}`}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={24}
              strokeLinecap="round"
              opacity={isHidden ? 0.3 : 1}
            />
          );
        })}

        {/* ═══ Track segments ═══ */}
        {segments.map((d, i) => {
          const isbroken = i === BROKEN_SEG;
          const hidden = isbroken && !seg2Visible;

          if (hidden && phase === "gap") {
            // Show dashed outline for gap
            return (
              <g key={`seg-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="#BE1869"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  opacity={0.4}
                >
                  <animate
                    attributeName="opacity"
                    values="0.2;0.6;0.2"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          }

          return (
            <g key={`seg-${i}`}>
              {/* Glow layer */}
              <path
                d={d}
                fill="none"
                stroke={COLORS[i]}
                strokeWidth={20}
                strokeLinecap="round"
                opacity={0.15}
                filter={`url(#seg-glow-${i})`}
                style={isbroken ? {
                  transform: `scale(${seg2Scale})`,
                  transformOrigin: "250px 210px",
                  transition: "transform 0.3s ease-out",
                } : undefined}
              />
              {/* Main track stroke */}
              <path
                d={d}
                fill="none"
                stroke={COLORS[i]}
                strokeWidth={20}
                strokeLinecap="round"
                opacity={0.85}
                style={isbroken ? {
                  transform: `scale(${seg2Scale})`,
                  transformOrigin: "250px 210px",
                  transition: "transform 0.3s ease-out",
                } : undefined}
              />
              {/* White inner line (depth) */}
              <path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={2}
                strokeLinecap="round"
                style={isbroken ? {
                  transform: `scale(${seg2Scale})`,
                  transformOrigin: "250px 210px",
                  transition: "transform 0.3s ease-out",
                } : undefined}
              />
            </g>
          );
        })}

        {/* ═══ Connectors ═══ */}
        {CONNECTORS.map((c, i) => {
          const isFlashing = flash && (i === 0 || i === 1);
          return (
            <g key={`conn-${i}`}>
              <circle
                cx={c.x}
                cy={c.y}
                r={5}
                fill={isFlashing ? "#1CA398" : "white"}
                filter={isFlashing ? "url(#white-flash)" : "url(#conn-glow)"}
                opacity={isFlashing ? 1 : 0.9}
              />
            </g>
          );
        })}

        {/* ═══ Flash effect on connection ═══ */}
        {flash && (
          <>
            <circle cx={CONNECTORS[0].x} cy={CONNECTORS[0].y} r={20} fill="white" opacity={0.4} filter="url(#white-flash)" />
            <circle cx={CONNECTORS[1].x} cy={CONNECTORS[1].y} r={20} fill="white" opacity={0.4} filter="url(#white-flash)" />
          </>
        )}

        {/* ═══ Finish circle (meta) ═══ */}
        <circle
          cx={190}
          cy={390}
          r={showEnd ? 18 : 14}
          fill="none"
          stroke="#1CA398"
          strokeWidth={3}
          opacity={showEnd ? 1 : 0.5}
          filter={showEnd ? "url(#conn-glow)" : undefined}
          style={{ transition: "all 0.4s ease" }}
        />
        <circle
          cx={190}
          cy={390}
          r={6}
          fill="#1CA398"
          opacity={showEnd ? 0.9 : 0.3}
          style={{ transition: "all 0.4s ease" }}
        />

        {/* ═══ Hidden path for measurement ═══ */}
        <path
          ref={pathRef}
          d={FULL_PATH}
          fill="none"
          stroke="none"
        />

        {/* ═══ Ball trail ═══ */}
        {phase === "complete" && trail.map((pt, i) => {
          const opacity = (i / trail.length) * 0.5;
          const r = 2 + (i / trail.length) * 4;
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={r}
              fill="#F7BE1A"
              opacity={opacity}
            />
          );
        })}

        {/* ═══ Ball ═══ */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={7}
          fill="url(#ball-fill)"
          filter="url(#ball-glow)"
          style={{ transition: "cx 0.03s linear, cy 0.03s linear" }}
        />

        {/* ═══ "Lead perdido" label ═══ */}
        {showLost && (
          <g opacity={1}>
            <rect
              x={lostPos.x + 16}
              y={lostPos.y - 14}
              width={90}
              height={22}
              rx={11}
              fill="rgba(190,24,105,0.15)"
              stroke="#BE1869"
              strokeWidth={0.5}
            />
            <text
              x={lostPos.x + 61}
              y={lostPos.y + 1}
              textAnchor="middle"
              fill="#BE1869"
              fontSize="10"
              fontFamily="Lexend, sans-serif"
              fontWeight="500"
            >
              Lead perdido
            </text>
          </g>
        )}

        {/* ═══ "Revenue ✓" label ═══ */}
        {showEnd && (
          <g>
            <rect
              x={endPos.x - 48}
              y={endPos.y + 24}
              width={96}
              height={24}
              rx={12}
              fill="rgba(28,163,152,0.15)"
              stroke="#1CA398"
              strokeWidth={0.5}
            />
            <text
              x={endPos.x}
              y={endPos.y + 40}
              textAnchor="middle"
              fill="#1CA398"
              fontSize="11"
              fontFamily="Lexend, sans-serif"
              fontWeight="600"
            >
              Revenue ✓
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default IsometricTrack;
