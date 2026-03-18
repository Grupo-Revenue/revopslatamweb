import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Megaphone, BarChart3, Heart, Settings, Globe, Check, X, ChevronDown } from "lucide-react";
import { useLeadForm } from "@/hooks/useLeadForm";

import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import DynamicCTA from "@/components/DynamicCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hubspotPlatinumBadge from "@/assets/logos/hubspot-platinum-badge.png";

/* ─── Defaults ─── */
const DEF = {
  hero: {
    title: "Convertimos HubSpot\nen tu motor de ingresos.",
    subtitle: "No configuramos la herramienta y nos vamos. Diseñamos, implementamos y operamos el sistema completo que conecta marketing, ventas y servicio en una sola operación predecible.",
    cta: "Diseñemos tu motor de ingresos →",
    cta2: "Ver cómo trabajamos ↓",
    stats: [
      { value: "14+", label: "Años operando HubSpot" },
      { value: "Platinum", label: "Nivel de partnership" },
      { value: "5 Hubs", label: "Ecosistema completo" },
      { value: "B2B", label: "Foco exclusivo" },
    ],
  },
  posicionamiento: {
    title: "Ser partner de HubSpot no nos hace buenos.\nSaber operar el negocio detrás\nde la herramienta, sí.",
    paragraphs: [
      "Hay cientos de partners de HubSpot en el mundo. La diferencia no está en el badge, está en el enfoque.",
      "La mayoría llega, configura HubSpot según las mejores prácticas del manual, entrega el portal y desaparece. El equipo lo adopta parcialmente, los procesos se deterioran en 90 días y seis meses después nadie sabe si HubSpot está sirviendo para algo.",
    ],
    callout: "Nosotros hacemos lo contrario. Antes de abrir HubSpot, entendemos tu proceso comercial real. El resultado: un HubSpot que tu equipo usa, que produce datos confiables y que se convierte en la pista por donde fluye tu revenue.",
    comparison: [
      { label: "Foco", agency: "Implementar la herramienta", revops: "Operar el motor de ingresos" },
      { label: "Punto de partida", agency: "El software", revops: "Tu proceso comercial" },
      { label: "Entrega", agency: "Portal configurado", revops: "Sistema funcionando" },
      { label: "Después de implementar", agency: "Se van", revops: "Operamos contigo" },
      { label: "Éxito medido en", agency: "HubSpot bien configurado", revops: "Revenue predecible" },
      { label: "Estrategia incluida", agency: "No siempre", revops: "Siempre primero" },
    ],
  },
  ecosistema: {
    eyebrow: "LO QUE IMPLEMENTAMOS",
    title: "Implementamos todo el ecosistema HubSpot.\nSiempre desde la lógica del motor de ingresos.",
    subtitle: "Cada Hub de HubSpot es una pieza de la pista. La diferencia entre una implementación que funciona y una que no es si las piezas están conectadas entre sí, y con el proceso real del negocio.",
    hubs: [
      { badge: "GENERA LA DEMANDA", badgeColor: "#BE1869", icon: "megaphone", title: "Marketing Hub", desc: "Formularios, emails, nurturing, lead scoring, landing pages y atribución. Para que marketing demuestre su impacto real en el pipeline, no solo en clics e impresiones.", tag: "Ideal para equipos de marketing" },
      { badge: "CONVIERTE LEADS", badgeColor: "#0779D7", icon: "chart", title: "Sales Hub", desc: "Pipeline con etapas claras, automatizaciones de seguimiento, secuencias, playbooks y forecast confiable. Para que el Director Comercial lidere con datos, no con intuición.", tag: "Ideal para equipos comerciales" },
      { badge: "RETIENE Y EXPANDE", badgeColor: "#1CA398", icon: "heart", title: "Service Hub", desc: "Tickets, NPS, CSAT y alertas de churn. Para conectar la postventa al motor de ingresos completo, y que CS deje de ser invisible en la estrategia comercial.", tag: "Ideal para equipos de Customer Success" },
      { badge: "CONECTA TODO", badgeColor: "#6224BE", icon: "settings", title: "Operations Hub", desc: "Sincronización de datos, limpieza automática y workflows operativos avanzados. La pieza que hace que el resto del ecosistema funcione bien, cuando los datos están limpios, todas las decisiones mejoran.", tag: "Ideal para empresas con stack complejo" },
      { badge: "CIERRA EL CICLO", badgeColor: "#BE1869", icon: "globe", title: "Content Hub", desc: "Sitio web, blog, landing pages y SEO integrado en HubSpot. Para que cada visita, formulario y descarga quede registrada automáticamente en el perfil del contacto.", tag: "Ideal para presencia digital integrada al CRM" },
    ],
  },
  comoTrabajamos: {
    title: "Nuestra forma de implementar",
    subtitle: "No empezamos con HubSpot. Empezamos con tu proceso.",
    steps: [
      { num: "01", title: "Diagnóstico primero", desc: "Mapeamos tu operación comercial real antes de configurar cualquier cosa. Sin este paso, HubSpot queda configurado para una empresa ideal que no existe.", chip: "Siempre el primer paso" },
      { num: "02", title: "Diseño antes de construir", desc: "Arquitectura completa documentada y validada con el equipo antes de tocar el portal. Qué propiedades, qué pipeline, qué automatizaciones, qué reportes.", chip: "Cero sorpresas" },
      { num: "03", title: "Implementación con el equipo", desc: "Construimos junto al equipo que va a usar el sistema, no para ellos. La adopción no es un problema de capacitación: es un problema de participación en el diseño.", chip: "Adopción garantizada" },
      { num: "04", title: "Activación y acompañamiento", desc: "No entregamos el portal y desaparecemos. Acompañamos la activación, medimos el uso real y hacemos los ajustes necesarios. El sistema queda funcionando, no solo configurado.", chip: "Siempre incluido" },
    ],
  },
  paraQuien: {
    title: "No somos el partner correcto para todos.\nY eso está bien.",
    yes: [
      "Tienes entre 10 y 200 empleados y equipo comercial activo",
      "Quieres que HubSpot sea el centro de tu operación, no una herramienta más",
      "Buscas un partner que entienda el negocio, no solo la plataforma",
      "Quieres que alguien opere contigo después de la implementación",
      "Estás en Chile",
      "Quieres resultados medibles, no promesas",
    ],
    no: [
      "Solo necesitas configuración técnica sin estrategia",
      "Buscas el partner más barato del directorio",
      "No tienes equipo comercial activo ni proceso definido",
      "Quieres resultados en 2 semanas sin involucrarte",
    ],
  },
  faq: {
    eyebrow: "PREGUNTAS FRECUENTES",
    title: "Lo que más nos preguntan sobre\nser partner HubSpot en Chile",
    faqs: [
      { q: "¿Qué es un HubSpot Partner?", a: "Un HubSpot Partner es una empresa certificada por HubSpot para implementar, configurar y operar sus productos. Los partners están organizados en niveles según su experiencia y volumen de clientes: Starter, Gold, Platinum, Diamond y Elite. RevOps LATAM es HubSpot Platinum Partner en Chile, uno de los niveles más altos del ecosistema de partners en la región." },
      { q: "¿Cuál es la diferencia entre un partner Platinum y uno Gold?", a: "El nivel Platinum refleja mayor experiencia acumulada, mayor volumen de implementaciones exitosas y certificaciones más avanzadas del equipo. En el directorio global de HubSpot hay miles de partners, los niveles más altos representan una fracción pequeña. En Chile, los partners Platinum son especialmente escasos." },
      { q: "¿Cómo elegir un partner de HubSpot en Chile?", a: "Más allá del nivel de partnership, hay tres preguntas que importan: ¿El partner entiende tu tipo de negocio y proceso comercial? ¿Tiene experiencia operando HubSpot después de la implementación, o solo configura y se va? ¿Puede mostrarte implementaciones reales en empresas similares a la tuya? El nivel Platinum es una señal de experiencia, pero no reemplaza el fit estratégico." },
      { q: "¿Cuánto cuesta implementar HubSpot con un partner en Chile?", a: "El costo depende de la complejidad del proyecto: los módulos a implementar, el tamaño del equipo, las integraciones requeridas y el nivel de personalización. En RevOps LATAM trabajamos con una calculadora de precios que entrega un rango según las características de cada proyecto. El punto de partida siempre es el diagnóstico, para no cotizar una implementación sin entender qué necesita realmente la empresa." },
      { q: "¿Puedo contratar HubSpot directamente sin un partner?", a: "Sí. HubSpot se puede contratar directamente en hubspot.com. Un partner agrega valor en la implementación, la configuración estratégica, la integración con otras herramientas y la operación continua. Si solo necesitas la licencia, no necesitas un partner. Si quieres que HubSpot funcione de verdad en tu operación, un partner con experiencia hace la diferencia entre una inversión que rinde y una que se desperdicia." },
      { q: "¿RevOps LATAM solo trabaja con HubSpot?", a: "Sí. HubSpot es el ecosistema central de todo lo que hacemos. No somos technology-agnostic, somos especialistas. Esa especialización profunda es lo que nos permite implementar y operar HubSpot con el nivel de detalle que los resultados requieren. Podemos integrarlo con prácticamente cualquier herramienta del stack del cliente, pero el motor siempre es HubSpot." },
      { q: "¿Qué diferencia a RevOps LATAM de otras consultoras HubSpot?", a: "Tres cosas concretas: primero, siempre empezamos con diagnóstico, nunca proponemos soluciones antes de entender el problema. Segundo, no entregamos y desaparecemos, ofrecemos operación continua post-implementación. Tercero, no somos una agencia que configura HubSpot: somos una consultora de Revenue Operations que usa HubSpot como motor central para construir operaciones comerciales que escalan." },
    ],
  },
  ctaFinal: {
    badge: "HABLEMOS",
    title: "¿Buscas un partner de HubSpot\nque entienda tu negocio,\nno solo la herramienta?",
    subtitle: "El primer paso es una conversación. En 30 minutos entendemos tu situación, te decimos con honestidad si somos el equipo correcto para ti y qué tendría más impacto en tu operación.",
    cta: "Agenda una conversación →",
    cta2: "Ver el Pulso Comercial gratuito →",
    cta2_url: "https://pulso.revopslatam.com/",
  },
};

/* ─── Helpers ─── */
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

const FadeIn = ({ children, className = "", delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const offset = direction === "right" ? -40 : direction === "left" ? 40 : direction === "down" ? -20 : 20;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, [axis]: offset }} animate={inView ? { opacity: 1, [axis]: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
};

const StatCounter = ({ value, suffix = "", label, counterVal }: { value?: string; suffix?: string; label: string; counterVal?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useAnimatedCounter(counterVal ?? 0, 1500, inView && !!counterVal, "");
  const display = counterVal ? `${animated} años` : (value ?? suffix);
  return (
    <div ref={ref} className="text-center">
      <div className="text-[32px] font-bold" style={{ backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{display}</div>
      <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
    </div>
  );
};

function HubIcon({ icon, color }: { icon: string; color: string }) {
  const useGradient = icon === "megaphone" || icon === "globe";
  const p = { size: 40 };
  const style = useGradient ? {} : { color };
  const stroke = useGradient ? "url(#grad)" : undefined;
  switch (icon) {
    case "megaphone": return <Megaphone {...p} stroke={stroke} style={style} />;
    case "chart": return <BarChart3 {...p} stroke={stroke} style={style} />;
    case "heart": return <Heart {...p} stroke={stroke} style={style} />;
    case "settings": return <Settings {...p} stroke={stroke} style={style} />;
    case "globe": return <Globe {...p} stroke={stroke} style={style} />;
    default: return <Megaphone {...p} stroke={stroke} style={style} />;
  }
}

/* ═══════════════════════════════════════ */
const HubspotPartnerChile = () => {
  const { openLeadForm } = useLeadForm();
  const { getSection, getMeta } = usePageSections("hubspot-partner-chile");
  const [openFaq, setOpenFaq] = useState(0);

  // Sections
  const heroSec = getSection("hero");
  const posSec = getSection("posicionamiento");
  const ecoSec = getSection("ecosistema");
  const ctSec = getSection("como-trabajamos");
  const pqSec = getSection("para-quien");
  const faqSec = getSection("faq");
  const ctaFinalSec = getSection("cta-final");

  // Metadata
  const hm = mt(heroSec), pm = mt(posSec), em = mt(ecoSec), cm = mt(ctSec), pqm = mt(pqSec), fm = mt(faqSec), ctam = mt(ctaFinalSec);

  // Resolved values with CMS → fallback
  type StatDef = { value: string; label: string; counter?: number };
  type CompRow = { label: string; agency: string; revops: string };
  type HubDef = { badge: string; badgeColor: string; icon: string; title: string; desc: string; tag: string };
  type StepDef = { num: string; title: string; desc: string; chip: string };
  type FaqDef = { q: string; a: string };

  const h = {
    title: heroSec?.title ?? DEF.hero.title,
    subtitle: heroSec?.subtitle ?? DEF.hero.subtitle,
    cta: heroSec?.cta_text ?? DEF.hero.cta,
    cta2: (hm.cta2_text as string) ?? DEF.hero.cta2,
    stats: (hm.stats as StatDef[]) ?? DEF.hero.stats,
  };

  const paragraphs = posSec?.body ? posSec.body.split("||") : DEF.posicionamiento.paragraphs;
  const pos = {
    title: posSec?.title ?? DEF.posicionamiento.title,
    callout: (pm.callout as string) ?? DEF.posicionamiento.callout,
    comparison: (pm.comparison as CompRow[]) ?? DEF.posicionamiento.comparison,
  };

  const eco = {
    eyebrow: (em.eyebrow as string) ?? DEF.ecosistema.eyebrow,
    title: ecoSec?.title ?? DEF.ecosistema.title,
    subtitle: ecoSec?.subtitle ?? DEF.ecosistema.subtitle,
    hubs: (em.hubs as HubDef[]) ?? DEF.ecosistema.hubs,
  };

  const ct = {
    title: ctSec?.title ?? DEF.comoTrabajamos.title,
    subtitle: ctSec?.subtitle ?? DEF.comoTrabajamos.subtitle,
    steps: (cm.steps as StepDef[]) ?? DEF.comoTrabajamos.steps,
  };

  const pq = {
    title: pqSec?.title ?? DEF.paraQuien.title,
    yes: (pqm.yes_items as string[]) ?? DEF.paraQuien.yes,
    no: (pqm.no_items as string[]) ?? DEF.paraQuien.no,
  };

  const faq = {
    eyebrow: (fm.eyebrow as string) ?? DEF.faq.eyebrow,
    title: faqSec?.title ?? DEF.faq.title,
    faqs: (fm.faqs as FaqDef[]) ?? DEF.faq.faqs,
  };

  const cta = {
    badge: (ctam.badge as string) ?? DEF.ctaFinal.badge,
    title: ctaFinalSec?.title ?? DEF.ctaFinal.title,
    subtitle: ctaFinalSec?.subtitle ?? DEF.ctaFinal.subtitle,
    cta: ctaFinalSec?.cta_text ?? DEF.ctaFinal.cta,
    cta2: (ctam.cta2_text as string) ?? DEF.ctaFinal.cta2,
    cta2_url: (ctam.cta2_url as string) ?? DEF.ctaFinal.cta2_url,
  };

  useEffect(() => {
    document.title = "Partner HubSpot Chile | RevOps LATAM, Consultora Platinum";
    const meta = document.querySelector('meta[name="description"]');
    const content = "RevOps LATAM es HubSpot Platinum Partner en Chile. No somos una agencia. Somos la consultora que implementa HubSpot y opera tu motor de ingresos completo. 14 años de experiencia.";
    if (meta) { meta.setAttribute("content", content); } else { const m = document.createElement("meta"); m.name = "description"; m.content = content; document.head.appendChild(m); }
  }, []);

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      {/* ══════════ SECTION 1 — HERO ══════════ */}
      <SectionShell section={heroSec} className="relative px-6" defaultBg={{ minHeight: "100vh", background: "#08080F", paddingTop: 140, paddingBottom: 80 }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Ambient glows — very subtle */}
        <div className="absolute pointer-events-none" style={{ width: 800, height: 800, top: -200, left: -300, background: "radial-gradient(circle, rgba(190,24,105,0.06) 0%, transparent 60%)", filter: "blur(120px)" }} />
        <div className="absolute pointer-events-none" style={{ width: 600, height: 600, bottom: -100, right: -200, background: "radial-gradient(circle, rgba(98,36,190,0.06) 0%, transparent 60%)", filter: "blur(120px)" }} />

        <div className="relative z-10 mx-auto" style={{ maxWidth: 1100 }}>
          {/* Top: Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8">
            <img src={hubspotPlatinumBadge} alt="HubSpot Platinum Partner" className="h-10 w-auto" style={{ filter: "brightness(1.1)" }} />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>Platinum Partner · Chile</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white font-bold leading-[1.06] mb-6 whitespace-pre-line" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", maxWidth: 800, letterSpacing: "-0.02em" }}>
            {h.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-10" style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 580, lineHeight: 1.7 }}>
            {h.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-16">
            <DynamicCTA styleKey={hm.cta_style_key as string}
              onClick={() => { if (hm.cta1_opens_lead_form) openLeadForm("hubspot-partner-chile"); else if (heroSec?.cta_url) window.open(heroSec.cta_url, "_blank"); else openLeadForm("hubspot-partner-chile"); }}
              className="text-white font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, hsl(337 74% 44%), hsl(263 70% 44%))", borderRadius: 999, padding: "14px 32px", fontSize: 15, boxShadow: "0 4px 24px rgba(190,24,105,0.25)" }}>
              {h.cta}
            </DynamicCTA>
            <button onClick={() => scrollToSection("como-trabajamos")}
              className="font-medium transition-colors duration-300 hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none", fontSize: 15, cursor: "pointer" }}>
              {h.cta2}
            </button>
          </motion.div>

          {/* ── Revenue Engine Visual ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px" }}
          >
            {/* System glow */}
            <div className="absolute pointer-events-none" style={{ width: "50%", height: "100%", top: 0, left: "25%", background: "radial-gradient(ellipse at center, rgba(190,24,105,0.05) 0%, transparent 70%)" }} />

            {/* Pipeline stages */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 relative">
              {[
                { stage: "Visitantes", metric: "12,400", color: "rgba(255,255,255,0.15)", icon: "○" },
                { stage: "Leads", metric: "1,860", color: "rgba(190,24,105,0.3)", icon: "◉" },
                { stage: "MQL", metric: "620", color: "rgba(190,24,105,0.5)", icon: "◉" },
                { stage: "SQL", metric: "248", color: "rgba(98,36,190,0.5)", icon: "◉" },
                { stage: "Deals", metric: "94", color: "rgba(98,36,190,0.7)", icon: "◉" },
                { stage: "Revenue", metric: "$2.4M", color: "rgba(7,121,215,0.6)", icon: "★" },
              ].map((s, i, arr) => (
                <div key={s.stage} className="flex items-center flex-1">
                  <motion.div
                    className="flex flex-col items-center text-center flex-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  >
                    {/* Node */}
                    <div className="relative mb-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center" style={{
                        background: s.color,
                        border: `1px solid ${s.color.replace(/[\d.]+\)$/, '0.6)')}`,
                        backdropFilter: "blur(10px)",
                      }}>
                        <span className="text-white font-bold text-sm sm:text-base">{s.metric}</span>
                      </div>
                      {/* Pulse on last node */}
                      {i === arr.length - 1 && (
                        <motion.div
                          className="absolute -inset-1 rounded-xl"
                          style={{ border: "1px solid rgba(7,121,215,0.3)" }}
                          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{s.stage}</span>
                  </motion.div>
                  {/* Connector line */}
                  {i < arr.length - 1 && (
                    <motion.div
                      className="h-px flex-shrink-0 hidden sm:block"
                      style={{ width: 24, background: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.15), rgba(255,255,255,0.08))", marginBottom: 20 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom label */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] px-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                Tu motor de ingresos operando en HubSpot
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>
          </motion.div>

          {/* ── Trust Bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {(h.stats as { value: string; label: string }[]).map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-lg sm:text-xl font-bold text-white">{stat.value}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", maxWidth: 100, lineHeight: 1.3 }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 2 — POSICIONAMIENTO ══════════ */}
      <SectionShell section={posSec} className="px-6" defaultBg={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start" style={{ maxWidth: 1100 }}>
          <FadeIn>
            <div style={{ maxWidth: 480 }}>
              <h2 className="font-bold mb-8 whitespace-pre-line" style={{ fontSize: 34, color: "#1A1A2E", lineHeight: 1.25 }}>{pos.title}</h2>
              {paragraphs.map((p, i) => (
                <p key={i} className="mb-5" style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>{p}</p>
              ))}
              <div style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.04), rgba(98,36,190,0.04))", borderLeft: "3px solid", borderImage: "linear-gradient(180deg, #BE1869, #6224BE) 1", borderRadius: "0 12px 12px 0", padding: "20px 24px" }}>
                <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.7, fontWeight: 500 }}>{pos.callout}</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div style={{ background: "#F9FAFB", borderRadius: 20, padding: 32, border: "1px solid #E5E7EB", boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}>
              <div className="grid grid-cols-[1fr_1fr_1fr] mb-4" style={{ gap: 8 }}>
                <div />
                <div className="text-center" style={{ fontSize: 13, color: "#9CA3AF" }}>Agencia HubSpot</div>
                <div className="text-center font-bold" style={{ fontSize: 13, borderTop: "2px solid", borderImage: "linear-gradient(135deg, #BE1869, #6224BE) 1", background: "linear-gradient(135deg, rgba(190,24,105,0.04), rgba(98,36,190,0.04))", padding: "8px 4px 4px", borderRadius: "8px 8px 0 0" }}>
                  <span style={{ backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RevOps LATAM</span>
                </div>
              </div>
              {pos.comparison.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr] items-center" style={{ gap: 8, padding: "12px 0", borderBottom: i < pos.comparison.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{row.label}</span>
                  <span className="text-center" style={{ fontSize: 14, color: "#9CA3AF" }}>{row.agency}</span>
                  <div className="text-center flex items-center justify-center gap-1">
                    <Check size={14} style={{ color: "#BE1869", flexShrink: 0 }} />
                    <span className="font-bold" style={{ fontSize: 14, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{row.revops}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 3 — ECOSISTEMA ══════════ */}
      <SectionShell section={ecoSec} className="px-6" defaultBg={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 1100 }}>
          <FadeIn>
            <span className="uppercase font-bold tracking-widest mb-4 inline-block" style={{ fontSize: 11, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{eco.eyebrow}</span>
            <h2 className="font-bold mb-5 mx-auto whitespace-pre-line" style={{ fontSize: 34, color: "#1A1A2E", maxWidth: 640, lineHeight: 1.25 }}>{eco.title}</h2>
            <p className="mx-auto mb-14" style={{ fontSize: 16, color: "#6B7280", maxWidth: 560, lineHeight: 1.7 }}>{eco.subtitle}</p>
          </FadeIn>

          <svg width="0" height="0" className="absolute"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs></svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eco.hubs.map((card, i) => (
              <FadeIn key={card.title || i} delay={i * 0.1}>
                <div className="text-left h-full transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "#FFFFFF", borderRadius: 20, padding: 36, border: "1px solid #E5E7EB" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#BE1869"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(190,24,105,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}>
                  <span className="inline-block uppercase font-bold tracking-wider mb-4" style={{ fontSize: 11, color: card.badgeColor, background: `${card.badgeColor}14`, borderRadius: 999, padding: "4px 12px" }}>{card.badge}</span>
                  <div className="mb-4"><HubIcon icon={card.icon} color={card.badgeColor} /></div>
                  <h3 className="font-bold mb-3" style={{ fontSize: 17, color: "#1A1A2E" }}>{card.title}</h3>
                  <p className="mb-5" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{card.desc}</p>
                  <span style={{ display: "inline-block", fontSize: 12, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 999, padding: "4px 14px" }}>{card.tag}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 4 — CÓMO TRABAJAMOS ══════════ */}
      <SectionShell section={ctSec} className="px-6" defaultBg={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div id="como-trabajamos" className="relative z-10 mx-auto text-center scroll-mt-32" style={{ maxWidth: 900 }}>
          <FadeIn>
            <h2 className="font-bold mb-3" style={{ fontSize: 32, color: "#1A1A2E" }}>{ct.title}</h2>
            <p className="italic mb-14" style={{ fontSize: 16, color: "#6B7280" }}>{ct.subtitle}</p>
          </FadeIn>

          <div className="relative">
            <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[3px]" style={{ background: "linear-gradient(90deg, #BE1869, #6224BE)" }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {ct.steps.map((step, i) => (
                <FadeIn key={step.num || i} delay={i * 0.15}>
                  <div className="relative flex flex-col items-center text-center">
                    {i < ct.steps.length - 1 && <div className="lg:hidden absolute top-[56px] left-1/2 -translate-x-1/2 w-[3px] h-[calc(100%+32px)]" style={{ background: "linear-gradient(180deg, #BE1869, #6224BE)" }} />}
                    <div className="relative z-10 flex items-center justify-center text-white font-bold mb-5" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #BE1869, #6224BE)", fontSize: 18 }}>{step.num}</div>
                    <h3 className="font-bold mb-3" style={{ fontSize: 16, color: "#1A1A2E" }}>{step.title}</h3>
                    <p className="mb-4" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{step.desc}</p>
                    <span className="inline-block font-semibold" style={{ fontSize: 12, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "4px 14px", borderRadius: 999, border: "1px solid rgba(190,24,105,0.15)" }}>{step.chip}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 5 — PARA QUIÉN ══════════ */}
      <SectionShell section={pqSec} className="px-6" defaultBg={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div className="relative z-10 mx-auto" style={{ maxWidth: 800 }}>
          <FadeIn><h2 className="font-bold text-center mb-10 whitespace-pre-line" style={{ fontSize: 30, color: "#1A1A2E", lineHeight: 1.3 }}>{pq.title}</h2></FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div style={{ background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 20, padding: 32 }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "rgba(22,163,74,0.15)" }}><Check size={14} style={{ color: "#16A34A" }} /></div>
                  <span className="font-bold" style={{ fontSize: 14, color: "#16A34A" }}>Somos el partner correcto si:</span>
                </div>
                <ul className="space-y-3">
                  {pq.yes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: "#374151" }}><Check size={16} className="shrink-0 mt-0.5" style={{ color: "#16A34A" }} /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 20, padding: 32 }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "rgba(220,38,38,0.12)" }}><X size={14} style={{ color: "#DC2626" }} /></div>
                  <span className="font-bold" style={{ fontSize: 14, color: "#DC2626" }}>No somos el partner correcto si:</span>
                </div>
                <ul className="space-y-3">
                  {pq.no.map((item, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: "#374151" }}><X size={16} className="shrink-0 mt-0.5" style={{ color: "#DC2626" }} /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 6 — FAQ ══════════ */}
      <SectionShell section={faqSec} className="px-6" defaultBg={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="relative z-10 mx-auto" style={{ maxWidth: 720 }}>
          <FadeIn>
            <div className="text-center mb-12">
              <span className="uppercase font-bold tracking-widest mb-4 inline-block" style={{ fontSize: 11, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{faq.eyebrow}</span>
              <h2 className="font-bold whitespace-pre-line" style={{ fontSize: 30, color: "#1A1A2E", lineHeight: 1.3 }}>{faq.title}</h2>
            </div>
          </FadeIn>
          <div>
            {faq.faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <button onClick={() => setOpenFaq(isOpen ? -1 : i)} className="w-full flex items-center justify-between text-left cursor-pointer" style={{ padding: "20px 0" }}>
                      <span className="font-bold pr-4" style={{ fontSize: 16, color: "#1A1A2E" }}>{item.q}</span>
                      <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ color: "#9CA3AF", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </button>
                    <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, paddingBottom: 20 }}>{item.a}</p>
                    </motion.div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 7 — CTA FINAL ══════════ */}
      <SectionShell section={ctaFinalSec} className="px-6" defaultBg={{ background: "#1A1A2E", padding: "80px 24px" }}>
        <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 620 }}>
          <FadeIn>
            <span className="inline-block uppercase font-bold tracking-wider mb-6" style={{ fontSize: 11, color: "#FF7A59", background: "rgba(255,122,89,0.15)", borderRadius: 999, padding: "6px 16px" }}>{cta.badge}</span>
            <h2 className="text-white font-bold mb-5 whitespace-pre-line" style={{ fontSize: 30, lineHeight: 1.3 }}>{cta.title}</h2>
            <p className="mb-10" style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{cta.subtitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <DynamicCTA styleKey={ctam.cta_style_key as string}
                onClick={() => { if (ctam.cta1_opens_lead_form) openLeadForm("hubspot-partner-chile-cta"); else if (ctaFinalSec?.cta_url) window.open(ctaFinalSec.cta_url, "_blank"); else openLeadForm("hubspot-partner-chile-cta"); }}
                className="text-white font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #BE1869, #6224BE)", borderRadius: 999, padding: "16px 36px", fontSize: 16 }}>{cta.cta}</DynamicCTA>
              <a href={cta.cta2_url} target="_blank" rel="noopener noreferrer"
                className="font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{ color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "16px 36px", fontSize: 16, background: "transparent" }}>{cta.cta2}</a>
            </div>
          </FadeIn>
        </div>
      </SectionShell>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faq.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />

      <Footer />
    </div>
  );
};

export default HubspotPartnerChile;
