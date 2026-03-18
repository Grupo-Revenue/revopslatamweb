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
import hubspotDashboard from "@/assets/hubspot-dashboard-dark.png";

/* ─── Defaults ─── */
const DEF = {
  hero: {
    title: "Convierte HubSpot en un sistema de revenue.",
    subtitle: "Diseñamos, implementamos y operamos tu sistema completo en HubSpot: procesos, automatización y datos alineados para generar revenue real.",
    cta: "Agenda una conversación",
    cta2: "Ver cómo trabajamos",
    proof: "+10 años operando HubSpot",
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
      { q: "¿Qué es un HubSpot Partner?", a: "Un HubSpot Partner es una empresa certificada por HubSpot para implementar, configurar y operar sus productos. Los partners están organizados en niveles según su experiencia y volumen de clientes: Starter, Gold, Platinum, Diamond y Elite. Revops LATAM es HubSpot Platinum Partner en Chile, uno de los niveles más altos del ecosistema de partners en la región." },
      { q: "¿Cuál es la diferencia entre un partner Platinum y uno Gold?", a: "El nivel Platinum refleja mayor experiencia acumulada, mayor volumen de implementaciones exitosas y certificaciones más avanzadas del equipo. En el directorio global de HubSpot hay miles de partners, los niveles más altos representan una fracción pequeña. En Chile, los partners Platinum son especialmente escasos." },
      { q: "¿Cómo elegir un partner de HubSpot en Chile?", a: "Más allá del nivel de partnership, hay tres preguntas que importan: ¿El partner entiende tu tipo de negocio y proceso comercial? ¿Tiene experiencia operando HubSpot después de la implementación, o solo configura y se va? ¿Puede mostrarte implementaciones reales en empresas similares a la tuya? El nivel Platinum es una señal de experiencia, pero no reemplaza el fit estratégico." },
      { q: "¿Cuánto cuesta implementar HubSpot con un partner en Chile?", a: "El costo depende de la complejidad del proyecto: los módulos a implementar, el tamaño del equipo, las integraciones requeridas y el nivel de personalización. En Revops LATAM trabajamos con una calculadora de precios que entrega un rango según las características de cada proyecto. El punto de partida siempre es el diagnóstico, para no cotizar una implementación sin entender qué necesita realmente la empresa." },
      { q: "¿Puedo contratar HubSpot directamente sin un partner?", a: "Sí. HubSpot se puede contratar directamente en hubspot.com. Un partner agrega valor en la implementación, la configuración estratégica, la integración con otras herramientas y la operación continua. Si solo necesitas la licencia, no necesitas un partner. Si quieres que HubSpot funcione de verdad en tu operación, un partner con experiencia hace la diferencia entre una inversión que rinde y una que se desperdicia." },
      { q: "¿Revops LATAM solo trabaja con HubSpot?", a: "Sí. HubSpot es el ecosistema central de todo lo que hacemos. No somos technology-agnostic, somos especialistas. Esa especialización profunda es lo que nos permite implementar y operar HubSpot con el nivel de detalle que los resultados requieren. Podemos integrarlo con prácticamente cualquier herramienta del stack del cliente, pero el motor siempre es HubSpot." },
      { q: "¿Qué diferencia a Revops LATAM de otras consultoras HubSpot?", a: "Tres cosas concretas: primero, siempre empezamos con diagnóstico, nunca proponemos soluciones antes de entender el problema. Segundo, no entregamos y desaparecemos, ofrecemos operación continua post-implementación. Tercero, no somos una agencia que configura HubSpot: somos una consultora de Revenue Operations que usa HubSpot como motor central para construir operaciones comerciales que escalan." },
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

/* Hero Visual — Dashboard screenshot + Badge */
const HeroDashboardVisual = ({ imageUrl }: { imageUrl?: string }) => (
  <div className="relative w-full flex flex-col items-center" style={{ maxWidth: 850 }}>
    {/* Glow behind dashboard */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: "radial-gradient(ellipse at 50% 50%, rgba(190,24,105,0.12) 0%, rgba(98,36,190,0.06) 50%, transparent 80%)",
      filter: "blur(60px)",
      transform: "scale(1.2)",
    }} />


    {/* Dashboard screenshot */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative z-10 w-full"
    >
      <img
        src={imageUrl || hubspotDashboard}
        alt="HubSpot CRM Dashboard"
        className="w-full h-auto block"
      />
    </motion.div>
  </div>
);

function HubIcon({ icon, color }: { icon: string; color: string }) {
  const p = { size: 40, color };
  switch (icon) {
    case "megaphone": return <Megaphone {...p} />;
    case "chart": return <BarChart3 {...p} />;
    case "heart": return <Heart {...p} />;
    case "settings": return <Settings {...p} />;
    case "globe": return <Globe {...p} />;
    default: return <Megaphone {...p} />;
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
  type CompRow = { label: string; agency: string; revops: string };
  type HubDef = { badge: string; badgeColor: string; icon: string; title: string; desc: string; tag: string };
  type StepDef = { num: string; title: string; desc: string; chip: string };
  type FaqDef = { q: string; a: string };

  const h = {
    title: heroSec?.title ?? DEF.hero.title,
    subtitle: heroSec?.subtitle ?? DEF.hero.subtitle,
    cta: heroSec?.cta_text ?? DEF.hero.cta,
    cta2: (hm.cta2_text as string) ?? DEF.hero.cta2,
    proof: (hm.proof as string) ?? DEF.hero.proof,
  };

  const paragraphs = posSec?.body ? posSec.body.split("||") : DEF.posicionamiento.paragraphs;
  const pos = {
    title: posSec?.title ?? DEF.posicionamiento.title,
    callout: (pm.callout as string) ?? DEF.posicionamiento.callout,
    comparison: (Array.isArray(pm.comparison) ? pm.comparison as CompRow[] : null) || DEF.posicionamiento.comparison,
  };

  const eco = {
    eyebrow: (em.eyebrow as string) ?? DEF.ecosistema.eyebrow,
    title: ecoSec?.title ?? DEF.ecosistema.title,
    subtitle: ecoSec?.subtitle ?? DEF.ecosistema.subtitle,
    hubs: (Array.isArray(em.hubs) ? em.hubs as HubDef[] : null) || DEF.ecosistema.hubs,
  };

  const ct = {
    title: ctSec?.title ?? DEF.comoTrabajamos.title,
    subtitle: ctSec?.subtitle ?? DEF.comoTrabajamos.subtitle,
    steps: (Array.isArray(cm.steps) ? cm.steps as StepDef[] : null) || DEF.comoTrabajamos.steps,
  };

  const pq = {
    title: pqSec?.title ?? DEF.paraQuien.title,
    yes: (Array.isArray(pqm.yes_items) ? pqm.yes_items as string[] : null) || DEF.paraQuien.yes,
    no: (Array.isArray(pqm.no_items) ? pqm.no_items as string[] : null) || DEF.paraQuien.no,
  };

  const faq = {
    eyebrow: (fm.eyebrow as string) ?? DEF.faq.eyebrow,
    title: faqSec?.title ?? DEF.faq.title,
    faqs: (Array.isArray(fm.faqs) ? fm.faqs as FaqDef[] : null) || DEF.faq.faqs,
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
    document.title = "Partner HubSpot Chile | Revops LATAM, Consultora Platinum";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Revops LATAM es HubSpot Platinum Partner en Chile. No somos una agencia. Somos la consultora que implementa HubSpot y opera tu motor de ingresos completo. 14 años de experiencia.";
    if (meta) { meta.setAttribute("content", content); } else { const m = document.createElement("meta"); m.name = "description"; m.content = content; document.head.appendChild(m); }
  }, []);

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      {/* ══════════ SECTION 1 — HERO ══════════ */}
      <SectionShell section={heroSec} className="relative flex items-center px-6" defaultBg={{ minHeight: "100vh", background: "linear-gradient(180deg, #0D0D1A 0%, #111122 100%)", paddingTop: 100, paddingBottom: 80 }}>
        {/* Single subtle ambient orb */}
        <div className="absolute pointer-events-none" style={{ width: 600, height: 600, top: -150, left: -200, background: "radial-gradient(circle, rgba(190,24,105,0.07) 0%, transparent 60%)", filter: "blur(120px)" }} />

        <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-16" style={{ maxWidth: 1100 }}>
          {/* LEFT — Content */}
          <div>
            {/* Tag */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
              style={{ background: "rgba(255,122,89,0.05)", border: "1px solid rgba(255,122,89,0.12)", borderRadius: 999, padding: "6px 16px" }}>
              <span className="font-semibold uppercase tracking-wider" style={{ fontSize: 11, color: "#FF7A59" }}>HubSpot Platinum Partner en Chile</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white font-bold leading-[1.1] mb-5"
              style={{ fontSize: "clamp(30px, 3.2vw, 44px)" }}
            >
              {h.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
              style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 480, lineHeight: 1.7 }}
            >
              {h.subtitle}
            </motion.p>

            {/* Single proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[13px] font-medium mb-8"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {h.proof}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <DynamicCTA
                styleKey={(hm.cta_style_key as string) || (hm.cta1_style_key as string) || "primary"}
                onClick={() => { if (hm.cta1_opens_lead_form) openLeadForm("hubspot-partner-chile"); else if (heroSec?.cta_url) window.open(heroSec.cta_url, "_blank"); else openLeadForm("hubspot-partner-chile"); }}
              >
                {h.cta}
              </DynamicCTA>
              <DynamicCTA
                styleKey={(hm.cta2_style_key as string) || "text-link"}
                onClick={() => scrollToSection("como-trabajamos")}
              >
                {h.cta2}
              </DynamicCTA>
            </motion.div>
          </div>

          {/* RIGHT — Clean visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <HeroDashboardVisual imageUrl={heroSec?.image_url ?? undefined} />
          </motion.div>
        </div>
      </SectionShell>

      {/* ══════════ SECTION 2 — POSICIONAMIENTO ══════════ */}
      <SectionShell section={posSec} className="px-6" defaultBg={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 900 }}>
          {/* Eyebrow */}
          <FadeIn>
            <span
              className="inline-block uppercase font-bold tracking-[0.14em] mb-5"
              style={{ fontSize: 11, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              POR QUÉ SOMOS DIFERENTES
            </span>
          </FadeIn>

          {/* H2 */}
          <FadeIn delay={0.05}>
            <h2
              className="font-bold mx-auto mb-5 whitespace-pre-line"
              style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "hsl(var(--foreground))", lineHeight: 1.2, maxWidth: 700 }}
            >
              {pos.title}
            </h2>
          </FadeIn>

          {/* Subtitle — condensed */}
          <FadeIn delay={0.1}>
            <p className="mx-auto mb-14" style={{ fontSize: 16, color: "hsl(var(--muted-foreground))", maxWidth: 600, lineHeight: 1.7 }}>
              Hay cientos de partners. La diferencia no está en el badge, está en entender tu negocio antes de abrir la herramienta.
            </p>
          </FadeIn>

          {/* ─── TABLE — Protagonist ─── */}
          <FadeIn delay={0.15}>
            <div
              className="overflow-hidden mx-auto"
              style={{
                borderRadius: 20,
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                background: "hsl(var(--card))",
              }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-[1.2fr_1fr_1fr] items-center"
                style={{ padding: "20px 28px", borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--secondary))" }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                  Aspecto
                </span>
                <span className="text-center" style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
                  Agencia HubSpot
                </span>
                <div className="text-center">
                  <span
                    className="inline-block font-bold"
                    style={{
                      fontSize: 14,
                      backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      padding: "4px 16px",
                      borderRadius: 999,
                      background: "linear-gradient(135deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))",
                    }}
                  >
                    <span style={{ backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      Revops LATAM
                    </span>
                  </span>
                </div>
              </div>

              {/* Table Rows */}
              {pos.comparison.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="grid grid-cols-[1.2fr_1fr_1fr] items-center transition-colors duration-200"
                  style={{
                    padding: "20px 28px",
                    borderBottom: i < pos.comparison.length - 1 ? "1px solid hsl(var(--border))" : "none",
                    cursor: "default",
                  }}
                  whileHover={{ backgroundColor: "rgba(190,24,105,0.02)" }}
                >
                  <span style={{ fontSize: 15, color: "hsl(var(--foreground))", fontWeight: 600, textAlign: "left" }}>
                    {row.label}
                  </span>
                  <span className="text-center" style={{ fontSize: 15, color: "hsl(var(--muted-foreground))" }}>
                    {row.agency}
                  </span>
                  <div className="text-center flex items-center justify-center gap-2">
                    <Check size={16} style={{ color: "#BE1869", flexShrink: 0 }} />
                    <span
                      className="font-bold"
                      style={{ fontSize: 15, backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      {row.revops}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Callout — below table */}
          <FadeIn delay={0.25}>
            <p className="mx-auto mt-12 text-center" style={{ maxWidth: 700, fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
              {pos.callout}
            </p>
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
              <DynamicCTA
                styleKey={(ctam.cta_style_key as string) || (ctam.cta1_style_key as string) || "primary"}
                onClick={() => { if (ctam.cta1_opens_lead_form) openLeadForm("hubspot-partner-chile-cta"); else if (ctaFinalSec?.cta_url) window.open(ctaFinalSec.cta_url, "_blank"); else openLeadForm("hubspot-partner-chile-cta"); }}
              >
                {cta.cta}
              </DynamicCTA>
              <DynamicCTA
                styleKey={(ctam.cta2_style_key as string) || "outline"}
                onClick={() => { if (cta.cta2_url) window.open(cta.cta2_url, "_blank"); }}
              >
                {cta.cta2}
              </DynamicCTA>
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
