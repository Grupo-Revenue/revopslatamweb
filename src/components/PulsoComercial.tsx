import { motion } from "framer-motion";
import { Target, Zap, Map } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const benefits = [
  { icon: Target, label: "Tu Score de Madurez RevOps" },
  { icon: Zap, label: "Los 3 principales puntos de fricción" },
  { icon: Map, label: "Recomendación de siguiente paso personalizada" },
];

const PulsoComercial = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #BE1869 0%, #6224BE 100%)" }}>
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(255,255,255,0.05)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full" style={{ background: "rgba(255,255,255,0.08)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-block px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide uppercase"
            style={{ background: "white", color: "hsl(337 74% 44%)" }}>
            Diagnóstico gratuito
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.1)} className="mt-6 text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "white" }}>
          ¿Qué tan bien armada está tu pista?
        </motion.h2>

        <motion.p {...fadeUp(0.2)} className="mt-5 text-[18px] leading-relaxed max-w-[580px] mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
          El Pulso Comercial analiza el estado de tu motor de ingresos en 5 minutos. Sin formularios largos. Sin llamadas previas. Solo claridad.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Icon size={18} style={{ color: "white" }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: "white" }}>{b.label}</span>
              </div>
            );
          })}
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="mt-10">
          <button
            className="px-12 py-[18px] rounded-full text-[18px] font-bold transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "white",
              color: "hsl(337 74% 44%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            Tomar el Pulso Comercial
          </button>
        </motion.div>

        <motion.p {...fadeUp(0.5)} className="mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          Es gratuito · Toma 5 minutos · Resultado inmediato
        </motion.p>
      </div>
    </section>
  );
};

export default PulsoComercial;
