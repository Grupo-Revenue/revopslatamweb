import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, TrendingUp, Heart, BookOpen } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const values = [
  { icon: Stethoscope, title: "Primero diagnosticar, luego construir", desc: "Entendemos antes de tocar cualquier herramienta." },
  { icon: TrendingUp, title: "Crecimiento real, no solo rápido", desc: "Construimos para que dure, no para impresionar." },
  { icon: Heart, title: "Lideramos sirviendo", desc: "El éxito de nuestros clientes es el nuestro." },
  { icon: BookOpen, title: "Nunca paramos de aprender", desc: "Nos certificamos, experimentamos y enseñamos." },
];

const AboutTeaser = () => {
  return (
    <section className="py-24 px-6" style={{ background: "#0D0D1A" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text column */}
        <div>
          <motion.p {...fadeUp(0)} className="text-[13px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#BE1869" }}>
            Nuestra esencia
          </motion.p>
          <motion.h2 {...fadeUp(0.1)} className="mt-4 text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "white" }}>
            Construimos crecimiento real, sano y sostenible.
          </motion.h2>
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            <motion.p {...fadeUp(0.2)}>
              No ejecutamos tareas por cumplir. Nos comprometemos con el resultado de cada cliente como si fuera nuestro propio negocio.
            </motion.p>
            <motion.p {...fadeUp(0.25)}>
              Somos Arquitectos del Revenue: diseñamos antes de construir, diagnosticamos antes de implementar, y medimos para mejorar de manera continua.
            </motion.p>
          </div>
          <motion.button
            {...fadeUp(0.3)}
            className="mt-8 inline-flex items-center gap-2 text-[16px] font-medium transition-opacity hover:opacity-80"
            style={{ color: "#1CA398" }}
          >
            Conocer a Revops LATAM <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* Values card */}
        <motion.div
          {...fadeUp(0.2)}
          className="rounded-[20px] p-8"
          style={{ background: "#13132A", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={v.title}>
                <div className="flex items-start gap-4 py-5">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] gradient-brand rounded-full" />
                    <div
                      className="w-[44px] h-[44px] rounded-full flex items-center justify-center mb-2 shrink-0"
                      style={{
                        background: "rgba(190,24,105,0.15)",
                        border: "1px solid rgba(190,24,105,0.3)",
                      }}
                    >
                      <Icon size={20} color="#BE1869" />
                    </div>
                    <h4 className="text-[16px] font-semibold" style={{ color: "white" }}>{v.title}</h4>
                    <p className="mt-1" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{v.desc}</p>
                  </div>
                </div>
                {i < values.length - 1 && <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeaser;
