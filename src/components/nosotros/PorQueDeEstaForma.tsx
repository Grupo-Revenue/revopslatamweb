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
    (meta.p1 as string) ??
      "Somos una empresa fundada sobre principios cristianos. Y eso no es un detalle biográfico — es la razón por la que hacemos lo que hacemos de la forma en que lo hacemos.",
    (meta.p2 as string) ??
      "Entendemos nuestro trabajo como parte de algo más grande: el mandato de llenar el mundo de orden, bien y propósito. Cada sistema que diseñamos, cada proceso que conectamos, cada empresa que acompañamos es una oportunidad concreta de hacer bien al mundo y a las personas.",
    (meta.p3 as string) ??
      "Por eso no ejecutamos tareas por cumplir. Por eso no vendemos soluciones que no funcionan. Por eso decimos la verdad aunque no sea lo que el cliente quiere oír. No es estrategia comercial — es carácter. Y el carácter define la calidad del trabajo.",
    (meta.p4 as string) ??
      "Somos excelentes con nuestros clientes porque en primer lugar nuestro compromiso es con el talento que Dios nos ha dado para hacerle bien al mundo y a las personas.",
  ];

  const quote =
    (meta.quote as string) ??
    "Crecemos de forma correcta, honrando a Dios y sirviendo a las personas.";

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10" style={{ background: "#F5F5F8" }}>
      <div className="relative z-10 max-w-[820px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[1.12] tracking-tight"
          style={{ color: "#1A1A2E" }}
        >
          {title}
        </motion.h2>

        <div className="mt-10 space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.08 + i * 0.06)}
              className="text-[17px] sm:text-[18px] leading-[1.8]"
              style={{ color: "#4B5563" }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Visual quote — the most important sentence of the page */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-16 sm:mt-20 py-12 sm:py-16 px-6 text-center relative"
        >
          {/* Decorative quotation marks */}
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 text-[120px] sm:text-[160px] leading-none font-serif select-none pointer-events-none"
            style={{ color: "hsl(var(--pink) / 0.08)" }}
          >
            "
          </span>
          <p
            className="relative z-10 text-[24px] sm:text-[30px] md:text-[36px] font-bold leading-[1.2] tracking-tight"
            style={{ color: "#1A1A2E" }}
          >
            {quote}
          </p>
          <div
            className="mt-6 mx-auto h-1 w-16 rounded-full"
            style={{ background: "var(--gradient-brand)" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueDeEstaForma;
