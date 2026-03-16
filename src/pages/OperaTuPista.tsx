import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Zap, TrendingDown, GitBranch, Cog, Megaphone, Headphones } from "lucide-react";
import DynamicCTA from "@/components/DynamicCTA";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import ResponsiveHeroImage from "@/components/services/ResponsiveHeroImage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useLeadForm } from "@/hooks/useLeadForm";

/* ─── constants ─── */
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

/* ─── counter hook ─── */
function useCounter(end: number, duration = 1500, inView = false, suffix = "") {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * end));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);
  return val + suffix;
}

/* ─── animated dashboard ─── */
const DashboardHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const metrics = [
    { label: "Pipeline activo", value: 842, suffix: "M", trend: "+12%" },
    { label: "Tasa de cierre", value: 34, suffix: "%", trend: "+5%" },
    { label: "Leads calificados", value: 127, suffix: "", trend: "+18%" },
    { label: "Ciclo promedio", value: 23, suffix: "d", trend: "-8%" },
  ];

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 32,
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          animation: "shimmer 4s ease-in-out infinite",
        }}
      />
      <div className="flex items-center gap-3 mb-6">
        <span
          className="inline-block rounded-full"
          style={{
            width: 10, height: 10, background: "#4ADE80",
            boxShadow: "0 0 8px #4ADE80",
            animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        />
        <span className="text-white/80 text-sm font-semibold tracking-wide">Motor de Ingresos, Activo</span>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {metrics.map((m, i) => (
          <MetricBox key={m.label} {...m} inView={inView} delay={i * 0.15} />
        ))}
      </div>
      <div className="mt-6 pt-5 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="text-white/50 text-xs font-medium">Próximo sprint:</span>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.15)", color: "#BE1869" }}>En 3 días</span>
      </div>
    </motion.div>
  );
};

const MetricBox = ({ label, value, suffix, trend, inView, delay }: { label: string; value: number; suffix: string; trend: string; inView: boolean; delay: number }) => {
  const display = useCounter(value, 1500, inView, suffix);
  const isNeg = trend.startsWith("-");
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + delay, duration: 0.5 }}>
      <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
      <p className="text-[28px] font-bold text-white leading-none">{display}</p>
      <span className="text-xs font-semibold mt-1 inline-block" style={{ color: "#4ADE80" }}>{isNeg ? "↓" : "↑"} {trend}</span>
    </motion.div>
  );
};

/* ─── service cards ─── */
const serviceCards = [
  { badge: "NUESTRO CORE", badgeBg: GRADIENT, badgeText: "#fff", icon: Cog, iconColor: GRADIENT, title: "RevOps as a Service", tagline: "Tu Revenue Operations, operando desde el primer mes", desc: "Consultoría estratégica y ejecución técnica en paralelo. Tu consultor asignado opera tu motor como si fuera parte de tu equipo.", price: "Desde 50 UF + IVA / mes", cta: "Ver planes →", ctaTo: "/revops-as-a-service" },
  { badge: "ADD-ON DISPONIBLE", badgeBg: `${ACCENT}1a`, badgeText: ACCENT, icon: Megaphone, iconColor: ACCENT, title: "Marketing Ops", tagline: "Tu operación de marketing funcionando, no solo planificada", desc: "Automatizaciones, campañas, nurturing y alineación con ventas. El músculo que la mayoría necesita pero pocos tienen internamente.", price: "", cta: "Ver servicio →", ctaTo: "/marketing-ops" },
  { badge: "CONTRATACIÓN ONLINE", badgeBg: "rgba(74,222,128,0.1)", badgeText: "#16A34A", icon: Headphones, iconColor: GRADIENT, title: "Soporte HubSpot", tagline: "Tu HubSpot siempre funcionando", desc: "Banco de horas mensual con especialista asignado. Ticket abierto, SLA garantizado, problema resuelto.", price: "Desde 15 UF + IVA / mes", cta: "Ver planes →", ctaTo: "/soporte-hubspot" },
];

const LocalServiceCard = ({ card, i }: { card: (typeof serviceCards)[0]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isGradientIcon = card.iconColor === GRADIENT;
  const Icon = card.icon;

  return (
    <motion.div ref={ref} className="relative flex flex-col bg-white rounded-[20px] p-9 md:p-10 border border-[#E5E7EB] transition-all duration-300 cursor-default" style={{ willChange: "transform" }} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.5 }} whileHover={{ y: -4, boxShadow: "0 20px 50px -12px rgba(0,0,0,0.15)", borderColor: "#BE1869" }}>
      <span className="self-start text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-5" style={{ background: card.badge === "NUESTRO CORE" ? GRADIENT : card.badgeBg, color: card.badgeText }}>{card.badge}</span>
      <div className="mb-4">
        {isGradientIcon ? (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GRADIENT }}><Icon size={22} color="#fff" /></div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.iconColor}1a` }}><Icon size={22} color={card.iconColor} /></div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: DARK }}>{card.title}</h3>
      <p className="text-sm font-semibold mb-3 bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>{card.tagline}</p>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>{card.desc}</p>
      <div className="mt-auto">
        {card.price && <p className="text-base font-bold mb-3" style={{ color: DARK }}>{card.price}</p>}
        <Link to={card.ctaTo} className="text-sm font-semibold inline-flex items-center gap-1 bg-clip-text text-transparent transition-opacity hover:opacity-70" style={{ backgroundImage: GRADIENT }}>{card.cta}</Link>
      </div>
    </motion.div>
  );
};

/* ─── comparison table ─── */
const tableRows = [
  ["Costo mensual", "$3.5M–$4.5M CLP + beneficios", "Desde 50 UF"],
  ["Tiempo para arrancar", "3–6 meses", "Sprint 1"],
  ["Expertise", "1 persona, 1 perfil", "Equipo completo"],
  ["Riesgo de renuncia", "Alto", "Ninguno"],
  ["Curva de aprendizaje", "3–6 meses", "Cero"],
];

const ComparisonTable = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div ref={ref} className="overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "28px", border: "1px solid rgba(255,255,255,0.08)" }} initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
        <span className="text-white/30" />
        <span className="text-white/40 text-center">RevOps Manager interno</span>
        <span className="text-center px-3 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.2), rgba(98,36,190,0.2))", color: "#fff" }}>RevOps LATAM</span>
      </div>
      {tableRows.map(([label, intern, us], i) => (
        <div key={label} className="grid grid-cols-3 gap-2 py-3 text-sm" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
          <span className="text-white/70 font-medium">{label}</span>
          <span className="text-center text-white/40">{intern}</span>
          <span className="text-center font-bold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>{us}</span>
        </div>
      ))}
    </motion.div>
  );
};

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "Opera tu Pista",
    title: "Un equipo completo que opera tu pista mientras tú corres la carrera",
    subtitle: "Construir la pista era el primer paso. Operarla bien, todos los días, es lo que convierte una buena implementación en resultados reales.",
    cta_text: "Quiero que operen mi pista →",
    cta2_text: "Primero quiero un diagnóstico →",
  },
};

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
const OperaTuPista = () => {
  const { getSection, loading } = usePageSections("opera-tu-pista");
  const { openLeadForm } = useLeadForm();

  const hero = getSection("hero");
  const hm = mt(hero);
  const problemaSection = getSection("problema");
  const serviciosSection = getSection("servicios");
  const whyUsSection = getSection("por-que-nosotros");
  const ctaFinalSection = getSection("cta-final");

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

      {/* ── S1: HERO ── */}
      <SectionShell section={hero} className="h-screen pt-28 sm:pt-32 pb-16 px-6" defaultBg={{ background: DARK }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[12px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6"
            style={{ background: (hm.badge_bg as string) || "rgba(255,255,255,0.08)", color: (hm.badge_color as string) || "#fff", border: (hm.badge_bg as string) ? "none" : "1px solid rgba(255,255,255,0.2)" }}
          >
            {h.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-extrabold leading-[1.08] tracking-tight whitespace-pre-line"
            style={{ color: "#ffffff", fontSize: "clamp(40px, 6vw, 64px)" }}
          >
            {(() => {
              const lineBreak = hm.title_line_break as string;
              if (lineBreak && h.title.includes(lineBreak)) {
                const idx = h.title.indexOf(lineBreak);
                return h.title.slice(0, idx).trimEnd() + "\n" + h.title.slice(idx);
              }
              return h.title;
            })()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-[17px] sm:text-[18px] leading-[1.7] mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 900 }}
          >
            {h.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <DynamicCTA
              styleKey={hm.cta_style_key as string}
              onClick={() => { if (hm.cta1_opens_lead_form) { openLeadForm("opera-tu-pista-hero"); } else if (hero?.cta_url) { window.location.href = hero.cta_url; } }}
              className="text-sm font-semibold text-white px-8 py-3.5 rounded-full transition-all hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]"
            >
              {h.cta_text}
            </DynamicCTA>
            {hm.cta2_opens_lead_form ? (
              <button onClick={() => openLeadForm("opera-tu-pista-hero-cta2")} className="text-sm font-medium text-white/60 hover:text-white transition-colors" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {h.cta2_text}
              </button>
            ) : (
              <a href={(hm.cta2_url as string) || "/conoce-tu-pista"} className="text-sm font-medium text-white/60 hover:text-white transition-colors" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {h.cta2_text}
              </a>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14"
          >
            {hero?.image_url && (
              <ResponsiveHeroImage src={hero.image_url} alt={h.title} metadata={hm} defaultMaxWidth="920px" />
            )}
          </motion.div>
        </div>
      </SectionShell>

      {/* ── S2: EL PROBLEMA ── */}
      <ProblemSection section={problemaSection} />

      {/* ── S3: SERVICIOS ── */}
      <SectionDivider />

      <SectionShell section={serviciosSection} className="relative" defaultBg={{ background: "#F9FAFB", padding: "120px 0" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="mx-auto max-w-[1100px] px-6 relative z-10" style={{ padding: serviciosSection ? undefined : "120px 0" }}>
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-14" style={{ color: DARK }}>
            {serviciosSection?.title ?? "Tres formas de operar tu pista con nosotros"}
          </h2>
          <div className="grid md:grid-cols-3 gap-7">
            {serviceCards.map((c, i) => (
              <LocalServiceCard key={c.title} card={c} i={i} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ── S4: POR QUÉ CON NOSOTROS ── */}
      <WhyUsSection section={whyUsSection} />

      {/* ── S5: CTA FINAL ── */}
      <SectionShell section={ctaFinalSection} className="relative" defaultBg={{ padding: "80px 0", background: DARK }}>
        <BackgroundOrbs variant="section" />
        <GradientMesh variant="center" />
        <div className="relative z-10 mx-auto max-w-[600px] px-6 text-center" style={{ padding: "80px 0" }}>
          <h2 className="text-3xl font-bold mb-4 text-white">{ctaFinalSection?.title ?? "¿No sabes por dónde partir?"}</h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            {ctaFinalSection?.subtitle ?? "Si aún no tienes claridad de qué necesita tu operación, el primer paso es un diagnóstico."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DynamicCTA
              styleKey={(mt(ctaFinalSection).cta_style_key as string) || (hm.cta_style_key as string)}
              onClick={() => { if (mt(ctaFinalSection).cta1_opens_lead_form) { openLeadForm("opera-tu-pista-cta-final"); } else if (ctaFinalSection?.cta_url || hero?.cta_url) { window.location.href = (ctaFinalSection?.cta_url || hero?.cta_url)!; } }}
              className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl hover:scale-[1.03] hover:shadow-xl transition-all"
            >
              {ctaFinalSection?.cta_text ?? h.cta_text}
            </DynamicCTA>
            {mt(ctaFinalSection).cta2_opens_lead_form ? (
              <button onClick={() => openLeadForm("opera-tu-pista-cta-final-cta2")} className="text-sm font-medium text-white transition-colors" style={{ textDecoration: "underline", textUnderlineOffset: "3px", background: "none", border: "none", cursor: "pointer" }}>
                {(mt(ctaFinalSection).cta2_text as string) || "Primero quiero un diagnóstico →"}
              </button>
            ) : (
              <a href={(mt(ctaFinalSection).cta2_url as string) || "/conoce-tu-pista"} className="text-sm font-medium text-white transition-colors" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {(mt(ctaFinalSection).cta2_text as string) || "Primero quiero un diagnóstico →"}
              </a>
            )}
          </div>
        </div>
      </SectionShell>

      <Footer />

      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

/* ─── Problem Section ─── */
const ProblemSection = ({ section }: { section?: HomeSection }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const { getBgStyle } = useSectionStyles(section);

  const cols = [
    { icon: "⏱️", title: "El día a día se come todo", desc: "Nadie tiene tiempo de mejorar procesos mientras el negocio avanza." },
    { icon: "📉", title: "Los procesos se degradan", desc: "Lo que se implementó bien empieza a deteriorarse sin mantenimiento activo." },
    { icon: "🔀", title: "Marketing y ventas siguen desconectados", desc: "Cada área trabaja hacia su propia métrica sin una función que las alinee." },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ padding: "100px 0", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 mx-auto max-w-[960px] px-6">
        <h2 className="text-center text-2xl md:text-[36px] font-bold leading-tight mb-4" style={{ color: DARK }}>
          {section?.title ?? "La mayoría de los CRM bien implementados igual terminan subutilizados"}
        </h2>
        <p className="text-center text-base mb-14 mx-auto" style={{ color: "#6B7280", maxWidth: 600 }}>
          {section?.subtitle ?? "No por la herramienta. Por lo que pasa después de implementar."}
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {cols.map((c, i) => (
            <motion.div key={c.title} className="text-center" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.5 }}>
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <h3 className="font-bold text-base mb-2" style={{ color: DARK }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-14 mx-auto text-center text-sm font-medium leading-relaxed px-6 py-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))", color: DARK, maxWidth: 640 }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
          Operar bien una pista requiere alguien que esté mirando los datos y afinando el motor — siempre.
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Why Us Section ─── */
const WhyUsSection = ({ section }: { section?: HomeSection }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const { getBgStyle } = useSectionStyles(section);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: DARK, padding: "100px 0", ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 grid lg:grid-cols-2 gap-14 items-start">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-white text-2xl md:text-[40px] font-bold leading-tight mb-6">{section?.title ?? "No mandamos informes. Trabajamos."}</h2>
          <div className="space-y-4 mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            <p className="text-base leading-relaxed">La diferencia entre un consultor tradicional y RevOps as a Service es simple: nos quedamos a ejecutar.</p>
            <p className="text-base leading-relaxed">Cada sprint definimos prioridades contigo. Cada sprint entregamos resultados. Cada mes tienes visibilidad completa de qué se hizo, qué mejoró y qué sigue.</p>
          </div>
          <div className="rounded-2xl px-6 py-5 text-sm leading-relaxed text-white/80" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <strong className="text-white">14 años</strong> operando motores de ingresos en LATAM<br />· HubSpot Platinum Partners +10 años
          </div>
        </motion.div>
        <ComparisonTable />
      </div>
    </section>
  );
};

export default OperaTuPista;
