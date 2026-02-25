import { motion } from "framer-motion";
import { Search, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } } };

const pains = [
  "Resolvemos problemas todo el día pero nadie mide el impacto de lo que hacemos en el negocio.",
  "Cuando un cliente se va, me entero por ventas o por facturación — no porque tengamos un sistema de alertas.",
  "Tenemos el CRM lleno de tickets pero no hay visibilidad de qué clientes están en riesgo.",
  "Marketing y ventas están integrados en HubSpot. Nosotros seguimos trabajando en una herramienta aparte.",
  "Sabemos que hay oportunidades de upsell en la base de clientes. No tenemos cómo identificarlas ni actuar a tiempo.",
];

const solutions = [
  {
    icon: Search,
    title: "No tengo visibilidad de qué clientes están en riesgo ni por qué se van",
    text: "Diagnóstico del Motor de Ingresos. Identificamos los huecos en la postventa y cómo conectar tu operación al sistema de revenue completo.",
    featured: false,
  },
  {
    icon: Settings,
    title: "Necesito integrar mi área al CRM y tener datos confiables",
    text: "Implementación HubSpot CRM. Conectamos tu operación de CS al mismo sistema que usan marketing y ventas — para que todos hablen con los mismos datos.",
    featured: true,
  },
  {
    icon: RefreshCw,
    title: "Necesito un sistema continuo que me permita anticipar churn y detectar expansión",
    text: "RevOps as a Service. Construimos y operamos los procesos que convierten tu área en un motor de retención y expansión medible, mes a mes.",
    featured: false,
  },
];

const ParaCustomerSuccess = () => (
  <>
    <Navbar />
    <main className="bg-dark-bg text-foreground">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--pink)/0.12),transparent_70%)]" />
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-pink/30 bg-pink/10 text-pink text-xs font-semibold tracking-wide uppercase">
            Para Customer Success y Servicio al Cliente
          </motion.span>
          <motion.h1 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Tu equipo retiene clientes, resuelve problemas y evita churn.{" "}
            <span className="text-pink">Y aun así, nadie lo cuenta como revenue.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            El área que más sabe del cliente es la que menos visibilidad tiene en la estrategia comercial. No porque no genere valor — sino porque nadie construyó el sistema para medirlo y demostrarlo.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Descubre cómo conectar tu área al motor de ingresos →</Button>
            <Button size="lg" variant="secondary">Agendar conversación</Button>
          </motion.div>
        </div>
      </section>

      {/* ── DESAFÍO ── */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-8 text-center">
            Servicio al cliente no es un centro de costo.{" "}
            <span className="text-pink">Es la parte del motor de ingresos que más se ignora.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed text-center">
            Cada cliente que se va es revenue perdido. Cada cliente que se queda y expande es revenue ganado. Cada problema resuelto a tiempo es una renovación asegurada. Pero si ese impacto no está medido, no existe para el negocio. Y sin datos, tu área siempre va a pelear por presupuesto contra equipos que sí saben mostrar sus números.
          </motion.p>
        </div>
      </section>

      {/* ── DOLORES ── */}
      <section className="py-20 md:py-28 bg-dark-card/40">
        <div className="container max-w-5xl mx-auto px-6">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold text-center mb-14">
            ¿Alguna de estas frases te suena familiar?
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
            La pelotita no termina su recorrido cuando el cliente firma.{" "}
            <span className="text-pink">Ahí empieza la segunda mitad de la pista.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed">
            En una pista de Imánix bien diseñada, la pelotita fluye desde el primer contacto hasta el revenue — y eso incluye la postventa. Si el tramo de Customer Success está desconectado del resto del sistema, la pelotita llega a la meta una vez pero no vuelve a rodar. El churn no es un problema de atención al cliente. Es un problema de pista mal diseñada.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed">
            RevOps LATAM conecta tu área al motor de ingresos completo. Integramos tu operación de CS al CRM, construimos los indicadores que demuestran tu impacto real, y diseñamos los procesos que te permiten anticipar el churn antes de que ocurra — y actuar sobre las oportunidades de expansión antes de que se enfríen.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg leading-relaxed font-semibold text-foreground">
            Resultado: tu área deja de ser invisible para el negocio y se convierte en una parte medible y estratégica del revenue.
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
            Tu área genera más revenue del que te reconocen.{" "}
            <span className="text-pink">Es hora de demostrarlo.</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-muted-foreground text-base md:text-lg mb-10 max-w-2xl mx-auto">
            El Pulso Comercial te muestra en 5 minutos cómo está conectada tu operación de CS al motor de ingresos — y qué priorizar para dejar de ser invisible en la estrategia comercial.
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

export default ParaCustomerSuccess;
