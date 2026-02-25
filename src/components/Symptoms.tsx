import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

/* ── Data ────────────────────────────────────────────── */

interface FrictionNode {
  id: string;
  label: string;       // node label (short)
  title: string;       // symptom headline
  sub: string;         // brief subtext
  accent: string;      // HSL accent
}

const NODES: FrictionNode[] = [
  {
    id: "structure",
    label: "Estructura",
    title: "Crecimos, pero el caos creció más.",
    sub: "Más clientes, más herramientas, menos control.",
    accent: "337 74% 44%",   // pink
  },
  {
    id: "marketing-sales",
    label: "Marketing ↔ Ventas",
    title: "Marketing y ventas no se hablan.",
    sub: "Métricas distintas, culpas cruzadas, leads fríos.",
    accent: "263 70% 44%",   // purple
  },
  {
    id: "tools",
    label: "Herramientas",
    title: "Tienes HubSpot pero no lo usas bien.",
    sub: "Licencia activa. Sistema pasivo.",
    accent: "208 95% 44%",   // blue
  },
  {
    id: "forecast",
    label: "Forecast",
    title: "No puedes predecir el cierre de mes.",
    sub: "Más intuición que proyección.",
    accent: "42 93% 54%",    // yellow
  },
  {
    id: "leadership",
    label: "Liderazgo",
    title: "Contrataste un Gerente Comercial y sigue el caos.",
    sub: "Sin datos confiables, nadie puede operar bien.",
    accent: "175 73% 37%",   // teal
  },
];

/* ── Helpers ─────────────────────────────────────────── */

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

/* ── Desktop SVG Diagram ─────────────────────────────── */

const DESKTOP_W = 1100;
const DESKTOP_H = 520;

// Node positions along a gentle arc
const DESKTOP_POSITIONS = [
  { cx: 110, cy: 260 },
  { cx: 330, cy: 160 },
  { cx: 550, cy: 120 },
  { cx: 770, cy: 160 },
  { cx: 990, cy: 260 },
];

const DesktopDiagram = ({
  activeIdx,
  setActiveIdx,
}: {
  activeIdx: number | null;
  setActiveIdx: (i: number | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="hidden md:block w-full max-w-[1100px] mx-auto">
      <svg
        viewBox={`0 0 ${DESKTOP_W} ${DESKTOP_H}`}
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Grid pattern for blueprint feel */}
          <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220 13% 91% / 0.15)" strokeWidth="0.5" />
          </pattern>
          {/* Glow filters per accent */}
          {NODES.map((n, i) => (
            <filter key={n.id} id={`glow-${n.id}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feFlood floodColor={`hsl(${n.accent})`} floodOpacity="0.35" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Blueprint grid */}
        <rect width={DESKTOP_W} height={DESKTOP_H} fill="url(#bp-grid)" />

        {/* Connection lines */}
        {DESKTOP_POSITIONS.slice(0, -1).map((p, i) => {
          const next = DESKTOP_POSITIONS[i + 1];
          const isActive = activeIdx !== null && (i === activeIdx || i + 1 === activeIdx);
          const isAnyActive = activeIdx !== null;
          return (
            <motion.line
              key={`line-${i}`}
              x1={p.cx}
              y1={p.cy}
              x2={next.cx}
              y2={next.cy}
              stroke={isActive ? `hsl(${NODES[activeIdx!].accent})` : "hsl(var(--muted-foreground) / 0.18)"}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? "none" : "6 4"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: isAnyActive && !isActive ? 0.15 : 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const pos = DESKTOP_POSITIONS[i];
          const isActive = activeIdx === i;
          const isAnyActive = activeIdx !== null;
          const nodeOpacity = isAnyActive && !isActive ? 0.25 : 1;

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: nodeOpacity, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => setActiveIdx(isActive ? null : i)}
            >
              {/* Outer ring on active */}
              {isActive && (
                <motion.circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={42}
                  fill="none"
                  stroke={`hsl(${node.accent})`}
                  strokeWidth={1.5}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Node circle */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={32}
                fill={isActive ? `hsl(${node.accent} / 0.12)` : "hsl(var(--background))"}
                stroke={isActive ? `hsl(${node.accent})` : "hsl(var(--muted-foreground) / 0.2)"}
                strokeWidth={isActive ? 2 : 1}
                filter={isActive ? `url(#glow-${node.id})` : undefined}
              />

              {/* Node label */}
              <text
                x={pos.cx}
                y={pos.cy + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isActive ? `hsl(${node.accent})` : "hsl(var(--muted-foreground))"}
                fontSize="10"
                fontWeight="600"
                fontFamily="Lexend, sans-serif"
                letterSpacing="0.04em"
              >
                {node.label}
              </text>

              {/* Symptom text below node */}
              <motion.g
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                transition={{ duration: 0.25 }}
              >
                <text
                  x={pos.cx}
                  y={pos.cy + 62}
                  textAnchor="middle"
                  fill={`hsl(${node.accent})`}
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Lexend, sans-serif"
                >
                  {node.title}
                </text>
                <text
                  x={pos.cx}
                  y={pos.cy + 82}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="11"
                  fontWeight="400"
                  fontFamily="Lexend, sans-serif"
                >
                  {node.sub}
                </text>
              </motion.g>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

/* ── Mobile Vertical Layout ──────────────────────────── */

const MobileNode = ({
  node,
  index,
  isLast,
  isActive,
  onTap,
}: {
  node: FrictionNode;
  index: number;
  isLast: boolean;
  isActive: boolean;
  onTap: () => void;
}) => (
  <motion.div {...fadeUp(0.1 + index * 0.08)} className="flex flex-col items-center">
    {/* Node */}
    <button
      onClick={onTap}
      className="relative flex items-center justify-center w-16 h-16 rounded-full border transition-all duration-300 focus:outline-none"
      style={{
        borderColor: isActive ? `hsl(${node.accent})` : "hsl(var(--muted-foreground) / 0.2)",
        background: isActive ? `hsl(${node.accent} / 0.1)` : "hsl(var(--background))",
        boxShadow: isActive ? `0 0 24px hsl(${node.accent} / 0.25)` : "none",
      }}
    >
      <span
        className="text-[10px] font-semibold tracking-wide text-center leading-tight px-1"
        style={{ color: isActive ? `hsl(${node.accent})` : "hsl(var(--muted-foreground))" }}
      >
        {node.label}
      </span>
    </button>

    {/* Symptom text */}
    <motion.div
      initial={false}
      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden text-center mt-3 max-w-[280px]"
    >
      <p className="text-sm font-bold" style={{ color: `hsl(${node.accent})` }}>
        {node.title}
      </p>
      <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
        {node.sub}
      </p>
    </motion.div>

    {/* Connector line */}
    {!isLast && (
      <div
        className="w-px h-10 my-2"
        style={{
          background: isActive
            ? `hsl(${node.accent} / 0.4)`
            : "hsl(var(--muted-foreground) / 0.15)",
        }}
      />
    )}
  </motion.div>
);

const MobileDiagram = ({
  activeIdx,
  setActiveIdx,
}: {
  activeIdx: number | null;
  setActiveIdx: (i: number | null) => void;
}) => (
  <div className="flex flex-col items-center md:hidden">
    {NODES.map((node, i) => (
      <MobileNode
        key={node.id}
        node={node}
        index={i}
        isLast={i === NODES.length - 1}
        isActive={activeIdx === i}
        onTap={() => setActiveIdx(activeIdx === i ? null : i)}
      />
    ))}
  </div>
);

/* ── Main Component ──────────────────────────────────── */

const Symptoms = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const eyebrow = section?.subtitle ?? "¿Te suena familiar?";
  const headline = section?.title ?? "Mapa de fricción de tu sistema comercial";
  const closingText =
    (meta.closing_text as string) ??
    "Si reconoces dos o más de estos puntos, no tienes un problema de talento ni de herramientas.";
  const closingBold =
    (meta.closing_bold as string) ?? "Tienes un problema de sistema.";

  const sectionBg = getBgStyle();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Auto-cycle on desktop when no user interaction
  const [autoCycle, setAutoCycle] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!autoCycle) return;
    let idx = 0;
    intervalRef.current = setInterval(() => {
      setActiveIdx(idx % NODES.length);
      idx++;
    }, 2800);
    return () => clearInterval(intervalRef.current);
  }, [autoCycle]);

  const handleSetActive = (i: number | null) => {
    setAutoCycle(false);
    setActiveIdx(i);
  };

  return (
    <section
      id="sintomas"
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{
        background: "hsl(var(--dark-bg))",
        ...sectionBg,
      }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="text-center font-semibold tracking-[0.2em] uppercase text-[12px] sm:text-[13px]"
          style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}
        >
          {eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-4 text-center text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] leading-[1.2] tracking-tight max-w-[800px] mx-auto"
          style={{
            color: "hsl(var(--foreground))",
            fontWeight: 700,
            ...getStyle("title"),
          }}
        >
          {headline}
        </motion.h2>

        <motion.p
          {...fadeUp(0.14)}
          className="mt-3 text-center text-sm sm:text-base max-w-[600px] mx-auto"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Cada nodo es una pieza de tu operación. Explora dónde están las fracturas.
        </motion.p>

        {/* Diagram */}
        <div className="mt-14 sm:mt-16">
          <DesktopDiagram activeIdx={activeIdx} setActiveIdx={handleSetActive} />
          <MobileDiagram activeIdx={activeIdx} setActiveIdx={handleSetActive} />
        </div>

        {/* Closing diagnostic block */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-16 sm:mt-20 mx-auto max-w-[720px] text-center"
          style={{
            borderTop: "1px solid hsl(var(--muted-foreground) / 0.12)",
            paddingTop: "clamp(28px, 4vw, 48px)",
          }}
        >
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{
              color: "hsl(var(--muted-foreground))",
              ...getStyle("body"),
            }}
          >
            {closingText}
          </p>
          <p
            className="mt-4 text-xl sm:text-2xl font-bold leading-tight text-gradient-brand"
          >
            {closingBold}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Symptoms;
