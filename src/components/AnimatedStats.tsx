import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  color: string;
  label: string;
  duration?: number;
}

const Counter = ({ target, suffix = "", prefix = "", color, label, duration = 2 }: CounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-center px-6 md:px-10">
      <span className="block text-[32px] sm:text-[48px] md:text-[56px] font-bold leading-none" style={{ color }}>
        {prefix}{display.toLocaleString()}{suffix}
      </span>
      <span className="block mt-3 text-[14px] leading-snug max-w-[180px] mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </span>
    </div>
  );
};

const defaultStats = [
  { target: 50, suffix: "+", color: "#BE1869", label: "Implementaciones HubSpot exitosas" },
  { target: 2, prefix: "$", suffix: "M+", color: "#6224BE", label: "En revenue generado para clientes" },
  { target: 10000, suffix: "+", color: "#1CA398", label: "Horas ahorradas en procesos manuales" },
  { target: 200, suffix: "+", color: "#0779D7", label: "Empresas transformadas en LATAM" },
];

const AnimatedStats = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const stats: CounterProps[] = Array.isArray(meta.stats)
    ? meta.stats.filter((item): item is CounterProps => {
        if (!item || typeof item !== "object") return false;
        const stat = item as Record<string, unknown>;
        return typeof stat.target === "number" && typeof stat.label === "string" && typeof stat.color === "string";
      })
    : defaultStats;
  const title = section?.title ?? "Números que hablan por sí solos";

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 overflow-hidden" style={{ background: "#0D0D1A", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(98,36,190,0.08) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-[1000px] mx-auto"
      >
        <h2 className="text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight text-primary-foreground mb-14" style={getStyle("title")}>
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AnimatedStats;
