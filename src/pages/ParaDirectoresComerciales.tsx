import { motion } from "framer-motion";
import { ArrowRight, Search, Settings, RefreshCw } from "lucide-react";
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
  "Heredé un equipo donde cada vendedor hace lo que quiere. No hay proceso, no hay estándar.",
  "El CRM es un desastre. No puedo confiar en los datos para tomar decisiones.",
  "Sé que hay oportunidades que estamos perdiendo. No tengo los datos para probar cuáles ni cuánto.",
  "Le pido forecast a mi equipo y cada uno me da un número distinto.",
  "Sé exactamente qué está mal. El problema es que no tengo cómo probarlo con datos.",
];

const soluciones = [
  {
    icon: Search,
    title: "Necesito entender exactamente dónde están los huecos",
    text: "Diagnóstico del Motor de Ingresos. En 3 semanas tienes un mapa claro de dónde está rota la operación comercial y qué priorizar primero.",
    accent: "pink",
    highlighted: false,
  },
  {
    icon: Settings,
    title: "Necesito que el CRM funcione y el equipo lo use",
    text: "Implementación HubSpot CRM. Configuramos tu CRM para que los datos sean confiables, el equipo lo adopte, y puedas liderar con visibilidad real.",
    accent: "purple",
    highlighted: true,
  },
  {
    icon: RefreshCw,
    title: "Necesito soporte continuo para que las mejoras se mantengan",
    text: "RevOps as a Service. Acompañamiento mes a mes para que la operación no dependa solo de ti y el sistema siga mejorando.",
    accent: "blue",
    highlighted: false,
  },
];

const ParaDirectoresComerciales = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-primary-foreground">
      <Navbar />

      {/* ── SECCIÓN 1: HERO ── */}
      <section className="relative pt-32 pb-24 px-6 gradient-hero overflow-hidden">
        <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -120, right: -200, background: "radial-gradient(circle, hsl(337 74% 44% / 0.15) 0%, transparent 70%)", filter: "blur(140px)" }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -100, left: -150, background: "radial-gradient(circle, hsl(263 70% 44% / 0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <motion.span {...fadeUp(0)} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-pink/30 text-pink mb-8">
            Para Directores Comerciales y Head of Sales
          </motion.span>

          <motion.h1 {...fadeUp(0.1)} className="text-hero font-bold leading-[1.08] tracking-tight">
            Tienes claridad sobre qué hay que hacer. El problema es que no tienes el sistema para hacerlo.
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[640px] mx-auto">
            Liderar un equipo comercial sin datos confiables, sin procesos estandarizados y sin un CRM que funcione no es un problema de liderazgo. Es un problema de operación. Y tiene solución.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              Descubre dónde está rota tu operación <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary">
              Agendar conversación
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── SECCIÓN 2: EL DESAFÍO ── */}
      <section className="py-24 px-6 bg-dark-card">
        <div className="max-w-[780px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight text-center">
            La mayoría de los Directores Comerciales que llegan a nosotros no fallaron en su trabajo. Fallaron las condiciones en las que tuvieron que{" "}
            <span className="text-gradient-brand">trabajar.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="mt-8 text-lg leading-relaxed text-muted-foreground text-center">
            Heredaron un equipo sin procesos claros. Un CRM mal configurado o directamente vacío. Vendedores que cada uno hace lo suyo. Y encima, la presión de demostrar resultados. No es falta de talento — es falta de pista.
          </motion.p>
        </div>
      </section>

      {/* ── SECCIÓN 3: DOLORES ── */}
      <section className="py-24 px-6 bg-dark-bg">
        <div className="max-w-[800px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14">
            ¿Alguna de estas frases te suena familiar?
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
      <section className="py-24 px-6 bg-dark-card">
        <div className="max-w-[780px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight text-center mb-10">
            Sin una pista bien diseñada, hasta el mejor equipo comercial{" "}
            <span className="text-gradient-brand">pierde.</span>
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            El revenue de una empresa fluye como una pelotita en una pista de Imánix. Cada pieza del sistema — marketing, ventas, CRM, automatizaciones, procesos — tiene que estar conectada para que la pelotita llegue a la meta. Si hay huecos, la pelotita se cae. Y tú terminas explicando por qué no se llegó al número.
          </motion.p>
          <motion.p {...fadeUp(0.15)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            Un Director Comercial extraordinario con una pista rota sigue perdiendo deals. No porque no sepa vender — sino porque el sistema no le da las condiciones para ganar.
          </motion.p>
          <motion.p {...fadeUp(0.2)} className="text-lg leading-relaxed text-muted-foreground">
            RevOps LATAM diseña y conecta las piezas que faltan. Para que puedas liderar con datos reales, procesos que el equipo realmente sigue, y un forecast en el que todos confíen.
          </motion.p>
        </div>
      </section>

      {/* ── SECCIÓN 5: CÓMO TE AYUDAMOS ── */}
      <section className="py-24 px-6 bg-dark-bg">
        <div className="max-w-[1100px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14">
            El punto de entrada depende de tu situación hoy.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {soluciones.map((s, i) => {
              const Icon = s.icon;
              const hue = s.accent === "pink" ? "337 74% 44%" : s.accent === "purple" ? "263 70% 44%" : "208 95% 44%";
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
                    style={{ background: `hsl(${hue} / 0.12)` }}
                  >
                    <Icon size={22} style={{ color: `hsl(${hue})` }} />
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
            Tu operación comercial no puede seguir dependiendo de la intuición.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 text-lg leading-relaxed text-muted-foreground">
            El Pulso Comercial te dice en 5 minutos cuál es el estado real de tu operación — y qué deberías priorizar primero para dejar de adivinar y empezar a liderar con datos.
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

export default ParaDirectoresComerciales;
