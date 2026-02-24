import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, Monitor, BarChart3, UserRound } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const symptoms = [
  {
    icon: TrendingUp,
    accent: "337 74% 44%",
    title: "Crecimos, pero el caos creció más.",
    text: "Más clientes, más vendedores, más herramientas. Y sin embargo, cada mes es más difícil predecir, controlar y escalar.",
  },
  {
    icon: MessageSquare,
    accent: "263 70% 44%",
    title: "Marketing y ventas no se hablan.",
    text: "Cada equipo tiene sus métricas, su versión de la realidad y su lista de culpables. Mientras tanto, los leads se enfrían.",
  },
  {
    icon: Monitor,
    accent: "208 95% 44%",
    title: "Tenemos HubSpot pero no lo usamos bien.",
    text: "Pagaste la licencia, alguien lo configuró, y hoy es básicamente un Excel con login. El potencial está ahí. El uso, no.",
  },
  {
    icon: BarChart3,
    accent: "42 93% 54%",
    title: "No puedo predecir el cierre de mes.",
    text: "Tu forecast es más una intuición que una proyección. El directorio pregunta. Tú adivinas. Eso no escala.",
  },
  {
    icon: UserRound,
    accent: "175 73% 37%",
    title: "Contraté un Gerente Comercial y sigue el caos.",
    text: "Buena persona, buen perfil. Pero sin procesos claros ni datos confiables, hasta el mejor Gerente Comercial opera a ciegas.",
  },
];

const Symptoms = () => {
  return (
    <section className="relative py-24 px-6" style={{ background: "#0D0D1A" }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="text-center text-[13px] font-semibold tracking-[0.15em] uppercase"
          style={{ color: "hsl(337 74% 44%)" }}
        >
          ¿Te suena familiar?
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-4 text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight max-w-[700px] mx-auto"
          style={{ color: "hsl(0 0% 100%)" }}
        >
          Si diriges una empresa que ya creció, probablemente reconoces esto.
        </motion.h2>

        {/* Cards grid */}
        {/* First row: 3 cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.slice(0, 3).map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.15 + i * 0.1)}
                className="group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#13132A",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid hsl(${s.accent})`,
                }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderLeftColor: `hsl(${s.accent})`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: `hsl(${s.accent} / 0.12)` }}
                >
                  <Icon size={20} style={{ color: `hsl(${s.accent})` }} />
                </div>
                <h4
                  className="text-[18px] font-semibold mb-3"
                  style={{ color: "hsl(0 0% 100%)" }}
                >
                  {s.title}
                </h4>
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {s.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Second row: 2 cards centered */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[calc(66.666%+0.75rem)] mx-auto lg:max-w-[calc(66.666%+0.75rem)]">
          {symptoms.slice(3).map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i + 3}
                {...fadeUp(0.45 + i * 0.1)}
                className="group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#13132A",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid hsl(${s.accent})`,
                }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderLeftColor: `hsl(${s.accent})`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: `hsl(${s.accent} / 0.12)` }}
                >
                  <Icon size={20} style={{ color: `hsl(${s.accent})` }} />
                </div>
                <h4
                  className="text-[18px] font-semibold mb-3"
                  style={{ color: "hsl(0 0% 100%)" }}
                >
                  {s.title}
                </h4>
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {s.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Closing box */}
        <motion.div
          {...fadeUp(0.7)}
          className="mt-14 mx-auto max-w-[700px] text-center rounded-xl px-10 py-6"
          style={{
            background: "rgba(190,24,105,0.08)",
            border: "1px solid rgba(190,24,105,0.2)",
          }}
        >
          <p className="text-[18px] leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Si reconociste al menos dos de estas situaciones, no tenés un problema de talento ni de herramientas.{" "}
            <strong>Tenés una pista mal armada.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Symptoms;
