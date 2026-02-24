import { motion } from "framer-motion";
import { Building2, BarChart3, Megaphone, Settings } from "lucide-react";
import { ArrowRight } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const roles = [
  {
    icon: Building2,
    accent: "337 74% 44%",
    title: "Soy CEO o Gerente General",
    text: "Quiero entender por qué no crecemos al ritmo que deberíamos y qué hay que cambiar en el sistema.",
  },
  {
    icon: BarChart3,
    accent: "263 70% 44%",
    title: "Soy Gerente o Director Comercial",
    text: "Necesito procesos claros, datos confiables, y un equipo que venda de manera consistente.",
  },
  {
    icon: Megaphone,
    accent: "175 73% 37%",
    title: "Soy responsable de Marketing",
    text: "Quiero que mis campañas generen pipeline real, no solo tráfico. Y que ventas lo reconozca.",
  },
  {
    icon: Settings,
    accent: "208 95% 44%",
    title: "Soy el responsable de Operaciones o CRM",
    text: "Sé lo que está mal. Necesito el diagnóstico externo que me ayude a conseguir el presupuesto para arreglarlo.",
  },
];

const RolesSolutions = () => {
  return (
    <section className="py-24 px-6" style={{ background: "#0D0D1A" }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.h2 {...fadeUp(0)} className="text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight" style={{ color: "white" }}>
          ¿Cuál es tu rol en la empresa?
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-4 text-center text-[18px] max-w-[520px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          El motor de ingresos le importa a todos, pero cada rol lo vive diferente.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                {...fadeUp(0.15 + i * 0.1)}
                className="group rounded-[20px] p-8 transition-all duration-[400ms] cursor-pointer hover:-translate-y-1.5"
                style={{
                  background: "#13132A",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                whileHover={{
                  borderColor: `hsl(${r.accent})`,
                  boxShadow: `0 8px 40px hsl(${r.accent} / 0.15)`,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `hsl(${r.accent} / 0.12)` }}>
                  <Icon size={22} style={{ color: `hsl(${r.accent})` }} />
                </div>
                <h4 className="text-[20px] font-bold mb-3" style={{ color: "white" }}>{r.title}</h4>
                <p className="text-[16px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>{r.text}</p>
                <span className="inline-flex items-center gap-2 text-[15px] font-medium transition-opacity group-hover:opacity-100 opacity-70"
                  style={{ color: `hsl(${r.accent})` }}>
                  Ver mi perspectiva <ArrowRight size={16} />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RolesSolutions;
