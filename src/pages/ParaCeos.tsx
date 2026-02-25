import { motion } from "framer-motion";
import { ArrowRight, Search, Settings, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const dolores = [
  "Contraté un Gerente Comercial y el caos sigue igual.",
  "No puedo predecir el cierre de mes con confianza.",
  "Marketing y Ventas se culpan mutuamente. Los leads se pierden en el medio.",
  "Invertimos en HubSpot hace dos años y no sabemos si está sirviendo para algo.",
  "Crecemos, pero siento que deberíamos crecer más. Algo está trabado y no sé qué.",
];

const soluciones = [
  {
    icon: Search,
    title: "No sé exactamente qué está mal",
    text: "Empieza con el Diagnóstico del Motor de Ingresos. En 3 semanas tienes claridad total sobre dónde está rota tu pista y qué priorizar primero.",
    accent: "var(--pink)",
    highlighted: false,
  },
  {
    icon: Settings,
    title: "Sé lo que está mal, necesito quien lo opere",
    text: "RevOps as a Service. Tu motor de ingresos operado por expertos, mes a mes. Revenue predecible sin contratar un equipo interno.",
    accent: "var(--purple)",
    highlighted: true,
  },
  {
    icon: Rocket,
    title: "Mi operación ya funciona, quiero escalarla",
    text: "IA para tu Motor de Ingresos. Cuando la pista está bien armada, la automatizamos para que crezca sola.",
    accent: "var(--blue)",
    highlighted: false,
  },
];

const ParaCeos = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-primary-foreground">
      <Navbar />

      {/* ── SECCIÓN 1: HERO ── */}
      <section className="relative pt-32 pb-24 px-6 gradient-hero overflow-hidden">
        <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -120, right: -200, background: "radial-gradient(circle, hsl(337 74% 44% / 0.15) 0%, transparent 70%)", filter: "blur(140px)" }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -100, left: -150, background: "radial-gradient(circle, hsl(263 70% 44% / 0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <motion.span {...fadeUp(0)} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-pink/30 text-pink mb-8">
            Para CEOs y Gerentes Generales
          </motion.span>

          <motion.h1 {...fadeUp(0.1)} className="text-hero font-bold leading-[1.08] tracking-tight">
            Lo que te trajo hasta aquí no es lo que te lleva al siguiente nivel.
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[640px] mx-auto">
            Construiste una empresa que creció. Eso no es poca cosa. Pero en algún punto el sistema que funcionó dejó de alcanzar — y seguir haciendo lo mismo con más fuerza no está resolviendo nada.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              Descubre dónde está trabado tu motor <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary">
              Agendar conversación
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── SECCIÓN 2: EL DESAFÍO ── */}
      <section className="py-24 px-6" style={{ background: "hsl(240 33% 6%)" }}>
        <div className="max-w-[780px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight text-center">
            La mayoría de los CEOs y Gerentes Generales que llegan a nosotros no tienen un problema de talento. Tienen un problema de{" "}
            <span className="text-gradient-brand">sistema.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="mt-8 text-lg leading-relaxed text-muted-foreground text-center">
            Contrataron buenos vendedores. Implementaron HubSpot. Pusieron un Gerente Comercial. Y el caos siguió. No porque las decisiones fueran malas — sino porque pusieron piezas nuevas en una pista que nunca estuvo bien diseñada.
          </motion.p>
        </div>
      </section>

      {/* ── SECCIÓN 3: DOLORES ── */}
      <section className="py-24 px-6 bg-dark-bg">
        <div className="max-w-[800px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14">
            ¿Alguna de estas frases la dijiste tú esta semana?
          </motion.h2>

          <div className="space-y-5">
            {dolores.map((d, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className="relative rounded-2xl p-6 md:p-8 border border-pink/10 bg-dark-card"
                style={{ boxShadow: "0 0 30px hsl(337 74% 44% / 0.04)" }}
              >
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-pink" />
                <p className="text-base md:text-lg font-medium leading-relaxed italic text-primary-foreground/90">
                  "{d}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: EL PUENTE ── */}
      <section className="py-24 px-6" style={{ background: "hsl(240 33% 6%)" }}>
        <div className="max-w-[780px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight text-center mb-10">
            El problema no es tu equipo. Es la{" "}
            <span className="text-gradient-brand">pista</span> donde están corriendo.
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            Imagina que construiste una pista de Imánix — esa donde una pelotita debe fluir desde el primer contacto hasta convertirse en revenue. Marketing, ventas, CRM, automatizaciones, procesos: cada uno es una pieza. Si las piezas no encajan, la pelotita se cae. No importa cuán buena sea la pelotita.
          </motion.p>
          <motion.p {...fadeUp(0.15)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            Eso es lo que le pasa a la mayoría de las empresas en crecimiento. No les falta talento ni voluntad. Les falta una pista bien diseñada.
          </motion.p>
          <motion.p {...fadeUp(0.2)} className="text-lg leading-relaxed text-muted-foreground">
            RevOps LATAM no viene a mejorar una pieza. Viene a ordenar y conectar el sistema completo para que el revenue fluya sin fricción — predecible, escalable, sin depender de héroes individuales.
          </motion.p>
        </div>
      </section>

      {/* ── SECCIÓN 5: CÓMO TE AYUDAMOS ── */}
      <section className="py-24 px-6 bg-dark-bg">
        <div className="max-w-[1100px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14">
            Dependiendo de dónde estés, el primer paso es distinto.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {soluciones.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  {...fadeUp(0.1 + i * 0.1)}
                  className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                    s.highlighted
                      ? "border-purple/40 bg-dark-card shadow-[0_0_60px_hsl(263_70%_44%/0.12)]"
                      : "border-primary-foreground/10 bg-dark-card"
                  }`}
                >
                  {s.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest gradient-brand text-primary-foreground">
                      Más popular
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `hsl(${s.highlighted ? "263 70% 44%" : s.accent === "var(--pink)" ? "337 74% 44%" : "208 95% 44%"} / 0.12)` }}
                  >
                    <Icon size={22} style={{ color: `hsl(${s.highlighted ? "263 70% 44%" : s.accent === "var(--pink)" ? "337 74% 44%" : "208 95% 44%"})` }} />
                  </div>
                  <h4 className="text-lg font-bold mb-3">{s.title}</h4>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: CTA FINAL ── */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(337 74% 44% / 0.15) 0%, hsl(263 70% 44% / 0.1) 50%, hsl(240 33% 8%) 100%)" }}>
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: -80, left: -150, background: "radial-gradient(circle, hsl(337 74% 44% / 0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

        <div className="relative z-10 max-w-[640px] mx-auto text-center">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight">
            El primer paso es entender dónde está tu pista hoy.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 text-lg leading-relaxed text-muted-foreground">
            El Pulso Comercial es un diagnóstico gratuito de 5 minutos. Sin compromiso, sin pitch. Solo claridad.
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="mt-10 flex flex-col items-center gap-4">
            <Button size="lg" className="gap-2">
              Hacer el Pulso Comercial <ArrowRight size={18} />
            </Button>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-pink transition-colors">
              Prefiero hablar directo → Agendar conversación
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ParaCeos;
