import { motion } from "framer-motion";
import { ArrowRight, Search, Settings, BarChart3 } from "lucide-react";
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
  "Entrego leads y ventas dice que no sirven. Pero nadie me dice exactamente qué es un buen lead.",
  "Tenemos HubSpot pero marketing y ventas lo usan de formas completamente distintas.",
  "No puedo demostrar el ROI de marketing porque no tenemos trazabilidad desde el lead hasta el cierre.",
  "Armé flujos de nurturing que nadie revisa. Los leads se enfrían antes de llegar a ventas.",
  "Genero demanda pero no tengo visibilidad de qué pasa después de que el lead pasa a ventas.",
];

const soluciones = [
  {
    icon: Search,
    title: "No tengo claridad de dónde se rompe el flujo entre marketing y ventas",
    text: "Diagnóstico del Motor de Ingresos. Identificamos exactamente dónde se cae la pelotita entre tus equipos y qué hay que hacer primero para cerrar ese hueco.",
    highlighted: false,
    hue: "337 74% 44%",
  },
  {
    icon: Settings,
    title: "Necesito que HubSpot funcione igual para marketing y ventas",
    text: "Marketing Ops. Configuramos y conectamos tu stack para que ambos equipos trabajen con los mismos datos, los mismos criterios y la misma visibilidad.",
    highlighted: true,
    hue: "263 70% 44%",
  },
  {
    icon: BarChart3,
    title: "Necesito demostrar el ROI de marketing con datos reales",
    text: "RevOps as a Service. Construimos la trazabilidad completa desde el primer clic hasta el cierre — para que marketing deje de justificarse y empiece a demostrar resultados.",
    highlighted: false,
    hue: "208 95% 44%",
  },
];

const ParaMarketingDirectors = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-primary-foreground">
      <Navbar />

      {/* ── SECCIÓN 1: HERO ── */}
      <section className="relative pt-32 pb-24 px-6 gradient-hero overflow-hidden">
        <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -120, right: -200, background: "radial-gradient(circle, hsl(337 74% 44% / 0.15) 0%, transparent 70%)", filter: "blur(140px)" }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -100, left: -150, background: "radial-gradient(circle, hsl(263 70% 44% / 0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <motion.span {...fadeUp(0)} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-pink/30 text-pink mb-8">
            Para Directores y Gerentes de Marketing
          </motion.span>

          <motion.h1 {...fadeUp(0.1)} className="text-hero font-bold leading-[1.08] tracking-tight">
            Generas leads. Ventas dice que son malos. Y tú sabes que el problema no es solo tuyo.
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[640px] mx-auto">
            Invertiste en campañas, en automatizaciones, en contenido. Los números de marketing se ven bien. Pero cuando el lead llega a ventas, algo se rompe — y siempre termina siendo culpa de marketing.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              Descubre dónde se rompe tu flujo <ArrowRight size={18} />
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
            El problema no es la calidad de tus leads. Es que marketing y ventas operan como dos{" "}
            <span className="text-gradient-brand">empresas distintas.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="mt-8 text-lg leading-relaxed text-muted-foreground text-center">
            Sin criterios claros de qué es un lead calificado, sin SLAs definidos entre equipos, sin datos compartidos — marketing optimiza para una métrica y ventas trabaja con otra. La pelotita pasa de un equipo al otro y nadie sabe exactamente dónde se cae. Hasta que llega fin de mes y todos se culpan mutuamente.
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
      <section className="py-24 px-6" style={{ background: "hsl(240 33% 6%)" }}>
        <div className="max-w-[780px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-section font-bold leading-[1.15] tracking-tight text-center mb-10">
            Marketing no termina cuando el lead llega a ventas. Termina cuando ese lead se convierte en{" "}
            <span className="text-gradient-brand">revenue.</span>
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            En una pista de Imánix bien diseñada, marketing y ventas no son dos equipos separados — son dos piezas del mismo sistema. Cuando están desconectadas, la pelotita se cae exactamente en el punto de traspaso. Ese hueco invisible entre equipos es donde se pierde la mayoría del revenue.
          </motion.p>
          <motion.p {...fadeUp(0.15)} className="text-lg leading-relaxed text-muted-foreground mb-6">
            RevOps LATAM conecta esas piezas. Definimos juntos qué es un MQL y un SQL, establecemos SLAs entre equipos, construimos la trazabilidad que necesitas para demostrar el impacto real de marketing — y eliminamos el hueco donde los leads se pierden.
          </motion.p>
          <motion.p {...fadeUp(0.2)} className="text-lg leading-relaxed text-muted-foreground">
            Resultado: marketing deja de ser el culpable de turno y se convierte en el motor que impulsa el revenue de toda la empresa.
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
                    style={{ background: `hsl(${s.hue} / 0.12)` }}
                  >
                    <Icon size={22} style={{ color: `hsl(${s.hue})` }} />
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
            Deja de defender tu trabajo. Empieza a demostrarlo con datos.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 text-lg leading-relaxed text-muted-foreground">
            El Pulso Comercial te muestra en 5 minutos dónde está roto el flujo entre marketing y ventas — y qué priorizar para cerrar ese hueco de una vez.
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

export default ParaMarketingDirectors;
