import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const defaultMetrics = [
  { value: "+50", label: "empresas diagnosticadas en LATAM" },
  { value: "$200MM USD", label: "en pipeline analizado" },
  { value: "7", label: "servicios especializados en Revenue Operations" },
  { value: "1 convicción", label: "una empresa crece cuando su pista está bien armada" },
];

const LosNumeros = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Lo que hemos construido hasta aquí";
  const metrics = Array.isArray(meta.metrics)
    ? (meta.metrics as typeof defaultMetrics)
    : defaultMetrics;

  return (
    <section
      className="relative py-16 sm:py-20 px-6 sm:px-10 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0D0D1A 0%, #1A0A2E 50%, #0D1A2E 100%)",
      }}
    >
      {/* Subtle pink glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 300,
          bottom: -50,
          left: "20%",
          background: "radial-gradient(ellipse, rgba(190,24,105,0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          className="text-[28px] sm:text-[36px] md:text-[44px] font-bold leading-[1.12] tracking-tight text-center mb-14"
          style={{ color: "white" }}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {metrics.map((m, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="text-center">
              <span
                className="block text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-none tracking-tight"
                style={{
                  background: "var(--gradient-brand)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {m.value}
              </span>
              <p
                className="mt-3 text-[14px] sm:text-[15px] leading-[1.5]"
                style={{ color: "rgba(255,255,255,0.55)" }}
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
