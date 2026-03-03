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
  { icon: "search", title: "Somos decodificadores de sistemas", text: "Detrás de cada resultado, bueno o malo, hay un sistema que lo genera. Nuestro trabajo empieza por ver lo que otros no ven — las causas invisibles, los patrones ocultos, las piezas que faltan. Leemos sistemas complejos y los traducimos en acciones claras." },
  { icon: "compass", title: "Somos estrategas antes que ejecutores", text: "Pensamos antes de actuar. Diseñamos antes de construir. Priorizamos antes de ejecutar. Ninguna decisión se toma sin un plano, sin un propósito y sin un diseño que sostenga el crecimiento futuro del cliente." },
  { icon: "wrench", title: "Somos solucionadores, no señaladores", text: "No venimos a decirte qué está mal y dejarte solo con el problema. Si detectamos una fricción, traemos la propuesta para resolverla. Si algo no genera valor, lo decimos con claridad. Si algo afecta la pista, lo reparamos." },
  { icon: "trending", title: "Somos analistas del flujo continuo", text: "El revenue no es un proyecto con principio y fin. Es un sistema vivo que evoluciona. Por eso acompañamos de forma continua — midiendo, ajustando y perfeccionando la pista para que el crecimiento sea sostenible, no un pico aislado." },
];

const ComoEntendemos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Cómo entendemos lo que hacemos";
  const cards = Array.isArray(meta.cards) ? (meta.cards as typeof defaultCards) : defaultCards;

  return (
    <section className="relative" style={{ padding: "100px 5%" }}>
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          className="text-center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] ?? Search;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className="group relative overflow-hidden"
                style={{
                  background: "rgba(15,21,32,1)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "36px 32px",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                whileHover={{
                  y: -4,
                  borderColor: "rgba(0,229,160,0.25)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(0,229,160,0.05), transparent)" }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: "rgba(0,229,160,0.1)",
                    border: "1px solid rgba(0,229,160,0.2)",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={22} style={{ color: "hsl(var(--green))" }} />
                </div>

                <h3
                  className="relative z-10"
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: 10,
                    color: "#F0F4FF",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="relative z-10"
                  style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(240,244,255,0.6)" }}
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
