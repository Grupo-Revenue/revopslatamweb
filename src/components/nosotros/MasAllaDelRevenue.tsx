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
  const p1 = (meta.p1 as string) ?? "Parte de lo que generamos como empresa lo destinamos a apoyar iniciativas que promueven una cosmovisión bíblica y la predicación del Evangelio a lo largo de Latinoamérica.";
  const p2 = (meta.p2 as string) ?? "Creemos que las empresas pueden ser instrumentos de bien en el mundo — no solo máquinas de generar utilidades. Y que el crecimiento sano de una empresa tiene un efecto real en las personas que trabajan en ella, en las familias que dependen de ella, y en las comunidades que la rodean.";
  const p3 = (meta.p3 as string) ?? "Ese es el para qué detrás de cada pista que diseñamos.";
  const closingQuote = (meta.closing_quote as string) ?? "Una empresa crece cuando su pista está bien armada. Y una pista bien armada hace bien al mundo.";

  // Split closing quote to highlight "hace bien al mundo" in green
  const highlightPhrase = "hace bien al mundo";
  const quoteparts = closingQuote.split(highlightPhrase);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(20,14,8,1) 0%, rgba(15,18,12,1) 50%, rgba(8,12,10,1) 100%)",
        borderTop: "1px solid rgba(0,229,160,0.08)",
        padding: "120px 5%",
        textAlign: "center",
      }}
    >
      <div className="relative z-10 max-w-[780px] mx-auto">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
          <span
            className="font-semibold tracking-[0.2em] uppercase"
            style={{ fontSize: "0.75rem", color: "hsl(var(--green))" }}
          >
            Propósito
          </span>
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
        </motion.div>

        <motion.h2
          {...fadeUp(0.06)}
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h2>

        <div className="mt-10 space-y-6">
          {[p1, p2, p3].map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.14 + i * 0.06)}
              style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,244,255,0.6)" }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Closing quote with green highlight */}
        <motion.div
          {...fadeUp(0.38)}
          className="mt-16 sm:mt-20 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: 900,
              margin: "0 auto",
              color: "#F0F4FF",
            }}
          >
            {quoteparts.length > 1 ? (
              <>
                {quoteparts[0]}
                <span style={{ color: "hsl(var(--green))" }}>{highlightPhrase}</span>
                {quoteparts[1]}
              </>
            ) : (
              closingQuote
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MasAllaDelRevenue;
