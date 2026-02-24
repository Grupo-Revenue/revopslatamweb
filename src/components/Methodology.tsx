import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";

/* ── fade-up helper ── */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

/* ── Track state data ── */
const trackStates = [
  {
    id: "broken",
    dot: "337 74% 44%",
    label: "Pista Rota",
    title: "Procesos manuales, datos dispersos, equipos desconectados.",
    sub: "La bolita se pierde antes de la mitad.",
    border: "hsl(337 74% 44%)",
  },
  {
    id: "incomplete",
    dot: "42 93% 54%",
    label: "Pista Incompleta",
    title: "Herramientas instaladas, algunos procesos definidos.",
    sub: "La bolita avanza, pero lento, con fricciones constantes.",
    border: "hsl(42 93% 54%)",
  },
  {
    id: "complete",
    dot: "175 73% 37%",
    label: "Pista Bien Armada",
    title: "Procesos integrados, datos confiables, equipos alineados.",
    sub: "La bolita fluye. El revenue es predecible y escalable.",
    border: "hsl(175 73% 37%)",
  },
];

/* ── Mini track SVG animations ── */
const MiniTrackBroken = () => (
  <svg viewBox="0 0 280 80" className="w-full h-20">
    {/* Track segments */}
    <line x1="10" y1="40" x2="80" y2="40" stroke="hsl(337 74% 44%)" strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="40" x2="150" y2="40" stroke="hsl(337 74% 44%)" strokeWidth="3" strokeLinecap="round" opacity="0.4" strokeDasharray="4 4" />
    <line x1="170" y1="45" x2="220" y2="50" stroke="hsl(337 74% 44%)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    <line x1="240" y1="40" x2="270" y2="40" stroke="hsl(337 74% 44%)" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
    {/* Ball falling */}
    <motion.circle
      r="6"
      fill="url(#ballGrad)"
      filter="url(#ballGlow)"
      initial={{ cx: 10, cy: 40 }}
      animate={{ cx: [10, 80, 90, 92], cy: [40, 40, 55, 70] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
    />
    {/* Pulsing gap */}
    <motion.rect
      x="82" y="30" width="16" height="20" rx="4"
      fill="hsl(337 74% 44%)"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <defs>
      <radialGradient id="ballGrad">
        <stop offset="0%" stopColor="#F7BE1A" />
        <stop offset="100%" stopColor="#BE1869" />
      </radialGradient>
      <filter id="ballGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  </svg>
);

const MiniTrackIncomplete = () => (
  <svg viewBox="0 0 280 80" className="w-full h-20">
    <line x1="10" y1="40" x2="100" y2="40" stroke="hsl(42 93% 54%)" strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="40" x2="180" y2="40" stroke="hsl(42 93% 54%)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    {/* Friction zone */}
    <line x1="180" y1="40" x2="220" y2="42" stroke="hsl(42 93% 54%)" strokeWidth="3" strokeLinecap="round" opacity="0.4" strokeDasharray="6 3" />
    <line x1="230" y1="40" x2="270" y2="40" stroke="hsl(42 93% 54%)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    {/* Ball slowing */}
    <motion.circle
      r="6"
      fill="url(#ballGrad2)"
      filter="url(#ballGlow2)"
      initial={{ cx: 10, cy: 40 }}
      animate={{ cx: [10, 100, 150, 180, 195, 200] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    />
    <defs>
      <radialGradient id="ballGrad2">
        <stop offset="0%" stopColor="#F7BE1A" />
        <stop offset="100%" stopColor="#BE1869" />
      </radialGradient>
      <filter id="ballGlow2">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  </svg>
);

const MiniTrackComplete = () => (
  <svg viewBox="0 0 280 80" className="w-full h-20">
    <line x1="10" y1="40" x2="260" y2="40" stroke="hsl(175 73% 37%)" strokeWidth="3" strokeLinecap="round" />
    {/* Trail */}
    <motion.line
      x1="10" y1="40" x2="10" y2="40"
      stroke="hsl(42 93% 54%)"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
      animate={{ x2: [10, 260] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
    />
    {/* Ball */}
    <motion.circle
      r="6"
      fill="url(#ballGrad3)"
      filter="url(#ballGlow3)"
      initial={{ cx: 10, cy: 40 }}
      animate={{ cx: [10, 260] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
    />
    {/* End sparkle */}
    <motion.circle
      cx="260" cy="40" r="12"
      fill="none"
      stroke="hsl(175 73% 37%)"
      strokeWidth="2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0, 0.8, 0], scale: [0, 0, 1.2, 1.5] }}
      transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 0, ease: "easeOut" }}
    />
    <defs>
      <radialGradient id="ballGrad3">
        <stop offset="0%" stopColor="#F7BE1A" />
        <stop offset="100%" stopColor="#BE1869" />
      </radialGradient>
      <filter id="ballGlow3">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  </svg>
);

const miniTracks: Record<string, React.FC> = {
  broken: MiniTrackBroken,
  incomplete: MiniTrackIncomplete,
  complete: MiniTrackComplete,
};

/* ── Main Component ── */
const Methodology = () => {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-cycle every 3s unless user interacted
  useEffect(() => {
    if (userInteracted) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleClick = useCallback((i: number) => {
    setActive(i);
    setUserInteracted(true);
    // Resume auto-cycle after 9s of inactivity
    setTimeout(() => setUserInteracted(false), 9000);
  }, []);

  const ActiveTrack = miniTracks[trackStates[active].id];

  return (
    <section className="relative">
      {/* Wave transition from dark to light */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,0 L1440,0 L1440,40 Q1080,80 720,60 Q360,40 0,80 Z" fill="#0D0D1A" />
        </svg>
      </div>

      <div className="pt-24 pb-24 px-6" style={{ background: "#F5F5F8" }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Eyebrow */}
          <motion.p
            {...fadeUp(0)}
            className="text-center text-[13px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "hsl(337 74% 44%)" }}
          >
            Nuestra metodología
          </motion.p>

          {/* Headline */}
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-4 text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight max-w-[650px] mx-auto"
            style={{ color: "#1A1A2E" }}
          >
            El revenue no se improvisa.
            <br />
            <span className="text-gradient-brand">Se diseña, pieza a pieza.</span>
          </motion.h2>

          {/* Intro paragraph */}
          <motion.div
            {...fadeUp(0.2)}
            className="mt-8 mx-auto max-w-[620px] text-center text-[18px] leading-relaxed space-y-4"
            style={{ color: "#6B7280" }}
          >
            <p>
              Piensa en una pista modular, de esas que se arman pieza a pieza para que una bolita llegue al final sin caerse. Eso es exactamente un sistema de revenue.
            </p>
            <p>
              Cada pieza es un proceso, un acuerdo, una automatización, un dato, un rol. La bolita es tu lead, moviéndose desde el primer contacto hasta el cliente que renueva y refiere. La meta es que llegue al final, siempre, de manera predecible.
            </p>
          </motion.div>

          {/* Track States Cards */}
          <motion.div {...fadeUp(0.35)} className="mt-16">
            {/* Mini animation preview */}
            <div className="mx-auto max-w-md mb-10 rounded-2xl p-6" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActiveTrack />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trackStates.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => handleClick(i)}
                  className={`text-left rounded-2xl p-7 transition-all duration-300 cursor-pointer ${
                    active === i ? "shadow-lg -translate-y-1" : "hover:-translate-y-1"
                  }`}
                  style={{
                    background: active === i ? "white" : "#EDEDF0",
                    borderTop: `3px solid ${s.border}`,
                    boxShadow: active === i ? `0 8px 30px ${s.border}33` : undefined,
                  }}
                  {...fadeUp(0.4 + i * 0.1)}
                >
                  {/* Dot + label */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: `hsl(${s.dot})` }}
                    />
                    <span
                      className="text-[13px] font-semibold tracking-wide uppercase"
                      style={{ color: `hsl(${s.dot})` }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <h4 className="text-[17px] font-semibold leading-snug mb-2" style={{ color: "#1A1A2E" }}>
                    {s.title}
                  </h4>
                  <p className="text-[15px] leading-relaxed" style={{ color: "#6B7280" }}>
                    {s.sub}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Closing box */}
          <motion.div
            {...fadeUp(0.6)}
            className="mt-16 mx-auto max-w-[800px] rounded-[20px] p-12 text-center"
            style={{
              background: "#1A1A2E",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-[24px] font-semibold leading-snug" style={{ color: "white" }}>
              En Revops LATAM llevamos 14 años armando pistas.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              Sabemos leer cómo fluye la tuya hoy, dónde se pierde, y qué hay que construir para que llegue al final.
            </p>
            <button
              className="mt-6 inline-flex items-center gap-2 text-[16px] font-medium transition-opacity hover:opacity-80"
              style={{ color: "hsl(175 73% 37%)" }}
            >
              Conoce nuestra metodología completa
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
