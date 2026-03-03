import { motion } from "framer-motion";
import { Search, Compass, Wrench, TrendingUp } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  compass: Compass,
  wrench: Wrench,
  trending: TrendingUp,
};

const defaultCards = [
  {
    icon: "search",
    title: "Somos decodificadores de sistemas",
    text: "Detrás de cada resultado, bueno o malo, hay un sistema que lo genera. Nuestro trabajo empieza por ver lo que otros no ven — las causas invisibles, los patrones ocultos, las piezas que faltan. Leemos sistemas complejos y los traducimos en acciones claras.",
  },
  {
    icon: "compass",
    title: "Somos estrategas antes que ejecutores",
    text: "Pensamos antes de actuar. Diseñamos antes de construir. Priorizamos antes de ejecutar. Ninguna decisión se toma sin un plano, sin un propósito y sin un diseño que sostenga el crecimiento futuro del cliente.",
  },
  {
    icon: "wrench",
    title: "Somos solucionadores, no señaladores",
    text: "No venimos a decirte qué está mal y dejarte solo con el problema. Si detectamos una fricción, traemos la propuesta para resolverla. Si algo no genera valor, lo decimos con claridad. Si algo afecta la pista, lo reparamos.",
  },
  {
    icon: "trending",
    title: "Somos analistas del flujo continuo",
    text: "El revenue no es un proyecto con principio y fin. Es un sistema vivo que evoluciona. Por eso acompañamos de forma continua — midiendo, ajustando y perfeccionando la pista para que el crecimiento sea sostenible, no un pico aislado.",
  },
];

const ComoEntendemos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Cómo entendemos lo que hacemos";
  const cards = Array.isArray(meta.cards) ? (meta.cards as typeof defaultCards) : defaultCards;

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10" style={{ background: "white" }}>
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[1.12] tracking-tight text-center"
          style={{ color: "#1A1A2E" }}
        >
          {title}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] ?? Search;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className="rounded-2xl p-7 sm:p-8 transition-shadow duration-300 hover:shadow-lg"
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "hsl(var(--pink) / 0.08)",
                  }}
                >
                  <Icon size={24} style={{ color: "hsl(var(--pink))" }} />
                </div>
                <h3
                  className="text-[20px] sm:text-[22px] font-bold leading-[1.25] tracking-tight"
                  style={{ color: "#1A1A2E" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-3 text-[15px] sm:text-[16px] leading-[1.7]"
                  style={{ color: "#6B7280" }}
                >
                  {card.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComoEntendemos;
