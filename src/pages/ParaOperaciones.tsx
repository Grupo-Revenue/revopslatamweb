import { motion } from "framer-motion";
import { Search, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } } };

const pains = [
  "Soy el único que sabe cómo funciona HubSpot. Si me voy, todo colapsa.",
  "Diseño procesos y workflows que nadie sigue. No sé si el problema es el diseño o la cultura.",
  "Paso el día resolviendo urgencias. Nunca puedo sentarme a mejorar el sistema de verdad.",
  "Los datos del CRM no son confiables. Cada área reporta un número distinto.",
  "Sé lo que hay que hacer pero no tengo cómo justificarlo para que me aprueben el tiempo y el presupuesto.",
];

const solutions = [
  {
    icon: Search,
    title: "Necesito entender qué está mal antes de proponer soluciones",
    text: "Diagnóstico del Motor de Ingresos. Un diagnóstico externo que mapea los huecos del sistema con datos — exactamente lo que necesitas para que te aprueben las mejoras que ya sabes que hay que hacer.",
    featured: false,
  },
  {
    icon: Settings,
    title: "Necesito que el CRM y las integraciones funcionen de verdad",
    text: "Implementación HubSpot e Integraciones. Configuramos el sistema para que los datos sean confiables, las automatizaciones funcionen, y tú dejes de ser el único que sabe cómo está conectado todo.",
    featured: true,
  },
  {
    icon: RefreshCw,
    title: "Necesito un socio que comparta la carga operativa mes a mes",
    text: "RevOps as a Service. Acompañamiento continuo para que la operación no dependa solo de ti y el sistema siga mejorando sin que tengas que hacerlo todo solo.",
    featured: false,
  },
];

const ParaOperaciones = () => (
  <>
    <Navbar />
    <main className="bg-dark-bg text-foreground">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--pink)/0.12),transparent_70%)]" />
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-pink/30 bg-pink/10 text-pink text-xs font-semibold tracking-wide uppercase">
            Para los que operan el negocio sin el título
          </motion.span>
          <motion.h1 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Tú no eres el encargado de operaciones.{" "}
            <span className="text-pink">Eres el que resuelve lo que nadie más sabe resolver.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Configuras el CRM, armas los reportes, conectas las herramientas, defines los procesos. Sin un título formal, sin presupuesto propio, y con la presión de que si algo falla, es tu problema. Eso tiene nombre: es Revenue Operations. Y merece una estrategia.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Descubre cómo ordenar tu operación →</Button>
            <Button size="lg" variant="secondary">Agendar conversación</Button>
          </motion.div>
        </div>
      </section>

      {/* ── DESAFÍO ── */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-8 text-center">
            El problema no es que no sepas lo que hay que hacer.{" "}
            <span className="text-pink">Es que lo estás haciendo solo, sin respaldo y sin tiempo.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed text-center">
            Sabes exactamente qué está mal. Ves los huecos en el proceso, los datos que no cuadran, los workflows que nadie sigue. Pero entre apagar incendios, atender urgencias y mantener todo funcionando, nunca hay tiempo para mejorar el sistema de verdad. Y cuando propones cambios, nadie los prioriza porque no hay un número que justifique la inversión.
          </motion.p>
        </div>
      </section>

      {/* ── DOLORES ── */}
      <section className="py-20 md:py-28 bg-dark-card/40">
        <div className="container max-w-5xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold text-center mb-14">
            ¿Alguna de estas frases la dijiste tú esta semana?
          </motion.h2>
          <div className="grid gap-5 md:grid-cols-2">
            {pains.map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`relative rounded-xl border border-pink/10 bg-dark-card p-6 pl-8 ${i === 4 ? "md:col-span-2 md:max-w-xl md:mx-auto" : ""}`}>
                <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-pink/60" />
                <p className="text-sm md:text-base text-muted-foreground italic">"{p}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PUENTE ── */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl mx-auto px-6 space-y-8">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center">
            Una pista de Imánix no puede depender de una sola persona{" "}
            <span className="text-pink">para funcionar.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed">
            En una pista bien diseñada, cada pieza funciona por sí sola — no porque alguien la esté sosteniendo manualmente. Cuando una persona concentra todo el conocimiento operativo de la empresa, la pista no está diseñada: está improvisada. Y una pista improvisada no escala.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed">
            RevOps LATAM no viene a reemplazarte. Viene a darte lo que nunca tuviste: una metodología clara, procesos documentados que el equipo realmente sigue, y un sistema que funciona aunque no estés mirando. Para que dejes de ser el héroe que apaga incendios y te conviertas en el arquitecto de una operación que crece sola.
          </motion.p>
        </div>
      </section>

      {/* ── SOLUCIONES ── */}
      <section className="py-20 md:py-28 bg-dark-card/40">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold text-center mb-14">
            El punto de entrada depende de tu situación hoy.
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`rounded-2xl p-8 flex flex-col gap-4 border ${s.featured ? "border-pink/40 bg-pink/5 shadow-[0_0_40px_hsl(var(--pink)/0.10)]" : "border-border/30 bg-dark-card"}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.featured ? "bg-pink/20 text-pink" : "bg-muted text-muted-foreground"}`}>
                  <s.icon size={24} />
                </div>
                <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--pink)/0.10),transparent_70%)]" />
        <div className="container max-w-3xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
            Lo que haces tiene más valor del que te reconocen.{" "}
            <span className="text-pink">Es hora de construirlo sobre bases sólidas.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto">
            El Pulso Comercial te muestra en 5 minutos el estado real de tu operación — y te da el lenguaje y los datos para proponer mejoras que esta vez sí se aprueben.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col items-center gap-4">
            <Button size="lg">Hacer el Pulso Comercial →</Button>
            <a href="#" className="text-sm text-muted-foreground hover:text-pink transition-colors">
              Prefiero hablar directo → <span className="underline">Agendar conversación</span>
            </a>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ParaOperaciones;
