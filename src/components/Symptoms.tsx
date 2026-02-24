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
    accent: "#BE1869",
    title: "Crecimos, pero el caos creció más.",
    text: "Más clientes, más vendedores, más herramientas. Y sin embargo, cada mes es más difícil predecir, controlar y escalar.",
  },
  {
    icon: MessageSquare,
    accent: "#6224BE",
    title: "Marketing y ventas no se hablan.",
    text: "Cada equipo tiene sus métricas, su versión de la realidad y su lista de culpables. Mientras tanto, los leads se enfrían.",
  },
  {
    icon: Monitor,
    accent: "#0779D7",
    title: "Tienes HubSpot pero no lo usas bien.",
    text: "Pagaste la licencia, alguien lo configuró, y hoy es básicamente un Excel con login. El potencial está ahí. El uso, no.",
  },
  {
    icon: BarChart3,
    accent: "#F7BE1A",
    title: "No puedes predecir el cierre de mes.",
    text: "Tu forecast es más una intuición que una proyección. El directorio pregunta. Tú adivinas. Eso no escala.",
  },
  {
    icon: UserRound,
    accent: "#1CA398",
    title: "Contrataste un Gerente Comercial y sigue el caos.",
    text: "Buena persona, buen perfil. Pero sin procesos claros ni datos confiables, hasta el mejor Gerente Comercial opera a ciegas.",
  },
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const SymptomCard = ({ s, i, delay }: { s: typeof symptoms[0]; i: number; delay: number }) => {
  const Icon = s.icon;
  return (
    <motion.div
      key={i}
      {...fadeUp(delay)}
      className="group rounded-2xl p-8 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderLeft: `4px solid ${s.accent}`,
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 12px 40px ${hexToRgba(s.accent, 0.15)}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
        style={{ background: hexToRgba(s.accent, 0.12) }}
      >
        <Icon size={20} style={{ color: s.accent }} />
      </div>
      <h4
        className="mb-3"
        style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A2E", lineHeight: 1.3 }}
      >
        {s.title}
      </h4>
      <p style={{ fontSize: "15px", color: "#6B7280", lineHeight: 1.6 }}>
        {s.text}
      </p>
    </motion.div>
  );
};

const Symptoms = () => {
  return (
    <section className="relative py-24 px-6" style={{ background: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="text-center font-semibold tracking-[0.15em] uppercase"
          style={{ color: "#BE1869", fontSize: "13px" }}
        >
          ¿Te suena familiar?
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-4 text-center text-[28px] md:text-[40px] leading-[1.2] tracking-tight max-w-[680px] mx-auto"
          style={{ color: "#1A1A2E", fontWeight: 700 }}
        >
          Si diriges una empresa que ya creció, probablemente reconoces esto.
        </motion.h2>

        {/* Cards: 3 top */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.slice(0, 3).map((s, i) => (
            <SymptomCard key={i} s={s} i={i} delay={0.15 + i * 0.1} />
          ))}
        </div>

        {/* Cards: 2 bottom centered */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[calc(66.666%+0.75rem)] mx-auto">
          {symptoms.slice(3).map((s, i) => (
            <SymptomCard key={i + 3} s={s} i={i + 3} delay={0.45 + i * 0.1} />
          ))}
        </div>

        {/* Closing box — gradient brand */}
        <motion.div
          {...fadeUp(0.7)}
          className="mt-14 mx-auto max-w-[720px] text-center"
          style={{
            background: "linear-gradient(135deg, #BE1869 0%, #6224BE 100%)",
            borderRadius: "16px",
            padding: "32px 48px",
            boxShadow: "0 8px 32px rgba(190,24,105,0.3)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px", lineHeight: 1.6 }}>
            Si reconociste al menos dos de estas situaciones, no tienes un problema de talento ni de herramientas.
          </p>
          <p className="mt-3" style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 700, lineHeight: 1.3 }}>
            Tienes una pista mal armada.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Symptoms;
