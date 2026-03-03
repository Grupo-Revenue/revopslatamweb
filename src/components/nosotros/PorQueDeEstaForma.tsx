import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const PorQueDeEstaForma = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Por qué lo hacemos de esta forma";

  const paragraphs = [
    (meta.p1 as string) ?? "Somos una empresa fundada sobre principios cristianos. Y eso no es un detalle biográfico — es la razón por la que hacemos lo que hacemos de la forma en que lo hacemos.",
    (meta.p2 as string) ?? "Entendemos nuestro trabajo como parte de algo más grande: el mandato de llenar el mundo de orden, bien y propósito. Cada sistema que diseñamos, cada proceso que conectamos, cada empresa que acompañamos es una oportunidad concreta de hacer bien al mundo y a las personas.",
    (meta.p3 as string) ?? "Por eso no ejecutamos tareas por cumplir. Por eso no vendemos soluciones que no funcionan. Por eso decimos la verdad aunque no sea lo que el cliente quiere oír. No es estrategia comercial — es carácter. Y el carácter define la calidad del trabajo.",
    (meta.p4 as string) ?? "Somos excelentes con nuestros clientes porque en primer lugar nuestro compromiso es con el talento que Dios nos ha dado para hacerle bien al mundo y a las personas.",
  ];

  const quote = (meta.quote as string) ?? "Crecemos de forma correcta, honrando a Dios y sirviendo a las personas.";

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "100px 5%", textAlign: "center", position: "relative" }}
    >
      <div className="relative z-10 max-w-[820px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: "#F0F4FF",
            textAlign: "left",
          }}
        >
          {title}
        </motion.h2>

        <div className="mt-10 space-y-6" style={{ textAlign: "left" }}>
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.08 + i * 0.06)}
              style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,244,255,0.6)" }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Visual quote — the big quotation mark decorative element */}
        <motion.div
          {...fadeUp(0.4)}
          className="relative"
          style={{ padding: "100px 5%", textAlign: "center", overflow: "hidden" }}
        >
          {/* Giant decorative quote mark */}
          <span
            className="absolute left-1/2 select-none pointer-events-none"
            style={{
              top: -20,
              transform: "translateX(-50%)",
              fontSize: "20rem",
              color: "hsl(var(--green))",
              opacity: 0.04,
              lineHeight: 1,
            }}
          >
            &ldquo;
          </span>
          <blockquote
            className="relative z-10 mx-auto"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              maxWidth: 860,
              color: "#F0F4FF",
            }}
          >
            {quote}
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueDeEstaForma;
