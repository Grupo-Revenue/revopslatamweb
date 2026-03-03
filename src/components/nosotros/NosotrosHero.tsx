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
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,160,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 20% 100%, rgba(124,92,252,0.06) 0%, transparent 50%),
          var(--gradient-hero)
        `,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-10 text-center"
        style={{ paddingTop: 140, paddingBottom: 80 }}
      >
        <motion.span
          {...fadeUp(0)}
          className="inline-block font-semibold tracking-[0.2em] uppercase mb-8"
          style={{ fontSize: "0.75rem", color: "hsl(var(--green))" }}
        >
          {label}
        </motion.span>

        <motion.h1
          {...fadeUp(0.12)}
          style={{
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          {...fadeUp(0.24)}
          className="mx-auto"
          style={{
            marginTop: 32,
            fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
            lineHeight: 1.7,
            color: "rgba(240,244,255,0.6)",
            maxWidth: 640,
            textAlign: "center",
          }}
        >
          {body}
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0D0D1A)" }}
      />
    </section>
  );
};

export default NosotrosHero;
