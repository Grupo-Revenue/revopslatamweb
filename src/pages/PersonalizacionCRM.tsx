import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import WaveDivider from "@/components/services/WaveDivider";

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
    badge: "AVANZADO",
    title: "HubSpot que se ve y funciona como tu negocio",
    subtitle: "HubSpot está implementado. El proceso funciona. Pero el equipo pierde tiempo en fricción que no debería existir. La resolvemos.",
    cta: "Muéstranos cómo trabaja tu equipo →",
    cta2_text: "¿Es este el servicio correcto? ↓",
    breadcrumb: "Diseña y Construye → Personalización del CRM",
    panels: [
      { bg: "rgba(255,122,89,0.08)", borderColor: HUBSPOT, label: "📊 ERP — Facturación", labelColor: HUBSPOT, text: "Último pedido: $4.2M · Estado: Entregado ✓" },
      { bg: "rgba(190,24,105,0.08)", borderColor: "#BE1869", label: "🔄 Automatización activa", labelColor: "#BE1869", text: "Tarea creada: Follow-up en 3 días" },
      { bg: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.15)", label: "📋 Vista del rol: Account Manager", labelColor: "rgba(255,255,255,0.6)", text: "NPS: 72 · Contratos activos: 3 · Última interacción: Hoy" },
    ],
  },
  problema: {
    title: "Un CRM que funciona no es lo mismo que uno que el equipo ama usar",
    pains: [
      { icon: "⏱️", text: "Abrir 3 pestañas para ver el historial completo de un cliente" },
      { icon: "😤", text: "Información crítica que vive en otro sistema y obliga a cambiar de contexto" },
      { icon: "📉", text: "Vistas genéricas que no reflejan lo que necesita cada rol" },
    ],
  },
  construimos: {
    title: "Lo que podemos construir para ti",
    items: [
      { num: "01", title: "CRM Cards personalizadas", text: "Información de sistemas externos — ERP, facturación, soporte — visible directamente dentro del deal o contacto. Sin cambiar de pestaña.", tag: "HubSpot CRM Extensions API", tagType: "hubspot" },
      { num: "02", title: "UI Extensions", text: "Paneles y vistas completamente personalizadas dentro del CRM. Si no existe en HubSpot estándar, lo construimos.", tag: "React + HubSpot UI Extensions", tagType: "hubspot" },
      { num: "03", title: "Vistas de trabajo por rol", text: "Lo que ve un SDR es distinto a lo que necesita un Account Manager o un gerente. Diseñamos cada vista para cada función.", tag: "Diseño UX + HubSpot", tagType: "brand" },
      { num: "04", title: "Objetos custom y relaciones", text: "Cuando el modelo de datos estándar de HubSpot no refleja la complejidad de tu negocio, creamos los objetos que faltan.", tag: "HubSpot Custom Objects", tagType: "hubspot" },
      { num: "05", title: "Automatizaciones avanzadas con UI", text: "Flujos de automatización integrados con la experiencia personalizada para que el proceso ocurra donde el equipo trabaja.", tag: "Workflows + Custom Code", tagType: "brand" },
    ],
  },
  proceso: {
    title: "El proceso",
    phases: [
      { badge: "Semana 1-2", title: "Discovery técnico", text: "Mapeamos qué necesita cada rol, qué información falta y qué sistemas externos tienen datos relevantes.", chip: null },
      { badge: "Semana 2-3", title: "Diseño de la solución", text: "Wireframes de la UI antes de desarrollar. El equipo valida antes de que se construya.", chip: "Diseñamos antes de codear" },
      { badge: "Semana 3-6", title: "Desarrollo e implementación", text: "Construcción en el portal con revisiones de avance.", chip: null },
      { badge: "Semana 6-7", title: "Testing, ajustes y entrega", text: "QA completo, ajustes finales y documentación técnica de todo lo desarrollado.", chip: null },
    ],
  },
  paraQuien: {
    title_yes: "Es para ti si",
    title_no: "No es para ti si",
    yes: [
      "HubSpot implementado y funcionando con proceso claro",
      "Equipos grandes o roles muy distintos",
      "Información en otros sistemas que debería estar en CRM",
      "Fricción en uso diario que afecta velocidad del equipo",
    ],
    no: [
      { text: "HubSpot aún no está bien implementado", chip: { label: "Implementación a Medida →", href: "/implementacion-hubspot" } },
      { text: "Necesitas sincronizar datos entre sistemas (no solo verlos)", chip: { label: "Integraciones Custom →", href: "/integraciones-desarrollo" } },
    ],
  },
  precio: {
    label: "INVERSIÓN",
    headline: "Cada proyecto de personalización es único.",
    subtext: "El alcance depende de cuántos roles necesitan experiencias distintas y qué sistemas externos se deben conectar visualmente.",
    calcChip: "🔧 Calculadora de precio → disponible próximamente",
    cta: "Muéstranos cómo trabaja tu equipo →",
    link: "Conversemos 30 minutos, sin compromiso →",
  },
};

/* ─── CRM Mockup ─── */
function CRMMockup({ panels }: { panels: typeof DEF.hero.panels }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Window header */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#eab308" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <span className="text-[11px] text-white/40 ml-2">Deal: Empresa Ejemplo S.A.</span>
      </div>
      {/* Tabs */}
      <div className="flex gap-0 px-5 pt-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["Resumen", "Actividad", "Custom"].map((t, i) => (
          <span key={t} className="text-[10px] px-4 py-2 rounded-t-lg" style={{ background: i === 2 ? "rgba(255,255,255,0.06)" : "transparent", color: i === 2 ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: i === 2 ? 700 : 400 }}>{t}</span>
        ))}
      </div>
      {/* Panels */}
      <div className="p-5 space-y-3">
        {panels.map((p, i) => (
          <motion.div key={i} className="rounded-xl px-4 py-3" style={{ background: p.bg, borderLeft: `3px solid ${p.borderColor}` }}
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 + i * 0.3, duration: 0.5 }}>
            <span className="text-[11px] font-bold block mb-1" style={{ color: p.labelColor }}>{p.label}</span>
            <span className="text-xs text-white/70">{p.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Accordion ─── */
function TechAccordion({ items }: { items: typeof DEF.construimos.items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-[700px] mx-auto">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center gap-4 py-5 text-left">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent shrink-0" style={{ backgroundImage: GRADIENT }}>{item.num}</span>
            <span className="font-bold text-base flex-1" style={{ color: "#1A1A2E" }}>{item.title}</span>
            <ChevronDown size={18} className="transition-transform duration-200 shrink-0" style={{ color: "#6B7280", transform: open === i ? "rotate(180deg)" : "rotate(0)" }} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="pb-5 pl-12">
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>{item.text}</p>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ background: item.tagType === "hubspot" ? `${HUBSPOT}1a` : "linear-gradient(90deg, rgba(190,24,105,0.1), rgba(98,36,190,0.1))", color: item.tagType === "hubspot" ? HUBSPOT : "#BE1869" }}>
                    {item.tag}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        <defs><linearGradient id="pcLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
        <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#pcLine)" strokeWidth="2" strokeDasharray="500" initial={{ strokeDashoffset: 500 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.8 }} />
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
export default function PersonalizacionCRM() {
  const { getSection } = usePageSections("personalizacion-crm");
  const hero = getSection("hero");
  const problema = getSection("problema");
  const construimos = getSection("construimos");
  const proceso = getSection("proceso");
  const paraQuien = getSection("para-quien");
  const precio = getSection("precio");

  const hm = mt(hero), pm = mt(problema), cm = mt(construimos), prm = mt(proceso), pqm = mt(paraQuien), prec = mt(precio);

  const h = { badge: (hm.badge as string) ?? DEF.hero.badge, title: hero?.title ?? DEF.hero.title, subtitle: hero?.subtitle ?? DEF.hero.subtitle, cta: hero?.cta_text ?? DEF.hero.cta, cta2: (hm.cta2_text as string) ?? DEF.hero.cta2_text, breadcrumb: (hm.breadcrumb as string) ?? DEF.hero.breadcrumb, panels: (hm.panels as typeof DEF.hero.panels) ?? DEF.hero.panels };
  const prob = { title: problema?.title ?? DEF.problema.title, pains: (pm.pains as typeof DEF.problema.pains) ?? DEF.problema.pains };
  const con = { title: construimos?.title ?? DEF.construimos.title, items: (cm.items as typeof DEF.construimos.items) ?? DEF.construimos.items };
  const proc = { title: proceso?.title ?? DEF.proceso.title, phases: (prm.phases as typeof DEF.proceso.phases) ?? DEF.proceso.phases };
  const pq = { title_yes: (pqm.title_yes as string) ?? DEF.paraQuien.title_yes, title_no: (pqm.title_no as string) ?? DEF.paraQuien.title_no, yes: (pqm.yes as string[]) ?? DEF.paraQuien.yes, no: (pqm.no as typeof DEF.paraQuien.no) ?? DEF.paraQuien.no };
  const pr = { label: (prec.label as string) ?? DEF.precio.label, headline: (prec.headline as string) ?? DEF.precio.headline, subtext: (prec.subtext as string) ?? DEF.precio.subtext, calcChip: (prec.calcChip as string) ?? DEF.precio.calcChip, cta: precio?.cta_text ?? DEF.precio.cta, link: (prec.link as string) ?? DEF.precio.link };

  const scrollToFit = () => document.getElementById("para-quien")?.scrollIntoView({ behavior: "smooth" });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="min-h-screen font-['Lexend']" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ── */}
      <SectionShell section={hero} className="min-h-[85vh] flex items-center" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-[55%_45%] gap-12 items-center">
          <div>
            <motion.p {...fadeUp()} className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{h.breadcrumb}</motion.p>
            <motion.span {...fadeUp(0.05)} className="inline-block text-[11px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-full mb-6 text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}>{h.badge}</motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(40px, 5vw, 60px)", maxWidth: 580 }}>{h.title}</motion.h1>
            <motion.p {...fadeUp(0.15)} className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>{h.subtitle}</motion.p>
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
              <button className="text-sm font-semibold text-white rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]" style={{ background: GRADIENT }}>{h.cta}</button>
              <button onClick={scrollToFit} className="text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white transition-colors">{h.cta2}</button>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.25)} className="hidden lg:block">
            <CRMMockup panels={h.panels} />
          </motion.div>
        </div>
      </SectionShell>

      <WaveDivider fromColor="#1A1A2E" toColor="#ffffff" />

      {/* ── PROBLEMA ── */}
      <SectionShell section={problema} className="py-24 md:py-[120px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[700px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-10" style={{ color: "#1A1A2E", fontSize: "clamp(26px, 3.5vw, 34px)" }}>{prob.title}</motion.h2>
          <div className="space-y-3">
            {prob.pains.map((p, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="flex items-center gap-4 rounded-xl px-7 py-5 border transition-all duration-300"
                style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = HUBSPOT)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
              >
                <span className="text-2xl shrink-0">{p.icon}</span>
                <span className="text-sm" style={{ color: "#374151" }}>{p.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ── LO QUE CONSTRUIMOS ── */}
      <SectionShell section={construimos} className="py-24 md:py-[120px]" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{con.title}</motion.h2>
          <motion.div {...fadeUp(0.1)}>
            <TechAccordion items={con.items} />
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
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
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
                  <li key={i} className="text-sm" style={{ color: "#6B7280" }}>
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
      <SectionShell section={precio} className="py-20 md:py-[80px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[480px] mx-auto px-6">
          <motion.div {...fadeUp()} className="relative rounded-[20px] p-12 text-center" style={{ border: "2px solid transparent", backgroundImage: `linear-gradient(#fff, #fff), ${GRADIENT}`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <span className="block text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: "#6B7280" }}>{pr.label}</span>
            <h3 className="text-2xl font-extrabold leading-tight mb-3" style={{ color: "#1A1A2E" }}>{pr.headline}</h3>
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
