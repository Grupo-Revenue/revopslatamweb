import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Rocket, Settings, LayoutDashboard, Cable } from "lucide-react";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";

/* ─── constants ─── */
const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";
const HUBSPOT = "#FF7A59";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

function mt(section?: HomeSection): Record<string, unknown> {
  return (section?.metadata as Record<string, unknown>) ?? {};
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

/* ─── defaults ─── */
const DEF = {
  hero: {
    eyebrow: "DISEÑA Y CONSTRUYE TU PISTA",
    title: "Nadie construye un circuito poniendo el asfalto primero",
    subtitle: "Diseñamos la pista antes de construirla — siempre. Proceso primero. HubSpot después.",
    cta: "Quiero construir mi pista →",
    cta2_text: "Primero quiero un diagnóstico →",
    cta2_url: "/conoce-tu-pista",
    steps: ["Diseño de Procesos", "Onboarding HubSpot", "Implementación a Medida", "Personalización CRM", "Integraciones Custom"],
  },
  problema: {
    title: "La mayoría de los CRM fallan antes de ser implementados",
    cards: [
      { icon: "😤", title: "Lo implementaron sin proceso", text: "Meses después, el equipo sigue en Excel." },
      { icon: "🏢", title: "Lo implementó una agencia de marketing", text: "Técnicamente correcto. Operacionalmente inútil." },
      { icon: "💸", title: "Licencias caras que nadie usa", text: "La inversión existe. El retorno, no." },
    ],
    pill: "Proceso primero. Tecnología después. Siempre.",
  },
  servicios: {
    title: "Cinco servicios. Un principio.",
    subtitle: "Proceso antes que tecnología — en cada proyecto, sin excepción.",
    services: [
      { badge: "EL FUNDAMENTO", badgeType: "hubspot", title: "Diseño de Procesos Comerciales", tagline: "El plano de tu operación comercial", description: "Diseñamos tu proceso completo antes de tocar cualquier herramienta.", price: "Desde 45 UF + IVA", href: "/diseño-de-procesos" },
      { badge: "MÁS RÁPIDO", badgeType: "hubspot", title: "Onboarding HubSpot", tagline: "En marcha en 3 semanas", description: "La forma más eficiente de arrancar con HubSpot. Con proceso, sin sobreingeniería.", price: "Desde 50 UF + IVA", href: "/onboarding-hubspot" },
      { badge: "MÁS POPULAR", badgeType: "brand", title: "Implementación HubSpot a Medida", tagline: "Tu proceso exacto en HubSpot", description: "Para procesos complejos o implementaciones que necesitan rehacerse desde las bases.", price: "calc", href: "/implementacion-hubspot" },
      { badge: "AVANZADO", badgeType: "default", title: "Personalización del CRM", tagline: "HubSpot que funciona como tu negocio", description: "UI Extensions, CRM Cards personalizadas y vistas a medida por rol.", price: "calc", href: "/personalizacion-crm" },
      { badge: "TÉCNICO", badgeType: "default", title: "Integraciones y Desarrollo Custom", tagline: "Tu ecosistema, finalmente conectado", description: "ERP, apps a medida, WhatsApp, portales — HubSpot como centro de tu operación.", price: "calc", href: "/integraciones-desarrollo" },
    ],
  },
  diferencia: {
    title: "Por qué una agencia de marketing no debería implementar tu CRM",
    body: "El CRM es el corazón de tu operación comercial. Implementarlo bien requiere entender procesos de ventas, pipelines, automatizaciones de negocio y arquitectura de datos — no campañas ni creatividad.\n\nNosotros somos especialistas en operaciones de revenue. No hacemos marketing. Hacemos que tu operación comercial funcione.",
    credential: "HubSpot Platinum Partner · +10 años",
    comparison: {
      left: { header: "Agencia de Marketing", items: ["Implementa sin diseñar proceso", "Configura por Hub, no por negocio", "Entrega el portal y desaparece"] },
      right: { header: "RevOps LATAM", items: ["Proceso diseñado antes de construir", "Implementamos según tu operación", "Acompañamos hasta que funciona"] },
    },
  },
  ctaFinal: {
    title: "¿No sabes por dónde partir?",
    body: "Si aún no tienes claridad de qué necesitas construir, el primer paso es un diagnóstico.",
    cta: "Quiero construir mi pista →",
    cta2_text: "Primero quiero un diagnóstico →",
    cta2_url: "/conoce-tu-pista",
  },
};

/* ─── Process Steps Visual ─── */
const ProcessSteps = ({ steps }: { steps: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full max-w-[360px] mx-auto lg:mx-0 rounded-[20px] p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="relative">
        {/* Connector line */}
        <svg className="absolute left-[19px] top-[20px] w-[2px]" style={{ height: `calc(100% - 40px)` }}>
          <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#lineGrad)" strokeWidth="2"
            strokeDasharray="200" strokeDashoffset={inView ? 0 : 200}
            style={{ transition: "stroke-dashoffset 1.5s ease-out 0.3s" }} />
          <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
        </svg>
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-4 mb-6 last:mb-0 relative">
            <motion.div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
              style={{ border: "2px solid rgba(255,255,255,0.15)" }}
              initial={{ background: "transparent" }}
              animate={inView ? { background: GRADIENT } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.3 }}
            >
              {i + 1}
            </motion.div>
            <motion.span
              className="text-[15px] text-white/80 font-medium"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.3 }}
            >
              {label}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Service Card Icons ─── */
const SERVICE_ICONS = [Layers, Rocket, Settings, LayoutDashboard, Cable];

/* ─── Service Card ─── */
const ServiceCard = ({ svc, index }: { svc: typeof DEF.servicios.services[0]; index: number }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const Icon = SERVICE_ICONS[index] || Layers;
  const badgeBg = svc.badgeType === "hubspot"
    ? `rgba(255,122,89,0.1)`
    : svc.badgeType === "brand"
      ? GRADIENT
      : "rgba(26,26,46,0.06)";
  const badgeColor = svc.badgeType === "hubspot"
    ? HUBSPOT
    : svc.badgeType === "brand"
      ? "#fff"
      : "#1A1A2E";

  return (
    <motion.div {...fadeUp(0.1 + index * 0.08)} className="group rounded-[20px] p-9 bg-white border border-[#E5E7EB] hover:border-[#BE1869] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)] flex flex-col">
      {/* Badge */}
      <span className="inline-block self-start px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.08em] font-bold mb-4"
        style={{ background: badgeBg, color: badgeColor }}>
        {svc.badge}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 mb-4 flex items-center justify-center">
        <Icon size={32} style={{ stroke: "url(#iconGrad)" }} className="text-[#BE1869]" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">{svc.title}</h3>
      <p className="text-sm font-semibold mb-3" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{svc.tagline}</p>
      <p className="text-sm text-[#6B7280] mb-6 flex-1">{svc.description}</p>

      {/* Price */}
      {svc.price === "calc" ? (
        <div className="relative mb-4">
          <button onClick={() => setTooltipOpen(!tooltipOpen)}
            className="text-sm font-semibold px-4 py-2 rounded-full border border-[#BE1869]/30 hover:border-[#BE1869] transition-colors"
            style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Calcular precio →
          </button>
          {tooltipOpen && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-2 bg-[#1A1A2E] text-white text-xs px-4 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
              Calculadora disponible próximamente
              <div className="absolute -top-1 left-6 w-2 h-2 bg-[#1A1A2E] rotate-45" />
            </motion.div>
          )}
        </div>
      ) : (
        <p className="text-base font-bold text-[#1A1A2E] mb-4">{svc.price}</p>
      )}

      {/* CTA */}
      <Link to={svc.href} className="inline-flex items-center gap-1 text-sm font-semibold group/link"
        style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Ver servicio <ArrowRight size={14} className="text-[#BE1869] transition-transform group-hover/link:translate-x-1" />
      </Link>
    </motion.div>
  );
};

/* ─── Comparison Columns ─── */
const ComparisonColumns = ({ left, right }: { left: { header: string; items: string[] }; right: { header: string; items: string[] } }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[520px]">
      <motion.div className="flex-1 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }}>
        <div className="px-5 py-3 text-sm font-semibold text-white/50" style={{ background: "rgba(255,255,255,0.04)" }}>{left.header}</div>
        <div className="px-5 py-4 space-y-3">
          {left.items.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-white/60">
              <span className="text-red-400/70 mt-0.5 font-bold">✗</span> {item}
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div className="flex-1 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}>
        <div className="px-5 py-3 text-sm font-bold" style={{ background: "linear-gradient(90deg, rgba(190,24,105,0.15), rgba(98,36,190,0.15))", color: "#BE1869" }}>{right.header}</div>
        <div className="px-5 py-4 space-y-3">
          {right.items.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-white/80">
              <span className="mt-0.5 font-bold" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✓</span> {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════ PAGE ═══════════════════ */
const DisenaYConstruye = () => {
  const { getSection, loading } = usePageSections("diseña-y-construye-tu-pista");

  const hero = getSection("hero");
  const hm = mt(hero);
  const problema = getSection("problema");
  const pm = mt(problema);
  const servicios = getSection("servicios");
  const sm = mt(servicios);
  const diferencia = getSection("diferencia");
  const dm = mt(diferencia);
  const ctaFinal = getSection("cta-final");
  const cm = mt(ctaFinal);

  /* Resolved values */
  const heroTitle = hero?.title ?? DEF.hero.title;
  const heroSubtitle = hero?.subtitle ?? DEF.hero.subtitle;
  const heroEyebrow = (hm.eyebrow as string) ?? DEF.hero.eyebrow;
  const heroCta = hero?.cta_text ?? DEF.hero.cta;
  const heroCta2 = (hm.cta2_text as string) ?? DEF.hero.cta2_text;
  const heroCta2Url = (hm.cta2_url as string) ?? DEF.hero.cta2_url;
  const heroSteps = (hm.steps as string[]) ?? DEF.hero.steps;

  const probTitle = problema?.title ?? DEF.problema.title;
  const probCards = (pm.cards as typeof DEF.problema.cards) ?? DEF.problema.cards;
  const probPill = (pm.pill as string) ?? DEF.problema.pill;

  const svcTitle = servicios?.title ?? DEF.servicios.title;
  const svcSubtitle = servicios?.subtitle ?? DEF.servicios.subtitle;
  const svcList = (sm.services as typeof DEF.servicios.services) ?? DEF.servicios.services;

  const difTitle = diferencia?.title ?? DEF.diferencia.title;
  const difBody = diferencia?.body ?? DEF.diferencia.body;
  const difCredential = (dm.credential as string) ?? DEF.diferencia.credential;
  const difComparison = (dm.comparison as typeof DEF.diferencia.comparison) ?? DEF.diferencia.comparison;

  const ctaTitle = ctaFinal?.title ?? DEF.ctaFinal.title;
  const ctaBody = ctaFinal?.body ?? DEF.ctaFinal.body;
  const ctaCta = ctaFinal?.cta_text ?? DEF.ctaFinal.cta;
  const ctaCta2 = (cm.cta2_text as string) ?? DEF.ctaFinal.cta2_text;
  const ctaCta2Url = (cm.cta2_url as string) ?? DEF.ctaFinal.cta2_url;

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: difStyle } = useSectionStyles(diferencia);

  if (loading) return <div className="min-h-screen bg-[#1A1A2E]" />;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      {/* ──── HERO ──── */}
      <SectionShell section={hero} className="min-h-[90vh] flex items-center pt-[120px] pb-16 px-4 sm:px-6" defaultBg={{ background: "#1A1A2E" }}>
        <div className="relative z-10 container max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="lg:w-[55%]">
            <motion.div {...fadeUp(0)}>
              <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                style={{ background: GRADIENT }}>
                {heroEyebrow}
              </span>
            </motion.div>
            <motion.h1 {...fadeUp(0.15)} className="mt-7 font-extrabold leading-[1.08] tracking-[-0.02em] text-white max-w-[580px]"
              style={{ fontSize: "clamp(44px, 5vw, 68px)", ...heroStyle("title") }}>
              {heroTitle}
            </motion.h1>
            <motion.p {...fadeUp(0.3)} className="mt-5 text-lg leading-relaxed max-w-[500px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              {heroSubtitle}
            </motion.p>
            <motion.div {...fadeUp(0.45)} className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="px-8 py-3.5 rounded-full text-white font-semibold text-base transition-shadow hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]"
                style={{ background: GRADIENT }}
                onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}>
                {heroCta}
              </button>
              <Link to={heroCta2Url} className="text-white/80 hover:text-white underline underline-offset-4 text-sm font-medium transition-colors">
                {heroCta2}
              </Link>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="lg:w-[45%]">
            <ProcessSteps steps={heroSteps} />
          </div>
        </div>
      </SectionShell>

      {/* ──── PROBLEMA ──── */}
      <SectionShell section={problema} className="py-24 px-4 sm:px-6" defaultBg={{ background: "#FFFFFF" }}>
        <div className="relative z-10 container max-w-[800px] mx-auto text-center">
          <motion.h2 {...fadeUp()} className="font-bold text-[#1A1A2E] tracking-[-0.02em]" style={{ fontSize: "clamp(36px, 4vw, 44px)" }}>
            {probTitle}
          </motion.h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {probCards.map((card, i) => (
              <motion.div key={card.title} {...fadeUp(0.1 + i * 0.1)}
                className="group rounded-2xl p-7 bg-white border border-[#E5E7EB] hover:border-[#FF7A59]/40 transition-all duration-300 hover:shadow-lg text-left">
                <span className="text-3xl block mb-4" style={{ color: HUBSPOT }}>{card.icon}</span>
                <h3 className="text-base font-bold text-[#1A1A2E] mb-2">{card.title}</h3>
                <p className="text-sm text-[#6B7280]">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.4)} className="mt-10 inline-block px-7 py-3 rounded-full text-base font-bold text-[#BE1869]"
            style={{ background: "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))" }}>
            {probPill}
          </motion.div>
        </div>
      </SectionShell>

      {/* ──── SERVICIOS ──── */}
      <SectionShell section={servicios} className="py-24 px-4 sm:px-6" defaultBg={{ background: "#F9FAFB" }}>
        <div id="servicios" className="relative z-10 container max-w-[1100px] mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-bold text-[#1A1A2E] tracking-[-0.02em]" style={{ fontSize: "clamp(32px, 4vw, 44px)" }}>{svcTitle}</h2>
            <p className="mt-3 text-[#6B7280] text-lg max-w-[500px] mx-auto">{svcSubtitle}</p>
          </motion.div>

          {/* Hidden SVG gradient for icons */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#BE1869" />
                <stop offset="100%" stopColor="#6224BE" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {svcList.slice(0, 3).map((svc, i) => <ServiceCard key={svc.title} svc={svc} index={i} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-[740px] mx-auto">
            {svcList.slice(3).map((svc, i) => <ServiceCard key={svc.title} svc={svc} index={i + 3} />)}
          </div>
        </div>
      </SectionShell>

      {/* ──── DIFERENCIA ──── */}
      <SectionShell section={diferencia} className="py-24 px-4 sm:px-6" defaultBg={{ background: "#1A1A2E" }}>
        <div className="relative z-10 container max-w-[1100px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Text */}
          <div className="lg:w-1/2">
            <motion.h2 {...fadeUp()} className="font-bold text-white tracking-[-0.02em]" style={{ fontSize: "clamp(32px, 4vw, 40px)", ...difStyle("title") }}>
              {difTitle}
            </motion.h2>
            {difBody.split("\n\n").map((p, i) => (
              <motion.p key={i} {...fadeUp(0.1 + i * 0.1)} className="mt-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {p}
              </motion.p>
            ))}
            <motion.div {...fadeUp(0.3)} className="mt-8 inline-flex items-center gap-3 px-5 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-2xl" style={{ color: HUBSPOT }}>🟠</span>
              <span className="text-white text-sm font-semibold">{difCredential}</span>
            </motion.div>
          </div>

          {/* Comparison */}
          <div className="lg:w-1/2 flex justify-center">
            <ComparisonColumns left={difComparison.left} right={difComparison.right} />
          </div>
        </div>
      </SectionShell>

      {/* ──── CTA FINAL ──── */}
      <SectionShell section={ctaFinal} className="py-20 px-4 sm:px-6" defaultBg={{ background: "#FFFFFF" }}>
        <div className="relative z-10 container max-w-[600px] mx-auto text-center">
          <motion.h2 {...fadeUp()} className="font-bold text-[#1A1A2E] tracking-[-0.02em]" style={{ fontSize: "clamp(32px, 4vw, 40px)" }}>
            {ctaTitle}
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-4 text-[#6B7280] text-lg">{ctaBody}</motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3.5 rounded-full text-white font-semibold text-base transition-shadow hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]"
              style={{ background: GRADIENT }}
              onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}>
              {ctaCta}
            </button>
            <Link to={ctaCta2Url}
              className="px-6 py-3 rounded-full text-sm font-semibold border-2 border-[#BE1869]/30 hover:border-[#BE1869] transition-colors"
              style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {ctaCta2}
            </Link>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
};

export default DisenaYConstruye;
