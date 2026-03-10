import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DynamicCTA from "@/components/DynamicCTA";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";


/* ─── animation helper ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";

function meta(section?: HomeSection): Record<string, unknown> {
  return (section?.metadata as Record<string, unknown>) ?? {};
}

/* ─── SVG Track ─── */
const TrackSVG = () => {
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    const timeout = setTimeout(() => {
      path.style.transition = "stroke-dashoffset 2s ease-out";
      path.style.strokeDashoffset = "0";
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <svg viewBox="0 0 800 120" className="w-full max-w-[600px] mx-auto" style={{ opacity: 0.15 }}>
      <defs>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BE1869" />
          <stop offset="100%" stopColor="#6224BE" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M 20 60 C 120 20, 200 100, 300 60 S 480 10, 550 60 S 700 110, 780 60"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ─── Section Shell ─── */
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

/* ─── Stat Card for Section 2 ─── */
const StatCard = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <motion.div
    {...fadeUp(delay)}
    className="rounded-2xl p-5 sm:p-6 flex items-center gap-4"
    style={{ background: "#ffffff", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
  >
    <span className="text-2xl flex-shrink-0">{icon}</span>
    <span className="text-[15px] sm:text-base font-medium" style={{ color: "#1A1A2E" }}>{text}</span>
  </motion.div>
);

/* ─── Pricing Card ─── */
type PricingCardData = {
  badge: string; badgeHighlight?: boolean; title: string; tagline: string;
  description: string; price: string; duration: string; href: string; highlighted?: boolean;
};

const PricingCard = ({ card, delay }: { card: PricingCardData; delay: number }) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-[20px] p-[2px] transition-all duration-300 group"
    style={{ background: card.highlighted ? GRADIENT : "transparent" }}
  >
    <div
      className="rounded-[18px] p-8 sm:p-9 flex flex-col h-full transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
      style={{ background: "#ffffff", border: card.highlighted ? "none" : "1px solid #E5E7EB" }}
      onMouseEnter={(e) => { if (!card.highlighted) e.currentTarget.style.borderColor = "#BE1869"; }}
      onMouseLeave={(e) => { if (!card.highlighted) e.currentTarget.style.borderColor = "#E5E7EB"; }}
    >
      <span
        className="inline-block self-start text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-5"
        style={card.badgeHighlight ? { background: GRADIENT, color: "#fff" } : { background: "#F3F4F6", color: "#6B7280" }}
      >
        {card.badge}
      </span>
      <h3 className="text-[22px] font-bold leading-tight tracking-tight" style={{ color: "#1A1A2E" }}>{card.title}</h3>
      <p className="mt-1 text-[14px] font-semibold" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {card.tagline}
      </p>
      <p className="mt-4 text-[15px] leading-[1.7] flex-1" style={{ color: "#6B7280" }}>{card.description}</p>
      <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />
      <p className="text-[24px] font-bold" style={{ color: "#1A1A2E" }}>{card.price}</p>
      <p className="text-[14px] mt-0.5" style={{ color: "#6B7280" }}>{card.duration}</p>
      <Link
        to={card.href}
        className="mt-6 inline-flex items-center justify-center text-[15px] font-semibold transition-all duration-200 hover:scale-[1.02]"
        style={card.highlighted
          ? { background: GRADIENT, color: "#fff", borderRadius: 9999, padding: "12px 28px" }
          : { background: "transparent", color: "#BE1869", borderRadius: 9999, padding: "12px 28px", border: "2px solid #BE1869" }
        }
      >
        Ver diagnóstico →
      </Link>
    </div>
  </motion.div>
);

/* ─── Stat number ─── */
const BigStat = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="text-center">
    <p className="text-[36px] sm:text-[48px] font-extrabold tracking-tight" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {value}
    </p>
    <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
  </motion.div>
);

/* ─── Default data ─── */
const DEFAULTS = {
  hero: { title: "Antes de correr, necesitas conocer tu pista", subtitle: "En RevOps LATAM no asumimos dónde están tus problemas. Los encontramos — con metodología, con datos y con 14 años de experiencia en el mercado chileno.", cta_text: "Quiero conocer mi pista →", cta_url: "#diagnosticos", badge: "Conoce tu pista" },
  problema: { title: "¿Sientes que tu operación comercial debería rendir más?", body: "La mayoría de las empresas en crecimiento llegan a un punto donde tienen equipo, herramientas y actividad — pero los números no responden igual. El pipeline no es predecible. Las áreas no hablan el mismo idioma. Nadie tiene un número en el que confiar.", highlight: "El problema casi nunca es la gente. Casi siempre es el sistema.", stat_cards: [{ icon: "⚠️", text: "Pipeline impredecible" }, { icon: "📊", text: "Datos inconsistentes entre áreas" }, { icon: "🔄", text: "Inversión sin retorno claro" }] },
  diagnosticos: { title: "Tres diagnósticos. Uno es el tuyo.", subtitle: "El nivel correcto depende de tu tamaño y complejidad. Aquí te ayudamos a elegir.", cards: [
    { badge: "STARTER", title: "RevOps Checkup", tagline: "Claridad en 2 semanas", description: "Para equipos pequeños que necesitan claridad rápida. Sabrás exactamente qué está frenando tu crecimiento y qué hacer al respecto.", price: "Desde 80 UF", duration: "2 semanas", href: "/revops-checkup", highlighted: false, badgeHighlight: false },
    { badge: "GROWTH", title: "Diagnóstico RevOps", tagline: "Visión completa en 3 semanas", description: "Para empresas en crecimiento que necesitan un diagnóstico profundo de su operación comercial, tecnología y procesos. El más elegido.", price: "Desde 150 UF", duration: "3 semanas", href: "/diagnostico-revops", highlighted: true, badgeHighlight: true },
    { badge: "ENTERPRISE", title: "Diagnóstico Motor de Ingresos", tagline: "Transformación en 5 semanas", description: "Para operaciones complejas con múltiples equipos, herramientas y fuentes de datos. Análisis integral del motor de ingresos completo.", price: "Desde 250 UF", duration: "5 semanas", href: "/motor-de-ingresos", highlighted: false, badgeHighlight: false },
  ] },
  porQueDiagnosticar: { title: "El diagnóstico no es un gasto.\nEs el inicio de una relación.", body: "El 70% de nuestros clientes que pasan por un diagnóstico continúan con un proyecto de implementación o un retainer. No porque los convenzamos — sino porque el diagnóstico revela oportunidades concretas que no querían dejar pasar.\n\nUn buen diagnóstico no te dice que tienes problemas. Te dice cuánto te están costando — y qué pasa si los resuelves.", stats: [{ value: "14 años", label: "de experiencia" }, { value: "Platinum", label: "HubSpot Partners" }, { value: "Cientos", label: "de equipos alineados" }] },
  ctaFinal: { title: "¿No sabes cuál diagnóstico necesitas?", subtitle: "En 15 minutos de conversación te ayudamos a identificar el nivel correcto — sin compromiso.", cta_text: "Agendar conversación gratuita →", cta_url: "#" },
};

/* ═══════════════ PAGE ═══════════════ */
const ConoceTuPista = () => {
  const { getSection, loading } = usePageSections("conoce-tu-pista");

  const hero = getSection("hero");
  const problema = getSection("problema");
  const diagnosticos = getSection("diagnosticos");
  const porQue = getSection("por-que-diagnosticar");
  const ctaFinal = getSection("cta-final");

  const hm = meta(hero);
  const pm = meta(problema);
  const dm = meta(diagnosticos);
  const pqm = meta(porQue);

  // Resolved values with fallbacks
  const h = {
    title: hero?.title ?? DEFAULTS.hero.title,
    subtitle: hero?.subtitle ?? DEFAULTS.hero.subtitle,
    cta_text: hero?.cta_text ?? DEFAULTS.hero.cta_text,
    cta_url: hero?.cta_url ?? DEFAULTS.hero.cta_url,
    badge: (hm.badge as string) ?? DEFAULTS.hero.badge,
  };

  const p = {
    title: problema?.title ?? DEFAULTS.problema.title,
    body: problema?.body ?? DEFAULTS.problema.body,
    highlight: (pm.highlight as string) ?? DEFAULTS.problema.highlight,
    stat_cards: (pm.stat_cards as Array<{ icon: string; text: string }>) ?? DEFAULTS.problema.stat_cards,
  };

  const d = {
    title: diagnosticos?.title ?? DEFAULTS.diagnosticos.title,
    subtitle: diagnosticos?.subtitle ?? DEFAULTS.diagnosticos.subtitle,
    cards: (dm.cards as PricingCardData[]) ?? DEFAULTS.diagnosticos.cards,
  };

  const pq = {
    title: porQue?.title ?? DEFAULTS.porQueDiagnosticar.title,
    body: porQue?.body ?? DEFAULTS.porQueDiagnosticar.body,
    stats: (pqm.stats as Array<{ value: string; label: string }>) ?? DEFAULTS.porQueDiagnosticar.stats,
  };

  const cf = {
    title: ctaFinal?.title ?? DEFAULTS.ctaFinal.title,
    subtitle: ctaFinal?.subtitle ?? DEFAULTS.ctaFinal.subtitle,
    cta_text: ctaFinal?.cta_text ?? DEFAULTS.ctaFinal.cta_text,
    cta_url: ctaFinal?.cta_url ?? DEFAULTS.ctaFinal.cta_url,
  };

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: probStyle } = useSectionStyles(problema);
  const { getStyle: diagStyle } = useSectionStyles(diagnosticos);
  const { getStyle: pqStyle } = useSectionStyles(porQue);
  const { getStyle: cfStyle } = useSectionStyles(ctaFinal);

  if (loading) return <div className="min-h-screen" style={{ background: "#1A1A2E" }} />;

  const bodyParagraphs = pq.body.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── SECTION 1: HERO ─── */}
      <SectionShell section={hero} className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-6" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 max-w-[1100px] mx-auto text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] mb-6"
            style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...heroStyle("subtitle") }}
          >
            {h.badge}
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="font-extrabold leading-[1.08] tracking-tight"
            style={{ color: "#ffffff", fontSize: "clamp(40px, 6vw, 64px)", ...heroStyle("title") }}
          >
            {h.title}
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-[17px] sm:text-[18px] leading-[1.7] mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 560, ...heroStyle("body") }}
          >
            {h.subtitle}
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-10">
            <DynamicCTA
              styleKey={hm.cta_style_key as string}
              onClick={() => h.cta_url && (window.location.href = h.cta_url)}
              className="inline-flex items-center text-[15px] sm:text-base font-semibold transition-all duration-200 hover:scale-[1.03] rounded-full px-8 py-3.5"
            >
              {h.cta_text}
            </DynamicCTA>
          </motion.div>
          <motion.div {...fadeUp(0.5)} className="mt-14">
            {hero?.image_url ? (
              <img src={hero.image_url} alt={h.title} loading="lazy" className="w-full max-w-[920px] mx-auto rounded-2xl object-cover" />
            ) : (
              <TrackSVG />
            )}
          </motion.div>
        </div>
      </SectionShell>


      {/* ─── SECTION 2: EL PROBLEMA ─── */}
      <SectionShell section={problema} className="py-24 sm:py-[120px] px-6" defaultBg={{ background: "#ffffff" }}>
        <GradientMesh variant="light" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          <div className="flex-1 max-w-[520px]">
            <motion.h2
              {...fadeUp(0)}
              className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
              style={{ color: "#1A1A2E", ...probStyle("title") }}
            >
              {p.title}
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="mt-6 text-[16px] leading-[1.7]" style={{ color: "#6B7280", ...probStyle("body") }}>
              {p.body}
            </motion.p>
            <motion.p {...fadeUp(0.15)} className="mt-4 text-[16px] leading-[1.7] font-bold" style={{ color: "#1A1A2E" }}>
              {p.highlight}
            </motion.p>
          </div>
          <div className="flex-1 w-full max-w-[440px] flex flex-col gap-4">
            {p.stat_cards.map((sc, i) => (
              <StatCard key={i} icon={sc.icon} text={sc.text} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── SECTION 3: ELIGE TU DIAGNÓSTICO ─── */}
      <SectionDivider />

      <SectionShell section={diagnosticos} className="py-24 sm:py-[120px] px-6" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[1100px] mx-auto" id="diagnosticos">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E", ...diagStyle("title") }}
          >
            {d.title}
          </motion.h2>
          <motion.p
            {...fadeUp(0.08)}
            className="mt-4 text-center text-[16px] sm:text-[17px] leading-[1.6] max-w-[560px] mx-auto"
            style={{ color: "#6B7280", ...diagStyle("subtitle") }}
          >
            {d.subtitle}
          </motion.p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {d.cards.map((card, i) => (
              <PricingCard key={i} card={card} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── SECTION 4: POR QUÉ DIAGNOSTICAR PRIMERO ─── */}
      
      <SectionShell section={porQue} className="py-20 sm:py-[100px] px-6" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="section" />
        <NoiseOverlay opacity={0.03} />
        <div className="relative z-10 max-w-[680px] mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight whitespace-pre-line"
            style={{ color: "#ffffff", ...pqStyle("title") }}
          >
            {pq.title}
          </motion.h2>
          {bodyParagraphs.map((para, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.1 + i * 0.05)}
              className="mt-6 text-[16px] sm:text-[17px] leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.7)", ...pqStyle("body") }}
            >
              {para}
            </motion.p>
          ))}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-12">
            {pq.stats.map((s, i) => (
              <BigStat key={i} value={s.value} label={s.label} delay={0.15 + i * 0.1} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── SECTION 5: CTA FINAL ─── */}
      
      <SectionShell section={ctaFinal} className="py-16 sm:py-20 px-6 text-center" defaultBg={{ background: "#ffffff" }}>
        <GradientMesh variant="center" />
        <div className="relative z-10 max-w-[560px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E", ...cfStyle("title") }}
          >
            {cf.title}
          </motion.h2>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-4 text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: "#6B7280", ...cfStyle("body") }}
          >
            {cf.subtitle}
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8">
            <Link
              to={cf.cta_url}
              className="inline-flex items-center text-[15px] sm:text-base font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
              style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px", ...cfStyle("cta") }}
            >
              {cf.cta_text}
            </Link>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
};

export default ConoceTuPista;
