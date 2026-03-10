import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useIsMobile } from "@/hooks/use-mobile";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import WaveDivider from "@/components/services/WaveDivider";
import EcosystemDiagram from "@/components/services/EcosystemDiagram";

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";
const HUBSPOT = "#FF7A59";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

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

const RedirectChip = ({ label, href }: { label: string; href: string }) => (
  <Link to={href} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
    style={{ background: "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))", color: "#BE1869" }}
    onMouseEnter={e => { e.currentTarget.style.background = GRADIENT; e.currentTarget.style.color = "#fff"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))"; e.currentTarget.style.color = "#BE1869"; }}
  >{label} <ArrowRight size={14} /></Link>
);

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "TÉCNICO",
    title: "Tu ecosistema tecnológico, finalmente conectado",
    subtitle: "HubSpot conectado con tu ERP, tus herramientas y apps construidas a medida. Diseñamos cada integración antes de desarrollarla — siempre.",
    cta: "Cuéntanos qué sistemas necesitas conectar →",
    cta2_text: "¿Es este el servicio correcto? ↓",
    breadcrumb: "Diseña y Construye → Integraciones y Desarrollo",
    nodes: [
      { label: "ERP", sub: "SAP / Oracle", angle: 240, data: "Clientes, pedidos, facturación" },
      { label: "WhatsApp", sub: "Business", angle: 300, data: "Conversaciones, leads" },
      { label: "Slack", sub: "", angle: 0, data: "Notificaciones, alertas" },
      { label: "App", sub: "a medida", angle: 60, data: "Lógica de negocio custom" },
      { label: "Portal", sub: "cliente", angle: 120, data: "Tickets, contratos" },
      { label: "Facturación", sub: "", angle: 180, data: "Boletas, facturas, pagos" },
    ],
  },
  problema: {
    title: "La información más importante de tu negocio vive en silos",
    body: "Tu equipo ingresa la misma información dos veces. Los datos son inconsistentes. Las decisiones se toman con información parcial. Y HubSpot es solo una herramienta más del stack — no el centro.",
    silos: ["HubSpot", "ERP", "Otros"],
  },
  construimos: {
    title: "Lo que podemos construir",
    cards: [
      { icon: "🗄️", title: "Integración HubSpot + ERP", desc: "Conexión bidireccional con SAP, Oracle u otros. Clientes, pedidos, facturación — sincronizado según la lógica de tu negocio.", tags: ["SAP", "Oracle", "Bidireccional"], badge: null },
      { icon: "🔌", title: "Integraciones con terceros", desc: "HubSpot conectado con WhatsApp Business, Slack, plataformas de pago, firma electrónica y cualquier sistema con API disponible.", tags: ["WhatsApp", "Slack", "APIs REST"], badge: null },
      { icon: "💻", title: "Apps a medida", desc: "Cuando la herramienta que necesitas no existe en el mercado. Construimos aplicaciones diseñadas para tu proceso, integradas con HubSpot.", tags: ["Full-stack", "HubSpot API", "A medida"], badge: "Desarrollo custom" },
      { icon: "🌐", title: "Portales y micrositios", desc: "Portales de clientes, plataformas de autoservicio o micrositios construidos sobre HubSpot CMS con lógica de negocio personalizada.", tags: ["HubSpot CMS", "Portal clientes", "Lógica custom"], badge: null },
    ],
  },
  principio: {
    title: "Una integración mal pensada es peor que no tener ninguna",
    body1: "Antes de escribir una línea de código, diseñamos la integración completa: arquitectura de datos, flujo de sincronización, manejo de errores y qué pasa cuando algo falla.",
    body2: "Ese documento de diseño garantiza que la integración sea mantenible, escalable y que no se rompa cuando cambias algo en cualquiera de los sistemas involucrados.",
    stats: [
      { value: "Diseño primero", label: "antes de cada desarrollo" },
      { value: "Documentación completa", label: "en cada entrega" },
      { value: "Transferencia", label: "al equipo interno" },
    ],
  },
  proceso: {
    title: "El proceso",
    phases: [
      { badge: "Semana 1-2", title: "Discovery técnico", text: "Mapeamos los sistemas, los flujos de datos, los requerimientos exactos y los casos borde. Nada se asume.", chip: null },
      { badge: "Semana 2-3", title: "Diseño de la integración", text: "Arquitectura completa documentada antes de desarrollar. Validada contigo.", chip: "Diseñamos antes de codear" },
      { badge: "Semana 3-8", title: "Desarrollo e implementación", text: "Construcción con revisiones de avance. Código documentado y estructurado para que sea mantenible.", chip: null },
      { badge: "Semana 8-9", title: "Testing y go-live", text: "Pruebas en ambiente de staging, validación con datos reales, go-live controlado.", chip: null },
      { badge: "Post go-live", title: "Documentación y transferencia", text: "Documentación técnica completa y transferencia al equipo interno.", chip: "Siempre incluido" },
    ],
  },
  paraQuien: {
    title_yes: "Es para ti si",
    title_no: "No es para ti si",
    yes: [
      "HubSpot implementado, necesitas conectarlo con ERP",
      "Tu equipo ingresa la misma información en 2+ sistemas",
      "Necesitas una app que no existe en el mercado",
      "Quieres que HubSpot sea el centro real de tu operación",
    ],
    no: [
      { text: "HubSpot aún no está bien implementado", chip: { label: "Implementación a Medida →", href: "/implementacion-hubspot" } },
      { text: "Solo necesitas ajustar experiencia visual sin sincronizar", chip: { label: "Personalización CRM →", href: "/personalizacion-crm" } },
      { text: "La integración existe en el marketplace de HubSpot", chip: null },
    ],
  },
  precio: {
    label: "INVERSIÓN",
    headline: "Las integraciones son el servicio de mayor variabilidad en alcance y complejidad.",
    subtext: "Una integración simple con una API puede tomar días. Una integración bidireccional con ERP puede tomar semanas.",
    calcChip: "🔧 Calculadora de precio → disponible próximamente",
    cta: "Cuéntanos qué sistemas necesitas conectar →",
    link: "Evaluamos la complejidad técnica y te presentamos una propuesta en 48 horas →",
  },
};

/* (EcosystemDiagram moved to src/components/services/EcosystemDiagram.tsx) */

/* ─── Silos Visual ─── */
function SilosVisual({ silos }: { silos: string[] }) {
  const [connected, setConnected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="max-w-[600px] mx-auto my-10">
      <div className="flex items-stretch justify-center gap-0">
        {silos.map((s, i) => (
          <div key={i} className="flex items-center">
            <motion.div className="rounded-xl px-6 py-8 text-center flex-shrink-0"
              style={{ background: "#F9FAFB", border: connected ? "1px solid transparent" : "1px dashed #E5E7EB", borderImage: connected ? `${GRADIENT} 1` : undefined, minWidth: 120 }}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.15 }}>
              <span className="text-2xl block mb-2">{i === 0 ? "🟠" : i === 1 ? "🔵" : "⚪"}</span>
              <span className="text-sm font-bold" style={{ color: "#1A1A2E" }}>{s}</span>
            </motion.div>
            {i < silos.length - 1 && (
              <motion.div className="w-10 flex items-center justify-center shrink-0"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.2 }}>
                <span className="text-lg font-bold transition-all duration-600" style={{ color: connected ? "#22c55e" : "#ef4444" }}>
                  {connected ? "✓" : "✗"}
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <button onClick={() => setConnected(!connected)}
          className="text-sm font-semibold rounded-full px-6 py-2.5 transition-all duration-300 hover:scale-[1.03]"
          style={{ background: connected ? GRADIENT : "rgba(190,24,105,0.08)", color: connected ? "#fff" : "#BE1869" }}>
          {connected ? "Ver sin integración ←" : "Ver con integración →"}
        </button>
      </div>
    </div>
  );
}

/* ─── Service Cards ─── */
function ServiceCards({ cards }: { cards: typeof DEF.construimos.cards }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
      {cards.map((c, i) => (
        <motion.div key={i} {...fadeUp(0.1 + i * 0.08)}
          className="relative rounded-[20px] p-9 bg-white border transition-all duration-300 hover:shadow-xl group"
          style={{ borderColor: "#E5E7EB" }}
          onMouseEnter={e => { e.currentTarget.style.borderImage = `${GRADIENT} 1`; e.currentTarget.style.borderStyle = "solid"; }}
          onMouseLeave={e => { e.currentTarget.style.borderImage = ""; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
          {c.badge && (
            <span className="absolute top-5 right-5 text-[10px] font-bold uppercase px-3 py-1 rounded-full" style={{ background: `${HUBSPOT}1a`, color: HUBSPOT }}>{c.badge}</span>
          )}
          <span className="text-[40px] block mb-4">{c.icon}</span>
          <h3 className="font-bold text-base mb-2" style={{ color: "#1A1A2E" }}>{c.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>{c.desc}</p>
          <div className="flex flex-wrap gap-2">
            {c.tags.map(t => (
              <span key={t} className="text-[11px] px-3 py-1 rounded-full transition-colors duration-200 hover:bg-gray-200" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#6B7280" }}>{t}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Vertical Timeline ─── */
function PhasesTimeline({ phases }: { phases: typeof DEF.proceso.phases }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="relative max-w-[600px] mx-auto pl-10 md:pl-14">
      <svg className="absolute left-[17px] md:left-[25px] top-0 w-[2px] h-full">
        <defs><linearGradient id="idLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
        <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#idLine)" strokeWidth="2" strokeDasharray="600" initial={{ strokeDashoffset: 600 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 2.2 }} />
      </svg>
      <div className="space-y-10">
        {phases.map((ph, i) => (
          <motion.div key={i} className="relative" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.2 }}>
            <div className="absolute -left-10 md:-left-14 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm" style={{ background: GRADIENT }}>{i + 1}</div>
            <span className="inline-block text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full mb-2" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>{ph.badge}</span>
            <h4 className="font-bold text-base mb-2" style={{ color: "#1A1A2E" }}>{ph.title}</h4>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B7280" }}>{ph.text}</p>
            {ph.chip && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: `${HUBSPOT}1a`, color: HUBSPOT }}>{ph.chip}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function IntegracionesDesarrollo() {
  const { getSection } = usePageSections("integraciones-desarrollo");
  const hero = getSection("hero");
  const problema = getSection("problema");
  const construimos = getSection("construimos");
  const principio = getSection("principio");
  const proceso = getSection("proceso");
  const paraQuien = getSection("para-quien");
  const precio = getSection("precio");

  const hm = mt(hero), pm = mt(problema), cm = mt(construimos), prn = mt(principio), prm = mt(proceso), pqm = mt(paraQuien), prec = mt(precio);

  const h = { badge: (hm.badge as string) ?? DEF.hero.badge, title: hero?.title ?? DEF.hero.title, subtitle: hero?.subtitle ?? DEF.hero.subtitle, cta: hero?.cta_text ?? DEF.hero.cta, cta2: (hm.cta2_text as string) ?? DEF.hero.cta2_text, breadcrumb: (hm.breadcrumb as string) ?? DEF.hero.breadcrumb, nodes: (hm.nodes as typeof DEF.hero.nodes) ?? DEF.hero.nodes };
  const prob = { title: problema?.title ?? DEF.problema.title, body: problema?.body ?? DEF.problema.body, silos: (pm.silos as string[]) ?? DEF.problema.silos };
  const con = { title: construimos?.title ?? DEF.construimos.title, cards: (cm.cards as typeof DEF.construimos.cards) ?? DEF.construimos.cards };
  const prin = { title: principio?.title ?? DEF.principio.title, body1: (prn.body1 as string) ?? DEF.principio.body1, body2: (prn.body2 as string) ?? DEF.principio.body2, stats: (prn.stats as typeof DEF.principio.stats) ?? DEF.principio.stats };
  const proc = { title: proceso?.title ?? DEF.proceso.title, phases: (prm.phases as typeof DEF.proceso.phases) ?? DEF.proceso.phases };
  const pq = { title_yes: (pqm.title_yes as string) ?? DEF.paraQuien.title_yes, title_no: (pqm.title_no as string) ?? DEF.paraQuien.title_no, yes: (pqm.yes as string[]) ?? DEF.paraQuien.yes, no: (pqm.no as typeof DEF.paraQuien.no) ?? DEF.paraQuien.no };
  const pr = { label: (prec.label as string) ?? DEF.precio.label, headline: (prec.headline as string) ?? DEF.precio.headline, subtext: (prec.subtext as string) ?? DEF.precio.subtext, calcChip: (prec.calcChip as string) ?? DEF.precio.calcChip, cta: precio?.cta_text ?? DEF.precio.cta, link: (prec.link as string) ?? DEF.precio.link };

  const scrollToFit = () => document.getElementById("para-quien")?.scrollIntoView({ behavior: "smooth" });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="min-h-screen font-['Lexend']" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ── */}
      <SectionShell section={hero} className="min-h-[90vh] flex items-center" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-[55%_45%] gap-12 items-center">
          <div>
            <motion.p {...fadeUp()} className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{h.breadcrumb}</motion.p>
            <motion.span {...fadeUp(0.05)} className="inline-block text-[11px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-full mb-6 text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>{h.badge}</motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(40px, 5vw, 62px)", maxWidth: 580 }}>{h.title}</motion.h1>
            <motion.p {...fadeUp(0.15)} className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>{h.subtitle}</motion.p>
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
              <button className="text-sm font-semibold text-white rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]" style={{ background: GRADIENT }}>{h.cta}</button>
              <button onClick={scrollToFit} className="text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white transition-colors">{h.cta2}</button>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.25)} className="hidden lg:block">
            <EcosystemDiagram />
          </motion.div>
        </div>
      </SectionShell>

      

      {/* ── PROBLEMA ── */}
      <SectionShell section={problema} className="py-24 md:py-[120px]" defaultBg={{ background: "#fff" }}>
        <GradientMesh variant="light" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[700px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-6" style={{ color: "#1A1A2E", fontSize: "clamp(26px, 3.5vw, 34px)" }}>{prob.title}</motion.h2>
          <SilosVisual silos={prob.silos} />
          <motion.p {...fadeUp(0.2)} className="text-center text-sm leading-relaxed max-w-[560px] mx-auto" style={{ color: "#6B7280" }}>{prob.body}</motion.p>
        </div>
      </SectionShell>

      {/* ── LO QUE CONSTRUIMOS ── */}
      <SectionShell section={construimos} className="py-24 md:py-[100px]" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[1000px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{con.title}</motion.h2>
          <ServiceCards cards={con.cards} />
        </div>
      </SectionShell>

      {/* ── NUESTRO PRINCIPIO ── */}
      <SectionShell section={principio} className="py-20 md:py-[80px]" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="section" />
        <NoiseOverlay opacity={0.03} />
        <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
          <motion.h2 {...fadeUp()} className="font-bold text-white tracking-[-0.02em] mb-8" style={{ fontSize: "clamp(26px, 3.5vw, 36px)" }}>{prin.title}</motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>{prin.body1}</motion.p>
          <motion.p {...fadeUp(0.15)} className="text-base leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.7)" }}>{prin.body2}</motion.p>
          <motion.div {...fadeUp(0.25)} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {prin.stats.map((s, i) => (
              <div key={i} className="text-center">
                <span className="block text-lg font-bold bg-clip-text text-transparent mb-1" style={{ backgroundImage: GRADIENT }}>{s.value}</span>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </SectionShell>

      {/* ── PROCESO ── */}
      <SectionShell section={proceso} className="py-24 md:py-[100px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{proc.title}</motion.h2>
          <PhasesTimeline phases={proc.phases} />
        </div>
      </SectionShell>

      {/* ── PARA QUIÉN ── */}
      <SectionShell section={paraQuien} className="py-24 md:py-[100px]" defaultBg={{ background: "#F9FAFB" }}>
        <div id="para-quien" className="relative z-10 max-w-[1000px] mx-auto px-6 scroll-mt-32">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp()} className="rounded-2xl p-8 border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: GRADIENT }}>✓</span>
                {pq.title_yes}
              </h3>
              <ul className="space-y-3">
                {pq.yes.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-[15px]" style={{ color: "#374151" }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GRADIENT }} />{it}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="rounded-2xl p-8 border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>✗</span>
                {pq.title_no}
              </h3>
              <ul className="space-y-4">
                {pq.no.map((item, i) => (
                  <li key={i} className="text-base" style={{ color: "#6B7280" }}>
                    <p className="mb-2">{item.text}</p>
                    {item.chip && <RedirectChip label={item.chip.label} href={item.chip.href} />}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </SectionShell>

      {/* ── PRECIO ── */}
      
      <SectionShell section={precio} className="py-20 md:py-[80px]" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="section" />
        <GradientMesh variant="center" />
        <div className="relative z-10 max-w-[480px] mx-auto px-6">
          <motion.div {...fadeUp()} className="relative rounded-[20px] p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <span className="block text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{pr.label}</span>
            <h3 className="text-xl font-extrabold leading-tight mb-3" style={{ color: "#1A1A2E" }}>{pr.headline}</h3>
            <p className="text-sm mb-5" style={{ color: "#6B7280" }}>{pr.subtext}</p>
            <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />
            <div className="relative inline-block mb-5"
              onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
              <span className="inline-block text-sm px-5 py-2.5 rounded-xl cursor-default" style={{ background: "#F9FAFB", border: "1px dashed #E5E7EB", color: "#6B7280" }}>{pr.calcChip}</span>
              <AnimatePresence>
                {tooltipVisible && (
                  <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "#1A1A2E", color: "#fff" }}>Próximamente</motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />
            <button className="w-full text-sm font-semibold text-white rounded-full py-3.5 mb-3 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg" style={{ background: GRADIENT }}>{pr.cta}</button>
            <a href="#" className="text-sm font-medium hover:underline" style={{ color: "#BE1869" }}>{pr.link}</a>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
}
