import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { HomeSection } from "@/hooks/useHomeSections";

const defaultMetrics = [
  { value: "+50", numericTarget: 50, prefix: "+", suffix: "", label: "empresas diagnosticadas en LATAM" },
  { value: "$200MM USD", numericTarget: 200, prefix: "$", suffix: "MM USD", label: "en pipeline analizado" },
  { value: "7", numericTarget: 7, prefix: "", suffix: "", label: "servicios especializados en Revenue Operations" },
  { value: "1 convicción", numericTarget: null, prefix: "", suffix: "", label: "una empresa crece cuando su pista está bien armada" },
];

function AnimatedNumber({ target, prefix, suffix, duration = 2000 }: { target: number | null; prefix: string; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || hasAnimated || target === null) return;
    setHasAnimated(true);
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, hasAnimated, target, duration]);

  if (target === null) {
    return <span ref={ref}>1 convicción</span>;
  }

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const LosNumeros = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Lo que hemos construido hasta aquí";
  const metrics = Array.isArray(meta.metrics) ? (meta.metrics as typeof defaultMetrics) : defaultMetrics;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "rgba(0,229,160,0.04)",
        borderTop: "1px solid rgba(0,229,160,0.1)",
        borderBottom: "1px solid rgba(0,229,160,0.1)",
        padding: "80px 5%",
      }}
    >
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h2>

        <div
          className="flex flex-wrap justify-center"
          style={{ gap: 80 }}
        >
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="text-center"
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 800,
                  color: "hsl(var(--green))",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber
                  target={m.numericTarget ?? null}
                  prefix={m.prefix}
                  suffix={m.suffix}
                />
              </span>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(240,244,255,0.5)",
                  marginTop: 8,
                  maxWidth: 160,
                }}
              >
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LosNumeros;
