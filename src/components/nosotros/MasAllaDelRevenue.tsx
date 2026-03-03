import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const MasAllaDelRevenue = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Más allá del revenue";

  const p1 =
    (meta.p1 as string) ??
    "Parte de lo que generamos como empresa lo destinamos a apoyar iniciativas que promueven una cosmovisión bíblica y la predicación del Evangelio a lo largo de Latinoamérica.";
  const p2 =
    (meta.p2 as string) ??
    "Creemos que las empresas pueden ser instrumentos de bien en el mundo — no solo máquinas de generar utilidades. Y que el crecimiento sano de una empresa tiene un efecto real en las personas que trabajan en ella, en las familias que dependen de ella, y en las comunidades que la rodean.";
  const p3 =
    (meta.p3 as string) ?? "Ese es el para qué detrás de cada pista que diseñamos.";
  const closingQuote =
    (meta.closing_quote as string) ??
    "Una empresa crece cuando su pista está bien armada. Y una pista bien armada hace bien al mundo.";

  return (
    <section
      className="relative py-24 sm:py-32 px-6 sm:px-10 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0D0D1A 0%, #1A0A2E 40%, #2A1040 70%, #1A0A2E 100%)",
      }}
    >
      {/* Warm glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: -100,
          left: -200,
          background: "radial-gradient(circle, rgba(190,24,105,0.12) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          right: -150,
          background: "radial-gradient(circle, rgba(98,36,190,0.15) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-[780px] mx-auto text-center">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
          <span
            className="text-[12px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: "hsl(var(--teal))" }}
          >
            Propósito
          </span>
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
        </motion.div>

        <motion.h2
          {...fadeUp(0.06)}
          className="text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.1] tracking-tight"
          style={{ color: "white" }}
        >
          {title}
        </motion.h2>

        <div className="mt-10 space-y-6">
          {[p1, p2, p3].map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.14 + i * 0.06)}
              className="text-[17px] sm:text-[19px] leading-[1.8]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Central closing quote — the emotional climax */}
        <motion.div
          {...fadeUp(0.38)}
          className="mt-16 sm:mt-20 pt-10 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p
            className="text-[26px] sm:text-[34px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
            style={{
              background: "linear-gradient(135deg, hsl(var(--teal)), hsl(var(--blue)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {closingQuote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MasAllaDelRevenue;
