import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const defaultMetrics = [
  { value: "14", color: "#BE1869", desc: "años construyendo sistemas de revenue" },
  { value: "HubSpot", color: "#1CA398", desc: "como plataforma central certificada" },
  { value: "LATAM", color: "#0779D7", desc: "foco en el contexto latinoamericano real" },
];

const Credibility = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const metrics = (meta.metrics as typeof defaultMetrics) ?? defaultMetrics;
  const title = section?.title ?? "14 años. Una convicción.";
  const body = section?.body ?? "No llegamos a RevOps por tendencia. Llegamos porque vimos el mismo patrón repetirse empresa tras empresa: crecimiento sin estructura, tecnología sin proceso, equipos sin dirección común. Desde entonces, construimos una metodología que pone el diagnóstico antes que la implementación.";

  return (
    <section className="py-20 px-6" style={{ background: "#F5F5F8" }}>
      <div className="max-w-[1000px] mx-auto text-center">
        <motion.h2 {...fadeUp(0)} className="text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "#1A1A2E" }}>
          {title}
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-6 text-[18px] leading-relaxed max-w-[600px] mx-auto" style={{ color: "#6B7280" }}>
          {body}
        </motion.p>
        <motion.div {...fadeUp(0.25)} className="mt-14 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
          {metrics.map((m, i) => (
            <div key={m.value} className="flex items-center">
              <div className="text-center px-8 md:px-12">
                <span className="block text-[48px] font-bold leading-none" style={{ color: m.color }}>{m.value}</span>
                <span className="block mt-2 text-[14px]" style={{ color: "#6B7280" }}>{m.desc}</span>
              </div>
              {i < metrics.length - 1 && (
                <div className="hidden md:block w-px h-16" style={{ background: "#D1D5DB" }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Credibility;
