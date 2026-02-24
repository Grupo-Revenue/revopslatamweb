import { useEffect, useRef, useState, useCallback, useMemo } from "react";

/**
 * IsometricTrack — Marble-run style isometric track animation.
 * Three phases loop: broken → rebuild → complete run.
 *
 * All geometry is SVG with simulated isometric perspective.
 */

/* ─── Isometric helpers ─── */
const ISO_ANGLE = Math.PI / 6; // 30 degrees
const COS = Math.cos(ISO_ANGLE);
const SIN = Math.sin(ISO_ANGLE);

// Convert 3D to isometric 2D
const iso = (x: number, y: number, z: number): [number, number] => [
  240 + (x - y) * COS,
  160 + (x + y) * SIN - z,
];

/* ─── Track path definition (3D coords → isometric) ─── */
// The marble follows this path through the track
const TRACK_POINTS_3D = [
  // Start platform (top-left, high)
  { x: -80, y: -60, z: 180 },
  { x: -40, y: -60, z: 180 },
  // Ramp down to right
  { x: 0, y: -30, z: 150 },
  { x: 40, y: 0, z: 130 },
  // GAP SEGMENT 1 (index 4-5) — missing piece
  { x: 60, y: 20, z: 115 },
  { x: 80, y: 40, z: 100 },
  // Platform mid-right
  { x: 80, y: 60, z: 100 },
  // Spiral/loop center (the spectacular part)
  { x: 50, y: 80, z: 95 },
  { x: 20, y: 90, z: 90 },
  { x: 0, y: 80, z: 80 },
  { x: -10, y: 60, z: 70 },
  { x: 0, y: 40, z: 60 },
  { x: 20, y: 30, z: 55 },
  { x: 50, y: 40, z: 50 },
  // GAP SEGMENT 2 (index 14-15)
  { x: 70, y: 60, z: 45 },
  { x: 80, y: 80, z: 35 },
  // Final ramp down
  { x: 60, y: 100, z: 25 },
  { x: 30, y: 110, z: 15 },
  // Finish line
  { x: 0, y: 120, z: 10 },
  { x: -30, y: 130, z: 5 },
];

// Broken segment indices
const GAP1_START = 4;
const GAP1_END = 5;
const GAP2_START = 14;
const GAP2_END = 15;

type Phase = "broken" | "rebuild" | "complete";

const PHASE_DURATIONS: Record<Phase, number> = {
  broken: 3000,
  rebuild: 1500,
  complete: 4000,
};

/* ─── Interpolation along track points ─── */
function getIsoPoints(points: typeof TRACK_POINTS_3D) {
  return points.map((p) => {
    const [sx, sy] = iso(p.x, p.y, p.z);
    return { x: sx, y: sy };
  });
}

function lerp2D(
  pts: { x: number; y: number }[],
  t: number
): { x: number; y: number } {
  const n = pts.length - 1;
  const idx = Math.min(Math.floor(t * n), n - 1);
  const frac = t * n - idx;
  return {
    x: pts[idx].x + (pts[idx + 1].x - pts[idx].x) * frac,
    y: pts[idx].y + (pts[idx + 1].y - pts[idx].y) * frac,
  };
}

function buildPathD(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    // Use quadratic curves for smooth path
    if (i < pts.length - 1) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      const cy = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x} ${pts[i].y} ${cx} ${cy}`;
    } else {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
  }
  return d;
}

/* ─── Isometric platform shape ─── */
function IsoPlatform({
  x, y, z, w, h,
  fill = "rgba(13,13,26,0.9)",
  stroke = "rgba(255,255,255,0.25)",
  legHeight = 20,
}: {
  x: number; y: number; z: number;
  w: number; h: number;
  fill?: string; stroke?: string;
  legHeight?: number;
}) {
  // Top face corners
  const tl = iso(x, y, z);
  const tr = iso(x + w, y, z);
  const br = iso(x + w, y + h, z);
  const bl = iso(x, y + h, z);

  // Bottom of legs
  const blBottom = iso(x, y + h, z - legHeight);
  const brBottom = iso(x + w, y + h, z - legHeight);
  const trBottom = iso(x + w, y, z - legHeight);

  const topFace = `${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`;
  // Right side face
  const rightFace = `${tr[0]},${tr[1]} ${br[0]},${br[1]} ${brBottom[0]},${brBottom[1]} ${trBottom[0]},${trBottom[1]}`;
  // Front face
  const frontFace = `${bl[0]},${bl[1]} ${br[0]},${br[1]} ${brBottom[0]},${brBottom[1]} ${blBottom[0]},${blBottom[1]}`;

  return (
    <g>
      {/* Shadow */}
      <polygon
        points={topFace}
        fill="rgba(0,0,0,0.15)"
        style={{ transform: `translateY(${legHeight + 4}px)`, filter: "blur(6px)" }}
      />
      {/* Legs (front and right faces) */}
      <polygon points={frontFace} fill="rgba(255,255,255,0.03)" stroke={stroke} strokeWidth={0.5} />
      <polygon points={rightFace} fill="rgba(255,255,255,0.05)" stroke={stroke} strokeWidth={0.5} />
      {/* Top face */}
      <polygon points={topFace} fill={fill} stroke={stroke} strokeWidth={1} />
    </g>
  );
}

/* ─── Isometric gear ─── */
function IsoGear({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const teeth = 8;
  const innerR = r * 0.65;
  const outerR = r;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
    const cmd = i === 0 ? "M" : "L";
    d += `${cmd} ${cx + Math.cos(a1) * innerR} ${cy + Math.sin(a1) * innerR} `;
    d += `L ${cx + Math.cos(a2) * outerR} ${cy + Math.sin(a2) * outerR} `;
    d += `L ${cx + Math.cos(a3) * outerR} ${cy + Math.sin(a3) * outerR} `;
    d += `L ${cx + Math.cos(a4) * innerR} ${cy + Math.sin(a4) * innerR} `;
  }
  d += "Z";
  return (
    <g>
      <path d={d} fill={color} opacity={0.85} filter="url(#colorGlow)" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
    </g>
  );
}

/* ─── Spiral/Loop element ─── */
function SpiralLoop({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  // Draw a stylized spiral in isometric view
  const points: string[] = [];
  const turns = 1.5;
  const maxR = 35;
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2 - Math.PI / 2;
    const r = 8 + t * (maxR - 8);
    // Isometric squash
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r * 0.55;
    points.push(`${px},${py}`);
  }

  return (
    <g>
      {/* Filled spiral shape */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        opacity={0.85}
        filter="url(#colorGlow)"
      />
      {/* Inner white outline */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      {/* Outer white outline */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={14}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ─── Arrow indicator ─── */
function IsoArrow({ x, y, rotation = 0, color = "#F7BE1A" }: { x: number; y: number; rotation?: number; color?: string }) {
  return (
    <polygon
      points={`${x},${y - 5} ${x + 8},${y} ${x},${y + 5}`}
      fill={color}
      opacity={0.9}
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${x}px ${y}px` }}
    />
  );
}

/* ─── Checkered finish line ─── */
function FinishLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const squares = 6;
  const elements = [];
  for (let i = 0; i < squares; i++) {
    const t = i / squares;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    elements.push(
      <rect
        key={i}
        x={px - 3}
        y={py - 3}
        width={6}
        height={6}
        fill={i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"}
        rx={0.5}
      />
    );
  }
  return <g>{elements}</g>;
}

/* ─── Puzzle piece ─── */
function PuzzlePiece({ cx, cy, size, color, opacity = 0.85 }: { cx: number; cy: number; size: number; color: string; opacity?: number }) {
  const s = size;
  // Simple isometric puzzle piece shape
  const d = `M ${cx - s} ${cy} L ${cx} ${cy - s * 0.6} L ${cx + s} ${cy} L ${cx + s * 0.3} ${cy + s * 0.2} 
    Q ${cx + s * 0.5} ${cy + s * 0.5} ${cx + s * 0.3} ${cy + s * 0.6} 
    L ${cx} ${cy + s * 0.4} 
    L ${cx - s * 0.3} ${cy + s * 0.6}
    Q ${cx - s * 0.5} ${cy + s * 0.5} ${cx - s * 0.3} ${cy + s * 0.2} Z`;
  return (
    <g>
      <path d={d} fill={color} opacity={opacity} filter="url(#colorGlow)" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
    </g>
  );
}

/* ═══════════════════════════════════════════ */
/*                MAIN COMPONENT               */
/* ═══════════════════════════════════════════ */

const IsometricTrack = () => {
  const [phase, setPhase] = useState<Phase>("broken");
  const [ballProgress, setBallProgress] = useState(0);
  const [gap1Connected, setGap1Connected] = useState(false);
  const [gap2Connected, setGap2Connected] = useState(false);
  const [connectFlash1, setConnectFlash1] = useState(false);
  const [connectFlash2, setConnectFlash2] = useState(false);
  const [showLostLabel, setShowLostLabel] = useState(false);
  const [showEndLabel, setShowEndLabel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pausedRef = useRef(false);
  const animFrame = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isoPoints = useMemo(() => getIsoPoints(TRACK_POINTS_3D), []);

  // Build path segments
  const fullPathD = useMemo(() => buildPathD(isoPoints), [isoPoints]);
  const beforeGap1D = useMemo(() => buildPathD(isoPoints.slice(0, GAP1_START)), [isoPoints]);
  const gap1D = useMemo(() => buildPathD(isoPoints.slice(GAP1_START, GAP1_END + 1)), [isoPoints]);
  const midD = useMemo(() => buildPathD(isoPoints.slice(GAP1_END, GAP2_START)), [isoPoints]);
  const gap2D = useMemo(() => buildPathD(isoPoints.slice(GAP2_START, GAP2_END + 1)), [isoPoints]);
  const afterGap2D = useMemo(() => buildPathD(isoPoints.slice(GAP2_END)), [isoPoints]);

  // Ball position
  const ballPos = useMemo(() => lerp2D(isoPoints, ballProgress), [isoPoints, ballProgress]);

  // Trail
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (phase === "complete") {
      setTrail((prev) => [...prev, ballPos].slice(-16));
    } else {
      setTrail([]);
    }
  }, [ballPos, phase]);

  // Animation loop
  const runLoop = useCallback(() => {
    let currentPhase: Phase = "broken";
    let start = performance.now();

    const reset = () => {
      currentPhase = "broken";
      start = performance.now();
      setPhase("broken");
      setBallProgress(0);
      setGap1Connected(false);
      setGap2Connected(false);
      setConnectFlash1(false);
      setConnectFlash2(false);
      setShowLostLabel(false);
      setShowEndLabel(false);
      setTrail([]);
    };

    const tick = (now: number) => {
      if (pausedRef.current) {
        start = now - (start ? now - start : 0);
        animFrame.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const dur = PHASE_DURATIONS[currentPhase];

      if (currentPhase === "broken") {
        const t = Math.min(elapsed / dur, 1);
        // Ball moves to ~20% (before gap) then stops
        const stopPoint = (GAP1_START - 0.5) / (TRACK_POINTS_3D.length - 1);
        setBallProgress(Math.min(t * 1.2 * stopPoint, stopPoint));
        setShowLostLabel(t > 0.5 && t < 0.95);

        if (elapsed >= dur) {
          currentPhase = "rebuild";
          start = now;
          setPhase("rebuild");
          setShowLostLabel(false);
        }
      } else if (currentPhase === "rebuild") {
        const t = Math.min(elapsed / dur, 1);

        // Connect gap 1 at 30%
        if (t > 0.3 && !gap1Connected) {
          setGap1Connected(true);
          setConnectFlash1(true);
          setTimeout(() => setConnectFlash1(false), 400);
        }
        // Connect gap 2 at 70%
        if (t > 0.7 && !gap2Connected) {
          setGap2Connected(true);
          setConnectFlash2(true);
          setTimeout(() => setConnectFlash2(false), 400);
        }

        if (elapsed >= dur) {
          currentPhase = "complete";
          start = now;
          setPhase("complete");
          setBallProgress(0);
        }
      } else if (currentPhase === "complete") {
        const t = Math.min(elapsed / dur, 1);
        // Smooth ease for complete traversal
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setBallProgress(eased);
        setShowEndLabel(t > 0.88);

        if (elapsed >= dur) {
          setTimeout(reset, 500);
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

  // Decorative element positions (iso coords)
  const spiralCenter = useMemo(() => {
    const p = iso(20, 65, 85);
    return { cx: p[0], cy: p[1] };
  }, []);

  const gear1Pos = useMemo(() => iso(-60, -40, 185), []);
  const gear2Pos = useMemo(() => iso(70, 100, 40), []);
  const sphere1Pos = useMemo(() => iso(-70, 20, 130), []);
  const sphere2Pos = useMemo(() => iso(90, 10, 120), []);

  // Gap piece positions for flying-in animation
  const gap1Center = useMemo(() => {
    const p1 = isoPoints[GAP1_START];
    const p2 = isoPoints[GAP1_END];
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }, [isoPoints]);

  const gap2Center = useMemo(() => {
    const p1 = isoPoints[GAP2_START];
    const p2 = isoPoints[GAP2_END];
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }, [isoPoints]);

  const viewW = isMobile ? 320 : 480;
  const viewH = isMobile ? 380 : 560;

  // Arrow positions along the track
  const arrowPositions = useMemo(() => [
    lerp2D(isoPoints, 0.1),
    lerp2D(isoPoints, 0.35),
    lerp2D(isoPoints, 0.6),
    lerp2D(isoPoints, 0.85),
  ], [isoPoints]);

  return (
    <div
      className="relative flex items-center justify-center will-change-transform"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      style={{ width: viewW, height: viewH }}
    >
      <svg
        viewBox="0 0 480 560"
        width={viewW}
        height={viewH}
        className="overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="iso-ball-grad">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e0e0e0" />
            <stop offset="100%" stopColor="#aaaaaa" />
          </radialGradient>
          <radialGradient id="iso-ball-glow">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="track-line-grad" x1="0" y1="0" x2="0" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          <linearGradient id="connected-grad" x1="0" y1="0" x2="0" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1CA398" />
            <stop offset="100%" stopColor="#0779D7" />
          </linearGradient>

          {/* Filters */}
          <filter id="ballGlowF" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="colorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="flashFilter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadowF" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* ═══ PLATFORMS ═══ */}
        {/* Top platform */}
        <IsoPlatform x={-90} y={-70} z={185} w={50} h={30} legHeight={18} />
        {/* Mid-right platform */}
        <IsoPlatform x={60} y={35} z={105} w={45} h={35} legHeight={15} />
        {/* Lower platform */}
        <IsoPlatform x={40} y={90} z={40} w={50} h={30} legHeight={12} />
        {/* Finish platform */}
        <IsoPlatform x={-50} y={110} z={12} w={50} h={30} legHeight={10} />

        {/* ═══ DECORATIVE ELEMENTS ═══ */}
        {/* Spiral loop - the showpiece */}
        <SpiralLoop cx={spiralCenter.cx} cy={spiralCenter.cy} color="#BE1869" />

        {/* Gears */}
        <IsoGear cx={gear1Pos[0]} cy={gear1Pos[1]} r={18} color="#BE1869" />
        <IsoGear cx={gear2Pos[0]} cy={gear2Pos[1]} r={14} color="#BE1869" />

        {/* Teal spheres */}
        <circle cx={sphere1Pos[0]} cy={sphere1Pos[1]} r={10} fill="#1CA398" opacity={0.7} filter="url(#colorGlow)" />
        <circle cx={sphere1Pos[0] - 1} cy={sphere1Pos[1] - 2} r={3} fill="rgba(255,255,255,0.4)" />
        <circle cx={sphere2Pos[0]} cy={sphere2Pos[1]} r={7} fill="#1CA398" opacity={0.6} filter="url(#colorGlow)" />
        <circle cx={sphere2Pos[0] - 1} cy={sphere2Pos[1] - 1} r={2} fill="rgba(255,255,255,0.3)" />

        {/* Blue puzzle pieces */}
        <PuzzlePiece cx={gear1Pos[0] + 60} cy={gear1Pos[1] + 10} size={16} color="#0779D7" />
        <PuzzlePiece cx={gear2Pos[0] - 50} cy={gear2Pos[1] - 20} size={12} color="#0779D7" />

        {/* Yellow arrows */}
        {arrowPositions.map((a, i) => (
          <IsoArrow key={i} x={a.x + 15} y={a.y - 8} rotation={30 + i * 15} />
        ))}

        {/* ═══ TRACK SEGMENTS ═══ */}
        {/* Solid segments (always visible) */}
        <path d={beforeGap1D} fill="none" stroke="url(#track-line-grad)" strokeWidth={3} strokeLinecap="round" />
        <path d={midD} fill="none" stroke="url(#track-line-grad)" strokeWidth={3} strokeLinecap="round" />
        <path d={afterGap2D} fill="none" stroke="url(#track-line-grad)" strokeWidth={3} strokeLinecap="round" />

        {/* Track inner glow */}
        <path d={beforeGap1D} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={16} strokeLinecap="round" />
        <path d={midD} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={16} strokeLinecap="round" />
        <path d={afterGap2D} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={16} strokeLinecap="round" />

        {/* Gap segments */}
        <path
          d={gap1D}
          fill="none"
          stroke={gap1Connected ? (connectFlash1 ? "#1CA398" : "url(#track-line-grad)") : "#BE1869"}
          strokeWidth={gap1Connected ? 3 : 2}
          strokeLinecap="round"
          strokeDasharray={gap1Connected ? "none" : "4 6"}
          opacity={gap1Connected ? 1 : 0.4}
          filter={connectFlash1 ? "url(#flashFilter)" : undefined}
          style={{
            transition: "all 0.4s ease",
            transform: !gap1Connected && phase === "broken" ? "translateY(6px)" : "translateY(0)",
          }}
        >
          {/* Pulsing animation for broken gaps */}
          {!gap1Connected && phase === "broken" && (
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
          )}
        </path>
        <path
          d={gap2D}
          fill="none"
          stroke={gap2Connected ? (connectFlash2 ? "#1CA398" : "url(#track-line-grad)") : "#BE1869"}
          strokeWidth={gap2Connected ? 3 : 2}
          strokeLinecap="round"
          strokeDasharray={gap2Connected ? "none" : "4 6"}
          opacity={gap2Connected ? 1 : 0.4}
          filter={connectFlash2 ? "url(#flashFilter)" : undefined}
          style={{
            transition: "all 0.4s ease",
            transform: !gap2Connected && phase === "broken" ? "translateY(6px)" : "translateY(0)",
          }}
        >
          {!gap2Connected && phase === "broken" && (
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
          )}
        </path>

        {/* ═══ FINISH LINE ═══ */}
        {(() => {
          const fl1 = isoPoints[isoPoints.length - 2];
          const fl2 = isoPoints[isoPoints.length - 1];
          return <FinishLine x1={fl1.x} y1={fl1.y - 5} x2={fl2.x} y2={fl2.y - 5} />;
        })()}

        {/* ═══ FLYING PIECES (rebuild phase) ═══ */}
        {phase === "rebuild" && !gap1Connected && (
          <PuzzlePiece
            cx={gap1Center.x + 80}
            cy={gap1Center.y - 60}
            size={14}
            color="#1CA398"
            opacity={0.7}
          />
        )}
        {phase === "rebuild" && !gap2Connected && (
          <PuzzlePiece
            cx={gap2Center.x - 70}
            cy={gap2Center.y + 50}
            size={14}
            color="#1CA398"
            opacity={0.7}
          />
        )}

        {/* ═══ CONNECT FLASH ═══ */}
        {connectFlash1 && (
          <circle
            cx={gap1Center.x}
            cy={gap1Center.y}
            r={20}
            fill="white"
            opacity={0.6}
            filter="url(#flashFilter)"
          >
            <animate attributeName="opacity" from="0.6" to="0" dur="0.4s" fill="freeze" />
            <animate attributeName="r" from="10" to="30" dur="0.4s" fill="freeze" />
          </circle>
        )}
        {connectFlash2 && (
          <circle
            cx={gap2Center.x}
            cy={gap2Center.y}
            r={20}
            fill="white"
            opacity={0.6}
            filter="url(#flashFilter)"
          >
            <animate attributeName="opacity" from="0.6" to="0" dur="0.4s" fill="freeze" />
            <animate attributeName="r" from="10" to="30" dur="0.4s" fill="freeze" />
          </circle>
        )}

        {/* ═══ BALL TRAIL ═══ */}
        {phase === "complete" &&
          trail.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={1.5 + (i / trail.length) * 3}
              fill="#F7BE1A"
              opacity={0.08 + (i / trail.length) * 0.35}
            />
          ))}

        {/* ═══ MARBLE (BALL) ═══ */}
        {/* Ball glow */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={18}
          fill="url(#iso-ball-glow)"
          opacity={0.5}
        />
        {/* Ball shadow */}
        <ellipse
          cx={ballPos.x + 4}
          cy={ballPos.y + 12}
          rx={8}
          ry={3}
          fill="rgba(0,0,0,0.3)"
          filter="url(#shadowF)"
        />
        {/* Main ball */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={10}
          fill="url(#iso-ball-grad)"
          filter="url(#ballGlowF)"
          style={{ transition: "cx 0.05s linear, cy 0.05s linear" }}
        />
        {/* Ball highlight */}
        <circle
          cx={ballPos.x - 3}
          cy={ballPos.y - 3}
          r={3}
          fill="rgba(255,255,255,0.6)"
        />

        {/* ═══ LABELS ═══ */}
        {showLostLabel && phase === "broken" && (
          <g>
            <rect
              x={ballPos.x + 18}
              y={ballPos.y - 18}
              width={90}
              height={24}
              rx={12}
              fill="rgba(190,24,105,0.2)"
              stroke="rgba(190,24,105,0.4)"
              strokeWidth={0.5}
            />
            <text
              x={ballPos.x + 63}
              y={ballPos.y - 2}
              textAnchor="middle"
              fill="#BE1869"
              fontSize="11"
              fontFamily="Lexend"
              fontWeight="500"
            >
              Lead perdido
            </text>
          </g>
        )}

        {showEndLabel && phase === "complete" && (
          <g>
            {/* End sparkle */}
            <circle
              cx={isoPoints[isoPoints.length - 1].x}
              cy={isoPoints[isoPoints.length - 1].y}
              r={16}
              fill="#F7BE1A"
              opacity={0.3}
              filter="url(#flashFilter)"
            >
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <rect
              x={isoPoints[isoPoints.length - 1].x - 75}
              y={isoPoints[isoPoints.length - 1].y + 20}
              width={150}
              height={26}
              rx={13}
              fill="rgba(28,163,152,0.15)"
              stroke="rgba(28,163,152,0.3)"
              strokeWidth={0.5}
            />
            <text
              x={isoPoints[isoPoints.length - 1].x}
              y={isoPoints[isoPoints.length - 1].y + 37}
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
    </div>
  );
};

export default IsometricTrack;
