import { useEffect, useRef, useState, useCallback } from "react";

/**
 * RevenueTrack — animated SVG track with a ball that traverses a modular path.
 * Three phases loop: broken → rebuild → complete run.
 */

/* ─── geometry helpers ─── */
const TRACK_SEGMENTS = [
  // Each segment: { d (SVG path), broken (initially disconnected?), label coords }
  // A serpentine path built from curves
  { id: "s1", d: "M 60 30 Q 60 30 120 30 Q 180 30 180 70", broken: false },
  { id: "s2", d: "M 180 70 Q 180 110 120 110 Q 60 110 60 150", broken: true },
  { id: "s3", d: "M 60 150 Q 60 190 120 190 Q 180 190 180 230", broken: false },
  { id: "s4", d: "M 180 230 Q 180 270 120 270 Q 60 270 60 310", broken: true },
  { id: "s5", d: "M 60 310 Q 60 350 120 350 Q 180 350 180 390", broken: false },
];

const FULL_PATH = "M 60 30 Q 120 30 120 30 Q 180 30 180 70 Q 180 110 120 110 Q 60 110 60 150 Q 60 190 120 190 Q 180 190 180 230 Q 180 270 120 270 Q 60 270 60 310 Q 60 350 120 350 Q 180 350 180 390";

const MOBILE_SCALE = 0.75;

type Phase = "broken" | "rebuild" | "complete";

const PHASE_DURATIONS: Record<Phase, number> = {
  broken: 2000,
  rebuild: 1500,
  complete: 3000,
};

const RevenueTrack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("broken");
  const [paused, setPaused] = useState(false);
  const [ballProgress, setBallProgress] = useState(0);
  const [connectedSegments, setConnectedSegments] = useState<Set<string>>(new Set());
  const [connectingSegment, setConnectingSegment] = useState<string | null>(null);
  const [showEndLabel, setShowEndLabel] = useState(false);
  const [showBrokenLabel, setShowBrokenLabel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animFrame = useRef<number>(0);
  const phaseStart = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const brokenIds = TRACK_SEGMENTS.filter((s) => s.broken).map((s) => s.id);

  const runLoop = useCallback(() => {
    let currentPhase: Phase = "broken";
    let start = performance.now();
    let rebuildIndex = 0;
    let rebuildTimer = 0;

    const reset = () => {
      currentPhase = "broken";
      start = performance.now();
      rebuildIndex = 0;
      rebuildTimer = 0;
      setPhase("broken");
      setBallProgress(0);
      setConnectedSegments(new Set());
      setConnectingSegment(null);
      setShowEndLabel(false);
      setShowBrokenLabel(false);
    };

    const tick = (now: number) => {
      if (pausedRef.current) {
        start = now - (phaseStart.current || 0);
        animFrame.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      phaseStart.current = elapsed;
      const dur = PHASE_DURATIONS[currentPhase];

      if (currentPhase === "broken") {
        // Ball moves to ~35% then stops
        const t = Math.min(elapsed / dur, 1);
        const ballT = Math.min(t * 0.35, 0.35);
        setBallProgress(ballT);
        setShowBrokenLabel(t > 0.4);

        if (elapsed >= dur) {
          currentPhase = "rebuild";
          start = now;
          rebuildIndex = 0;
          rebuildTimer = 0;
          setPhase("rebuild");
          setShowBrokenLabel(false);
        }
      } else if (currentPhase === "rebuild") {
        const t = Math.min(elapsed / dur, 1);
        const segmentInterval = dur / brokenIds.length;

        // Connect segments one by one
        const shouldConnect = Math.floor(elapsed / segmentInterval);
        if (shouldConnect > rebuildIndex && rebuildIndex < brokenIds.length) {
          rebuildIndex = shouldConnect;
          setConnectedSegments((prev) => {
            const next = new Set(prev);
            for (let i = 0; i < Math.min(rebuildIndex, brokenIds.length); i++) {
              next.add(brokenIds[i]);
            }
            return next;
          });
          setConnectingSegment(brokenIds[Math.min(rebuildIndex - 1, brokenIds.length - 1)]);
          setTimeout(() => setConnectingSegment(null), 300);
        }

        if (elapsed >= dur) {
          currentPhase = "complete";
          start = now;
          setPhase("complete");
          setConnectedSegments(new Set(brokenIds));
        }
      } else if (currentPhase === "complete") {
        const t = Math.min(elapsed / dur, 1);
        // Ease-in-out for smooth traversal
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setBallProgress(eased);
        setShowEndLabel(t > 0.85);

        if (elapsed >= dur) {
          // Fade out and restart
          setTimeout(reset, 800);
          animFrame.current = requestAnimationFrame(tick);
          return;
        }
      }

      animFrame.current = requestAnimationFrame(tick);
    };

    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  useEffect(() => {
    const cleanup = runLoop();
    return cleanup;
  }, [runLoop]);

  // Get point on SVG path at progress t
  const getPointOnPath = (t: number): { x: number; y: number } => {
    // Create a temporary path to measure
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", FULL_PATH);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(t * len);
    document.body.removeChild(svg);
    return { x: pt.x, y: pt.y };
  };

  const [ballPos, setBallPos] = useState({ x: 60, y: 30 });

  useEffect(() => {
    try {
      const pos = getPointOnPath(ballProgress);
      setBallPos(pos);
    } catch {}
  }, [ballProgress]);

  // Trail positions
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    setTrail((prev) => {
      const next = [...prev, ballPos];
      return next.slice(-12);
    });
  }, [ballPos]);

  const scale = isMobile ? MOBILE_SCALE : 1;
  const svgW = 240 * scale;
  const svgH = 420 * scale;

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ minHeight: isMobile ? 320 : 420 }}
    >
      <svg
        viewBox={`0 0 240 420`}
        width={svgW}
        height={svgH}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="track-grad" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BE1869" />
            <stop offset="50%" stopColor="#6224BE" />
            <stop offset="100%" stopColor="#1CA398" />
          </linearGradient>
          <linearGradient id="track-connected" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1CA398" />
            <stop offset="100%" stopColor="#0779D7" />
          </linearGradient>
          <radialGradient id="ball-grad">
            <stop offset="0%" stopColor="#F7BE1A" />
            <stop offset="100%" stopColor="#BE1869" />
          </radialGradient>
          <filter id="glow-track">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-ball">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="flash">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track segments */}
        {TRACK_SEGMENTS.map((seg) => {
          const isBroken = seg.broken;
          const isConnected = connectedSegments.has(seg.id);
          const isConnecting = connectingSegment === seg.id;
          const isVisible = !isBroken || phase !== "broken" || true;

          let stroke = "url(#track-grad)";
          let opacity = 1;
          let filterAttr: string | undefined;

          if (isBroken && phase === "broken" && !isConnected) {
            opacity = 0.3;
            stroke = "#BE1869";
          }
          if (isConnected || !isBroken) {
            stroke = phase === "complete" ? "url(#track-connected)" : "url(#track-grad)";
            opacity = 1;
            filterAttr = "url(#glow-track)";
          }
          if (isConnecting) {
            filterAttr = "url(#flash)";
          }

          // Offset broken segments slightly
          const translateY = isBroken && !isConnected && phase === "broken" ? 8 : 0;

          return (
            <g key={seg.id}>
              <path
                d={seg.d}
                fill="none"
                stroke={stroke}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={opacity}
                filter={filterAttr}
                style={{
                  transition: "all 0.4s ease",
                  transform: `translateY(${translateY}px)`,
                }}
              />
              {/* Inner track fill */}
              <path
                d={seg.d}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={18}
                strokeLinecap="round"
                style={{
                  transition: "all 0.4s ease",
                  transform: `translateY(${translateY}px)`,
                }}
              />
            </g>
          );
        })}

        {/* Trail */}
        {phase === "complete" &&
          trail.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={2 + (i / trail.length) * 3}
              fill="#F7BE1A"
              opacity={0.1 + (i / trail.length) * 0.4}
            />
          ))}

        {/* Ball */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={7}
          fill="url(#ball-grad)"
          filter="url(#glow-ball)"
          style={{ transition: "cx 0.06s linear, cy 0.06s linear" }}
        />

        {/* Broken label */}
        {showBrokenLabel && phase === "broken" && (
          <g style={{ animation: "fadeInLabel 0.4s ease forwards" }}>
            <text
              x={120}
              y={140}
              textAnchor="middle"
              fill="#BE1869"
              fontSize="11"
              fontFamily="Lexend"
              fontWeight="500"
              opacity={0.9}
            >
              Leads que se pierden
            </text>
          </g>
        )}

        {/* End label */}
        {showEndLabel && phase === "complete" && (
          <g style={{ animation: "fadeInLabel 0.4s ease forwards" }}>
            {/* Star burst */}
            <circle cx={180} cy={390} r={12} fill="#1CA398" opacity={0.3} filter="url(#flash)" />
            <text
              x={120}
              y={415}
              textAnchor="middle"
              fill="#1CA398"
              fontSize="12"
              fontFamily="Lexend"
              fontWeight="600"
            >
              Revenue predecible ✓
            </text>
          </g>
        )}
      </svg>

      <style>{`
        @keyframes fadeInLabel {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RevenueTrack;
