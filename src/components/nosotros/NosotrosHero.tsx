import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const NosotrosHero = ({ section }: { section?: HomeSection }) => {
  const label = section?.subtitle ?? "Quiénes somos";
  const title =
    section?.title ??
    "Somos Arquitectos del Revenue. Y hacemos este trabajo para algo más grande que el revenue.";
  const body =
    section?.body ??
    "Creemos que el orden, el diseño y el crecimiento sano son formas concretas de hacer bien en el mundo. Por eso construimos sistemas de revenue con la misma convicción con que otros construyen catedrales — pieza a pieza, con propósito, sin atajos.";

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: -200,
          right: -100,
          background: "radial-gradient(circle, rgba(190,24,105,0.08) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          left: -150,
          background: "radial-gradient(circle, rgba(98,36,190,0.1) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-10 py-32 sm:py-40 text-center">
        <motion.span
          {...fadeUp(0)}
          className="inline-block text-[12px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase mb-8"
          style={{ color: "hsl(var(--pink))" }}
        >
          {label}
        </motion.span>

        <motion.h1
          {...fadeUp(0.12)}
          className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-bold leading-[1.08] tracking-tight"
          style={{ color: "white" }}
        >
          {title}
        </motion.h1>

        <motion.p
          {...fadeUp(0.24)}
          className="mt-8 text-[17px] sm:text-[19px] leading-[1.7] max-w-[720px] mx-auto"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {body}
        </motion.p>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0D0D1A)",
        }}
      />
    </section>
  );
};

export default NosotrosHero;
