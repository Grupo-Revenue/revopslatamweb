import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, X, Cog, Megaphone, Wrench, Handshake, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import SectionHeading from "@/components/services/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import ForWhomSection from "@/components/services/ForWhomSection";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import WaveDivider from "@/components/services/WaveDivider";
import GradientIcon from "@/components/services/GradientIcon";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

/* ═══ Hero Funnel ═══ */
const funnelLevels = [
  { label: "Leads captados", count: 4200, width: "100%" },
  { label: "Leads nutridos", count: 1860, width: "78%" },
  { label: "MQLs calificados", count: 620, width: "52%" },
  { label: "Entregados a ventas ✓", count: 310, width: "36%" },
];

const HeroFunnel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative backdrop-blur-sm"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "32px 28px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div className="space-y-3">
        {funnelLevels.map((lvl, i) => (
          <FunnelLevel key={lvl.label} lvl={lvl} i={i} inView={inView} isLast={i === 3} />
        ))}
      </div>
      <motion.div
        className="absolute right-4 flex items-center gap-2"
        style={{ top: "22%" }}
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <span className="text-[11px] text-red-400/70 italic whitespace-nowrap">Sin nurturing → se pierden</span>
        <X size={14} style={{ color: "rgba(239,68,68,0.5)" }} />
      </motion.div>
    </motion.div>
  );
};

const FunnelLevel = ({ lvl, i, inView, isLast }: { lvl: (typeof funnelLevels)[0]; i: number; inView: boolean; isLast: boolean }) => {
  const count = useAnimatedCounter(lvl.count, 1500, inView);
  const opacities = [0.35, 0.5, 0.65, 1];

  return (
    <motion.div className="mx-auto relative" style={{ width: lvl.width }} initial={{ opacity: 0, y: -16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.3, duration: 0.5 }}>
      <div className="relative rounded-xl px-5 py-4 flex items-center justify-between" style={{ background: `linear-gradient(135deg, rgba(190,24,105,${opacities[i]}), rgba(98,36,190,${opacities[i]}))` }}>
        <span className="text-white text-sm font-medium">{lvl.label}</span>
        <span className="text-white text-lg font-bold tabular-nums">{Number(count).toLocaleString()}</span>
      </div>
      {isLast && (
        <motion.span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wide text-white px-3 py-1 rounded-full whitespace-nowrap" style={{ background: GRADIENT }} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.6, duration: 0.4 }}>
          Alineado con ventas ✓
        </motion.span>
      )}
    </motion.div>
  );
};

/* ═══ Operations Grid ═══ */
const opsItems = [
  { emoji: "⚙️", title: "Automatizaciones de marketing", desc: "Workflows de nurturing, lead scoring, asignación automática. Los leads no se enfríen esperando atención manual." },
  { emoji: "📣", title: "Gestión de campañas", desc: "Pauta en buscadores y redes operada por alguien que entiende el CRM, no solo las plataformas." },
  { emoji: "🔧", title: "Marketing Hub activo", desc: "Formularios, emails, secuencias, listas y segmentación. Que la herramienta trabaje, no solo exista." },
  { emoji: "🤝", title: "Alineación marketing-ventas", desc: "Definición de MQL, protocolo de handoff y seguimiento de leads hasta el cierre." },
  { emoji: "📊", title: "Reportería integrada", desc: "Métricas conectadas con pipeline. No solo impresiones — cuánto de lo invertido terminó en revenue." },
];

/* ═══ PAGE ═══ */
const MarketingOps = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <ServiceHero
        breadcrumbs={[
          { label: "Opera tu pista", to: "/opera-tu-pista" },
          { label: "Marketing Ops" },
        ]}
        badge="Operación, no agencia"
        badgeStyle={{ background: "rgba(255,122,89,0.15)", color: ACCENT }}
        title="Tu operación de marketing funcionando, no solo planificada"
        subtitle="Automatizaciones activas, campañas que se miden, leads que llegan a ventas en el momento correcto. El músculo que la mayoría necesita pero pocos tienen internamente."
        primaryCta={{ label: "Cuéntanos cómo está tu marketing →" }}
        secondaryCta={{ label: "¿Es este el servicio correcto? ↓", onClick: () => document.getElementById("problema")?.scrollIntoView({ behavior: "smooth" }) }}
        rightContent={<HeroFunnel />}
        minHeight="85vh"
      />

      <WaveDivider fromColor="#1A1A2E" toColor="#ffffff" />

      {/* S2: El Problema */}
      <ProblemSection />

      <SectionDivider />

      {/* S3: Lo que operamos */}
      <section className="relative overflow-hidden" style={{ background: "#1A1A2E", padding: "120px 0" }}>
        <BackgroundOrbs variant="section" />
        <NoiseOverlay opacity={0.03} />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <SectionHeading title="Lo que operamos" light highlightWord={2} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {opsItems.map((item, i) => {
              const icons = [Cog, Megaphone, Wrench, Handshake, BarChart3];
              const Icon = icons[i] || Cog;
              return (
                <ServiceCard key={item.title} delay={i * 0.1} variant="glass" hoverBorder={ACCENT}>
                  <GradientIcon icon={Icon} size={44} iconSize={20} gradient={`linear-gradient(135deg, ${ACCENT}, #BE1869)`} className="mb-4" />
                  <h4 className="font-bold text-[15px] mb-2 text-white">{item.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</p>
                </ServiceCard>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S4: Cómo funciona */}
      <section style={{ padding: "120px 0" }}>
        <div className="mx-auto max-w-[900px] px-6">
          <SectionHeading title="Integrado a tu operación, no en paralelo" />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Como add-on de RevOps as a Service", desc: "Las prioridades de marketing se priorizan junto al resto de la operación. Marketing y ventas alineados bajo el mismo sprint.", chip: "Recomendado →" },
              { title: "Como servicio independiente", desc: "Para equipos que ya tienen su operación RevOps ordenada y necesitan músculo de ejecución en marketing. Mismo modelo de sprint quincenal.", chip: null },
            ].map((path, i) => (
              <ServiceCard key={path.title} delay={i * 0.15} style={{ borderLeft: "3px solid", borderImage: `${GRADIENT} 1` }}>
                <h4 className="font-bold text-base mb-3" style={{ color: DARK }}>{path.title}</h4>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>{path.desc}</p>
                {path.chip && (
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>
                    {path.chip}
                  </span>
                )}
              </ServiceCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S5: Para quién es */}
      <ForWhomSection
        yesItems={[
          "Tienes Marketing Hub pero no lo operas con su potencial",
          "Nadie tiene tiempo de gestionar campañas con criterio",
          "El handoff marketing-ventas es caótico o inexistente",
          "Quieres pauta gestionada por alguien que entiende el CRM",
        ]}
        noItems={[
          { text: "Buscas agencia creativa, contenido o branding", note: "Ese no es nuestro foco" },
          { text: "No tienes Marketing Hub", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
        ]}
      />

      <SectionDivider />

      {/* S6: CTA Final */}
      <section style={{ padding: "100px 0" }}>
        <div className="mx-auto max-w-[480px] px-6">
          <div className="text-center rounded-[20px] p-10" style={{ background: "#fff", border: "1.5px solid #E5E7EB", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] block mb-4" style={{ color: "#6B7280" }}>
              Este servicio empieza con una conversación
            </span>
            <h2 className="text-lg font-bold mb-3" style={{ color: DARK }}>
              Cuéntanos cómo está operando tu marketing hoy.
            </h2>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: "#6B7280" }}>
              En 30 minutos evaluamos qué tiene más impacto en tu operación.
            </p>
            <button
              className="w-full text-sm font-semibold text-white py-3.5 rounded-full transition-all hover:scale-[1.02]"
              style={{ background: GRADIENT, boxShadow: "0 4px 20px rgba(190,24,105,0.35)" }}
            >
              Cuéntanos cómo está tu marketing →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ─── Problem Section ─── */
const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cards = [
    { emoji: "😓", title: "Tienen herramienta, falta operación", desc: "Marketing Hub comprado, automatizaciones a medias, campañas que nadie optimiza. La inversión existe — el retorno, no." },
    { emoji: "⚡", title: "Tienen estrategia, falta ejecución", desc: "Saben qué quieren hacer pero nadie tiene tiempo de hacerlo bien. El día a día se come la operación." },
  ];

  return (
    <section id="problema" ref={ref} style={{ padding: "120px 0" }}>
      <div className="mx-auto max-w-[900px] px-6">
        <SectionHeading title={<>La brecha entre "tenemos marketing" y<br />"el marketing funciona"</>} />
        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((c, i) => (
            <ServiceCard key={c.title} delay={i * 0.15}>
              <span className="text-3xl mb-3 block">{c.emoji}</span>
              <h3 className="font-bold text-base mb-2" style={{ color: DARK }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
            </ServiceCard>
          ))}
        </div>
        <motion.div className="mt-10 mx-auto text-center text-sm font-bold px-6 py-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))", color: "#BE1869", maxWidth: 520 }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
          Marketing Ops no es creatividad. Es la diferencia entre un plan y un motor.
        </motion.div>
      </div>
    </section>
  );
};

export default MarketingOps;
