import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const levels = [
  { number: "01", label: "Nivel práctico", text: "Ayudamos a las empresas a escalar ordenando sus sistemas de revenue." },
  { number: "02", label: "Nivel ético", text: "Operamos con altos estándares de integridad, eligiendo trabajar solo con empresas que generen un impacto positivo." },
  { number: "03", label: "Nivel espiritual", text: "Vemos nuestro trabajo como una forma de cumplir el mandato cultural — sirviendo a Dios y a la sociedad a través de la excelencia en los negocios." },
];

const PorQueExistimos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Por qué existimos";
  const p1 = (meta.p1 as string) ?? "En Latinoamérica, muchas empresas no crecen porque están desordenadas. La improvisación, los equipos desalineados y la falta de procesos estructurados son parte del ADN empresarial de la región. Esa cultura del caos impide automatizar, medir con precisión y escalar de forma saludable.";
  const p2 = (meta.p2 as string) ?? "Nosotros creemos que puede ser diferente.";
  const p3 = (meta.p3 as string) ?? "Creemos que las empresas en LATAM pueden crecer — no solo en revenue, sino de manera sostenible, con integridad y propósito, contribuyendo al bien común y glorificando a Dios a través del trabajo bien hecho.";
  const pFinal = (meta.p_final as string) ?? "Por eso existimos: para ordenar la operación comercial de las empresas de LATAM, y dar a conocer e implementar Revenue Operations como disciplina estratégica para el crecimiento sostenible. No solo aplicamos RevOps. Lo enseñamos, lo impulsamos y lo usamos para transformar empresas que quieren dejar de improvisar y empezar a liderar.";
  const closingQuote = (meta.closing_quote as string) ?? "Somos arquitectos del revenue. Pieza a pieza, ordenamos para crecer.";
  const sectionLevels = Array.isArray(meta.levels) ? (meta.levels as typeof levels) : levels;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(15,21,32,1) 5%, rgba(15,21,32,1) 95%, transparent 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "100px 5%",
      }}
    >
      <div className="relative z-10 max-w-[820px] mx-auto">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "hsl(var(--green))" }} />
          <span
            className="font-semibold tracking-[0.2em] uppercase"
            style={{ fontSize: "0.75rem", color: "hsl(var(--green))" }}
          >
            Manifiesto
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(0.06)}
          className="font-bold leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", color: "#F0F4FF" }}
        >
          {title}
        </motion.h2>

        <motion.p
          {...fadeUp(0.12)}
          style={{ marginTop: 40, fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,244,255,0.6)" }}
        >
          {p1}
        </motion.p>

        {/* Highlighted belief — standalone */}
        <motion.p
          {...fadeUp(0.18)}
          style={{
            margin: "40px 0",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {p2}
        </motion.p>

        <motion.p
          {...fadeUp(0.22)}
          style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,244,255,0.6)" }}
        >
          {p3}
        </motion.p>

        {/* Three levels — grid layout */}
        <div className="mt-14">
          {sectionLevels.map((level, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.26 + i * 0.08)}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 24,
                alignItems: "start",
                padding: "32px 0",
                borderBottom: i < sectionLevels.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  color: "hsl(var(--green))",
                  opacity: 0.3,
                  lineHeight: 1,
                }}
              >
                {level.number}
              </span>
              <div>
                <h4
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "hsl(var(--green))",
                    marginBottom: 8,
                  }}
                >
                  {level.label}
                </h4>
                <p style={{ fontSize: "1.1rem", color: "rgba(240,244,255,0.8)", lineHeight: 1.7 }}>
                  {level.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...fadeUp(0.5)}
          style={{ marginTop: 48, fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,244,255,0.6)" }}
        >
          {pFinal}
        </motion.p>

        {/* Closing quote with separator */}
        <motion.div
          {...fadeUp(0.56)}
          className="text-center relative"
          style={{ paddingTop: 56 }}
        >
          <div
            style={{
              width: 48,
              height: 2,
              background: "hsl(var(--green))",
              margin: "0 auto 32px",
            }}
          />
          <p
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              color: "#F0F4FF",
            }}
          >
            {closingQuote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueExistimos;
