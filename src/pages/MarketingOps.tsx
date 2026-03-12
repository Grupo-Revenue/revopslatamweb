import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLeadForm } from "@/hooks/useLeadForm";
import { ChevronRight, X, Cog, Megaphone, Wrench, Handshake, BarChart3, Inbox, RefreshCw, Star, CheckCircle2, ArrowRightLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/services/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import ForWhomSection from "@/components/services/ForWhomSection";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import GradientIcon from "@/components/services/GradientIcon";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import DynamicCTA from "@/components/DynamicCTA";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

function mt(s?: HomeSection): Record<string, unknown> {
  return (s?.metadata as Record<string, unknown>) ?? {};
}

function SectionShell({ section, className, defaultBg, children }: {
  section?: HomeSection; className: string; defaultBg?: React.CSSProperties; children: React.ReactNode;
}) {
  const { getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  return (
    <section className={`relative overflow-hidden ${className}`} style={{ ...(defaultBg ?? {}), ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      {children}
    </section>
  );
}

/* ═══ Hero Workflow Visual ═══ */
const workflowSteps = [
  { label: "Lead entra", Icon: Inbox, color: "rgba(190,24,105,0.3)" },
  { label: "Nurturing", Icon: RefreshCw, color: "rgba(190,24,105,0.5)" },
  { label: "Lead Score", Icon: Star, color: "rgba(140,30,147,0.6)" },
  { label: "MQL", Icon: CheckCircle2, color: "rgba(98,36,190,0.7)" },
  { label: "Ventas", Icon: ArrowRightLeft, color: "rgba(98,36,190,0.9)" },
];

const LOOP_DURATION = 4000; // ms for full cycle
const STEP_DELAY = 600; // ms between each step lighting up
const PAUSE_AT_END = 1200; // ms pause when all lit

const HeroWorkflow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let timeout: ReturnType<typeof setTimeout>;
    let step = -1;
    const totalSteps = workflowSteps.length;

    const tick = () => {
      step++;
      if (step <= totalSteps) {
        setActiveStep(step);
        timeout = setTimeout(tick, step === totalSteps ? PAUSE_AT_END : STEP_DELAY);
      } else {
        // Reset and loop
        step = -1;
        setActiveStep(-1);
        timeout = setTimeout(tick, 600);
      }
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="relative backdrop-blur-sm w-full max-w-[420px]"
      style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "32px 24px", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
        Automatización activa
      </p>

      <div className="relative flex flex-col items-center">
        {/* Connecting line background */}
        <div className="absolute left-[24px] top-[24px] bottom-[24px] w-[2px] pointer-events-none" style={{ zIndex: 0, background: "rgba(255,255,255,0.08)" }} />

        {/* Animated progress line */}
        <motion.div
          className="absolute left-[24px] top-[24px] w-[2px] pointer-events-none origin-top"
          style={{
            zIndex: 1,
            background: GRADIENT,
            borderRadius: 1,
          }}
          animate={{
            height: activeStep < 0 ? "0%" : `${Math.min((activeStep / (workflowSteps.length - 1)) * 100, 100)}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {workflowSteps.map((step, i) => {
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;
          const descriptions = [
            "Formulario, pauta, orgánico",
            "Emails, secuencias, contenido",
            "Comportamiento + fit = puntaje",
            "Calificado y listo para contactar",
            "Handoff automático al pipeline",
          ];

          return (
            <div
              key={step.label}
              className="relative z-10 flex items-center gap-4 w-full"
              style={{ marginBottom: i < workflowSteps.length - 1 ? 8 : 0 }}
            >
              {/* Node */}
              <motion.div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                animate={{
                  background: isActive ? step.color : "rgba(255,255,255,0.04)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <step.Icon size={20} color={isActive ? "#fff" : "rgba(255,255,255,0.25)"} strokeWidth={1.8} />
              </motion.div>

              {/* Label */}
              <motion.div
                className="flex-1 rounded-lg px-4 py-3"
                animate={{
                  background: isActive
                    ? i === workflowSteps.length - 1 ? "rgba(98,36,190,0.15)" : "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: isActive
                    ? i === workflowSteps.length - 1 ? "rgba(98,36,190,0.3)" : "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.04)",
                }}
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                transition={{ duration: 0.35 }}
              >
                <motion.span
                  className="text-sm font-semibold block"
                  animate={{ color: isActive ? "#fff" : "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  {step.label}
                </motion.span>
                <motion.span
                  className="block text-[11px] mt-0.5"
                  animate={{
                    color: isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {descriptions[i]}
                </motion.span>
              </motion.div>

              {/* Glow on current step */}
              {isCurrent && (
                <motion.div
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl pointer-events-none"
                  style={{ background: step.color, filter: "blur(16px)", zIndex: 0 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>
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

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "Operación, no agencia",
    title: "Tu operación de marketing funcionando, no solo planificada",
    subtitle: "Automatizaciones activas, campañas que se miden, leads que llegan a ventas en el momento correcto. El músculo que la mayoría necesita pero pocos tienen internamente.",
    cta_text: "Cuéntanos cómo está tu marketing →",
    cta2_text: "¿Es este el servicio correcto? ↓",
  },
};

/* ═══ PAGE ═══ */
const MarketingOps = () => {
  const { getSection, loading } = usePageSections("marketing-ops");
  const { openLeadForm } = useLeadForm();

  const hero = getSection("hero");
  const problemaSection = getSection("problema");
  const operamosSection = getSection("operamos");
  const comoFuncionaSection = getSection("como-funciona");
  const paraQuienSection = getSection("para-quien");
  const ctaFinalSection = getSection("cta-final");
  const hm = mt(hero);

  const h = {
    badge: (hm.badge as string) ?? DEF.hero.badge,
    title: hero?.title ?? DEF.hero.title,
    subtitle: hero?.subtitle ?? DEF.hero.subtitle,
    cta_text: hero?.cta_text ?? DEF.hero.cta_text,
    cta2_text: (hm.cta2_text as string) ?? DEF.hero.cta2_text,
  };

  if (loading) return <div className="min-h-screen" style={{ background: DARK }} />;

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <SectionShell section={hero} className="min-h-[85vh]" defaultBg={{ background: "linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-36 pb-24 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-[85vh]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/opera-tu-pista" className="hover:text-white/60 transition-colors">Opera tu pista</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Marketing Ops</span>
            </div>
            <span className="inline-block text-[12px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6" style={{ background: (hm.badge_bg as string) || "rgba(255,255,255,0.08)", color: (hm.badge_color as string) || "#fff", border: (hm.badge_bg as string) ? "none" : "1px solid rgba(255,255,255,0.2)" }}>
              {h.badge}
            </span>
            <h1 className="font-bold text-white leading-[1.08] mb-6" style={{ fontSize: "clamp(40px, 5vw, 62px)" }}>{h.title}</h1>
            <p className="text-lg sm:text-[19px] leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>{h.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              <DynamicCTA styleKey={hm.cta_style_key as string} onClick={() => { if (hm.cta1_opens_lead_form) { openLeadForm("marketing-ops-hero"); } else if (hero?.cta_url) { window.location.href = hero.cta_url; } }} className="text-[15px] font-semibold text-white px-8 py-4 rounded-full transition-all hover:scale-[1.03]">
                {h.cta_text}
              </DynamicCTA>
              {hm.cta2_opens_lead_form ? (
                <button onClick={() => openLeadForm("marketing-ops-hero-cta2")} className="text-[15px] font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  {h.cta2_text}
                </button>
              ) : (
                <button onClick={() => document.getElementById("problema")?.scrollIntoView({ behavior: "smooth" })} className="text-[15px] font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  {h.cta2_text}
                </button>
              )}
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {hero?.image_url ? <img src={hero.image_url} alt="" className="w-full max-w-[460px] rounded-2xl" /> : <HeroWorkflow />}
          </motion.div>
        </div>
      </SectionShell>

      {/* S2: El Problema */}
      <ProblemSection section={problemaSection} />

      <SectionDivider />

      {/* S3: Lo que operamos */}
      <SectionShell section={operamosSection} className="relative" defaultBg={{ background: "#1A1A2E", padding: "120px 0" }}>
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
      </SectionShell>

      <SectionDivider />

      {/* S4: Cómo funciona */}
      <SectionShell section={comoFuncionaSection} className="relative" defaultBg={{ padding: "120px 0", background: "#fff" }}>
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
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>{path.chip}</span>
                )}
              </ServiceCard>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* S5: Para quién es */}
      <SectionShell section={paraQuienSection} className="relative" defaultBg={{ background: "#F9FAFB" }}>
        <ForWhomSection
          background="transparent"
          yesItems={["Tienes Marketing Hub pero no lo operas con su potencial", "Nadie tiene tiempo de gestionar campañas con criterio", "El handoff marketing-ventas es caótico o inexistente", "Quieres pauta gestionada por alguien que entiende el CRM"]}
          noItems={[
            { text: "Buscas agencia creativa, contenido o branding", note: "Ese no es nuestro foco" },
            { text: "No tienes Marketing Hub", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
          ]}
        />
      </SectionShell>

      <SectionDivider />

      {/* S6: CTA Final */}
      <SectionShell section={ctaFinalSection} className="relative" defaultBg={{ background: "#1A1A2E", padding: "100px 0" }}>
        <BackgroundOrbs variant="section" />
        <div className="relative z-10 mx-auto max-w-[480px] px-6">
          <div className="text-center rounded-[20px] p-10" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] block mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Este servicio empieza con una conversación</span>
            <h2 className="text-lg font-bold mb-3 text-white">Cuéntanos cómo está operando tu marketing hoy.</h2>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>En 30 minutos evaluamos qué tiene más impacto en tu operación.</p>
            <DynamicCTA styleKey={(mt(ctaFinalSection).cta_style_key as string) || (hm.cta_style_key as string)} onClick={() => { if (mt(ctaFinalSection).cta1_opens_lead_form || hm.cta1_opens_lead_form) { openLeadForm("marketing-ops-cta-final"); } else if (ctaFinalSection?.cta_url || hero?.cta_url) { window.location.href = (ctaFinalSection?.cta_url || hero?.cta_url)!; } }} className="w-full text-sm font-semibold text-white py-3.5 rounded-full transition-all hover:scale-[1.02]">
              {ctaFinalSection?.cta_text ?? h.cta_text}
            </DynamicCTA>
          </div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
};

/* ─── Problem Section ─── */
const ProblemSection = ({ section }: { section?: HomeSection }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const { getBgStyle } = useSectionStyles(section);

  const cards = [
    { emoji: "😓", title: "Tienen herramienta, falta operación", desc: "Marketing Hub comprado, automatizaciones a medias, campañas que nadie optimiza. La inversión existe — el retorno, no." },
    { emoji: "⚡", title: "Tienen estrategia, falta ejecución", desc: "Saben qué quieren hacer pero nadie tiene tiempo de hacerlo bien. El día a día se come la operación." },
  ];

  return (
    <section id="problema" ref={ref} className="relative overflow-hidden" style={{ padding: "120px 0", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 mx-auto max-w-[900px] px-6">
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
