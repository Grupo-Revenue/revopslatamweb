import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Database, Map, Search, Pencil, CheckCircle, Package } from "lucide-react";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";

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

/* ─── Redirect Chip ─── */
const RedirectChip = ({ label, href, text }: { label: string; href: string; text: string }) => (
  <Link
    to={href}
    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
    style={{ background: "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))", color: "#BE1869" }}
    onMouseEnter={e => { e.currentTarget.style.background = GRADIENT; e.currentTarget.style.color = "#fff"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))"; e.currentTarget.style.color = "#BE1869"; }}
  >
    {label} <ArrowRight size={14} />
  </Link>
);

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "EL FUNDAMENTO DE TODO",
    title: "El plano de tu operación comercial",
    subtitle: "Antes de implementar cualquier herramienta, diseñamos el proceso completo. Con o sin CRM de por medio.",
    cta: "Conversemos sobre tu proceso →",
    cta2_text: "¿Es este el servicio correcto? ↓",
    breadcrumb: "Diseña y Construye → Diseño de Procesos",
    steps: [
      { label: "Lead entra", badge: null },
      { label: "Calificación", badge: "¿Quién lo hace?" },
      { label: "Propuesta", badge: "¿Qué automatizar?" },
      { label: "Negociación", badge: null },
      { label: "Cliente ganado", badge: null },
    ],
  },
  problema: {
    title: "Cuando el problema no es la herramienta",
    cards: [
      { icon: "📊", title: "Tienen CRM. No tienen proceso.", text: "Cada vendedor trabaja a su manera. El pipeline no refleja la realidad. Los datos no son confiables. La herramienta está — el proceso, no." },
      { icon: "🚀", title: "Quieren implementar bien desde el inicio.", text: "Están a punto de adquirir un CRM y no quieren repetir el error que vieron en otras empresas: tecnología sin dirección." },
    ],
    pill: "El Diseño de Procesos resuelve el problema desde la raíz — sin importar el CRM que tengas.",
  },
  entregables: {
    title: "Lo que tienes al final",
    cards: [
      { num: "01", icon: "blueprint", title: "Blueprint del proceso comercial", text: "Diagrama completo de tu operación. Cada etapa, cada responsable, cada criterio de avance. Visual, documentado y entendible por todo el equipo.", tag: "Diagrama visual + diccionario" },
      { num: "02", icon: "database", title: "Arquitectura del CRM", text: "Diseño de pipeline(s), ciclo de vida, estados, propiedades críticas y automatizaciones. Agnóstico al CRM — funciona en HubSpot o cualquier otra herramienta.", tag: "100% agnóstico al CRM" },
      { num: "03", icon: "roadmap", title: "Plantilla de implementación", text: "La hoja de ruta exacta para construir lo diseñado. Si lo implementas tú, tienes el manual. Si lo hacemos nosotros, este documento es el punto de partida.", tag: "Implementable por cualquier proveedor" },
    ],
  },
  proceso: {
    title: "El proceso",
    steps: [
      { icon: "🔍", title: "Kick-off y descubrimiento", text: "Entendemos tu proceso actual, dolores y objetivos. No asumimos nada — preguntamos todo." },
      { icon: "✏️", title: "Taller de diseño", text: "Co-construimos el proceso ideal con tu equipo. Este taller es donde ocurre la transformación real." },
      { icon: "✓", title: "Revisión y validación", text: "Cada etapa, definición y automatización revisada por tu equipo antes de cerrar." },
      { icon: "📦", title: "Entrega", text: "Blueprint + plantilla de implementación + sesión de transferencia de conocimiento." },
    ],
  },
  paraQuien: {
    title_yes: "Es para ti si",
    title_no: "No es para ti si",
    yes: [
      "Director Comercial, Head of Sales o CEO",
      "Tu operación comercial no tiene estructura clara",
      "Cada vendedor trabaja a su manera",
      "Estás a punto de implementar o migrar a un CRM",
      "Tienes CRM pero el proceso adentro no refleja tu realidad",
      "Quieres el blueprint para implementarlo tú mismo",
    ],
    no: [
      { text: "No tienes claridad de dónde está el problema", chip: { label: "Conoce tu pista →", href: "/conoce-tu-pista" } },
      { text: "Ya tienes proceso y solo necesitas construir en HubSpot", chips: [{ label: "Onboarding HubSpot →", href: "/onboarding-hubspot" }, { label: "Implementación a Medida →", href: "/implementacion-hubspot" }] },
    ],
  },
  precio: {
    label: "INVERSIÓN",
    price: "Desde 45 UF + IVA",
    note: "Este servicio puede contratarse de forma independiente o como fase inicial de una Implementación HubSpot a Medida.",
    cta: "Conversemos sobre tu proceso →",
    link: "¿Dudas? Conversemos primero, sin compromiso →",
  },
};

/* ─── Flowchart Visual ─── */
function FlowchartVisual({ steps }: { steps: typeof DEF.hero.steps }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className="relative p-8 rounded-[20px]"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      animate={inView ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Connector line */}
      <svg className="absolute left-[39px] top-[40px] w-[2px]" style={{ height: `calc(100% - 80px)` }}>
        <defs><linearGradient id="fgLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
        <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#fgLine)" strokeWidth="2" strokeDasharray="300" initial={{ strokeDashoffset: 300 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.5, delay: 0.3 }} />
      </svg>
      <div className="flex flex-col gap-8 relative">
        {steps.map((step, i) => (
          <motion.div key={i} className="flex items-center gap-4 relative" initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.2 }}>
            {step.badge && (
              <motion.span
                className="absolute -top-6 left-12 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                style={{ background: "rgba(255,122,89,0.15)", color: HUBSPOT }}
                initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.2 + 0.3 }}
              >
                {step.badge}
              </motion.span>
            )}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: GRADIENT }}>
              <div className="w-3 h-3 rounded-full bg-white/80" />
            </div>
            <span className="text-white/80 text-sm font-medium">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Timeline ─── */
function Timeline({ steps }: { steps: typeof DEF.proceso.steps }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref}>
      {/* Desktop */}
      <div className="hidden md:block relative">
        <svg className="absolute top-[20px] left-0 w-full h-[2px]">
          <defs><linearGradient id="tgLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
          <motion.line x1="0" y1="1" x2="100%" y2="1" stroke="url(#tgLine)" strokeWidth="2" strokeDasharray="600" initial={{ strokeDashoffset: 600 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.5 }} />
        </svg>
        <div className="grid grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div key={i} className="text-center pt-12" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.15 }}>
              <div className="mx-auto -mt-12 mb-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: GRADIENT }}>
                {i + 1}
              </div>
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <h4 className="font-bold text-sm mb-2" style={{ color: "#1A1A2E" }}>{s.title}</h4>
              <p className="text-xs" style={{ color: "#6B7280" }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-8 relative pl-8">
        <svg className="absolute left-[15px] top-0 w-[2px] h-full">
          <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#tgLine)" strokeWidth="2" strokeDasharray="400" initial={{ strokeDashoffset: 400 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.5 }} />
        </svg>
        {steps.map((s, i) => (
          <motion.div key={i} className="relative" initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.15 }}>
            <div className="absolute -left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: GRADIENT }}>{i + 1}</div>
            <span className="text-xl mb-1 block">{s.icon}</span>
            <h4 className="font-bold text-sm mb-1" style={{ color: "#1A1A2E" }}>{s.title}</h4>
            <p className="text-xs" style={{ color: "#6B7280" }}>{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Deliverable Icon ─── */
function DeliverableIcon({ type }: { type: string }) {
  const props = { size: 36, strokeWidth: 1.5 };
  if (type === "database") return <Database {...props} style={{ color: HUBSPOT }} />;
  if (type === "roadmap") return <Map {...props} />;
  return <FileText {...props} />;
}

/* ─── Main Page ─── */
export default function DisenoDeProcesos() {
  const { getSection } = usePageSections("diseño-de-procesos");
  const hero = getSection("hero");
  const problema = getSection("problema");
  const entregables = getSection("entregables");
  const proceso = getSection("proceso");
  const paraQuien = getSection("para-quien");
  const precio = getSection("precio");

  const hm = mt(hero);
  const pm = mt(problema);
  const em = mt(entregables);
  const prm = mt(proceso);
  const pqm = mt(paraQuien);
  const prec = mt(precio);

  const heroData = {
    badge: (hm.badge as string) ?? DEF.hero.badge,
    title: hero?.title ?? DEF.hero.title,
    subtitle: hero?.subtitle ?? DEF.hero.subtitle,
    cta: hero?.cta_text ?? DEF.hero.cta,
    cta2_text: (hm.cta2_text as string) ?? DEF.hero.cta2_text,
    breadcrumb: (hm.breadcrumb as string) ?? DEF.hero.breadcrumb,
    steps: (hm.steps as typeof DEF.hero.steps) ?? DEF.hero.steps,
  };

  const problemaData = {
    title: problema?.title ?? DEF.problema.title,
    cards: (pm.cards as typeof DEF.problema.cards) ?? DEF.problema.cards,
    pill: (pm.pill as string) ?? DEF.problema.pill,
  };

  const entregablesData = {
    title: entregables?.title ?? DEF.entregables.title,
    cards: (em.cards as typeof DEF.entregables.cards) ?? DEF.entregables.cards,
  };

  const procesoData = {
    title: proceso?.title ?? DEF.proceso.title,
    steps: (prm.steps as typeof DEF.proceso.steps) ?? DEF.proceso.steps,
  };

  const paraQuienData = {
    title_yes: (pqm.title_yes as string) ?? DEF.paraQuien.title_yes,
    title_no: (pqm.title_no as string) ?? DEF.paraQuien.title_no,
    yes: (pqm.yes as string[]) ?? DEF.paraQuien.yes,
    no: (pqm.no as typeof DEF.paraQuien.no) ?? DEF.paraQuien.no,
  };

  const precioData = {
    label: (prec.label as string) ?? DEF.precio.label,
    price: precio?.title ?? DEF.precio.price,
    note: (prec.note as string) ?? DEF.precio.note,
    cta: precio?.cta_text ?? DEF.precio.cta,
    link: (prec.link as string) ?? DEF.precio.link,
  };

  const scrollToParaQuien = () => {
    document.getElementById("para-quien")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-['Lexend']" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ── */}
      <SectionShell section={hero} className="min-h-[85vh] flex items-center" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-[55%_45%] gap-12 items-center">
          <div>
            <motion.p {...fadeUp()} className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{heroData.breadcrumb}</motion.p>
            <motion.span {...fadeUp(0.05)} className="inline-block text-[11px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-full mb-6" style={{ background: `${HUBSPOT}26`, color: HUBSPOT }}>
              {heroData.badge}
            </motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(40px, 5vw, 60px)", maxWidth: 580 }}>
              {heroData.title}
            </motion.h1>
            <motion.p {...fadeUp(0.15)} className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>
              {heroData.subtitle}
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
              <button className="text-sm font-semibold text-white rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]" style={{ background: GRADIENT }}>
                {heroData.cta}
              </button>
              <button onClick={scrollToParaQuien} className="text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white transition-colors">
                {heroData.cta2_text}
              </button>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.25)} className="hidden lg:block">
            <FlowchartVisual steps={heroData.steps} />
          </motion.div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ── PROBLEMA ── */}
      <SectionShell section={problema} className="py-24 md:py-[120px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-12" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>
            {problemaData.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {problemaData.cards.map((c, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.1)} className="rounded-2xl p-7 border transition-all duration-300 hover:shadow-lg hover:border-[#BE1869]/30" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
                <span className="text-3xl mb-4 block">{c.icon}</span>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1A1A2E" }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.3)} className="flex justify-center">
            <span className="inline-block text-center text-sm font-bold px-7 py-3 rounded-full" style={{ background: "linear-gradient(90deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))", color: "#BE1869" }}>
              {problemaData.pill}
            </span>
          </motion.div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ── ENTREGABLES ── */}
      <SectionShell section={entregables} className="py-24 md:py-[120px]" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>
            {entregablesData.title}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {entregablesData.cards.map((c, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.1)} className="relative rounded-[20px] p-9 border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#BE1869]/30" style={{ borderColor: "#E5E7EB" }}>
                <span className="absolute top-6 right-6 text-4xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT, opacity: 0.15 }}>{c.num}</span>
                <div className="mb-4"><DeliverableIcon type={c.icon} /></div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1A1A2E" }}>{c.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>{c.text}</p>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>
                  {c.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ── PROCESO ── */}
      <SectionShell section={proceso} className="py-24 md:py-[100px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>
            {procesoData.title}
          </motion.h2>
          <Timeline steps={procesoData.steps} />
        </div>
      </SectionShell>

      {/* ── PARA QUIÉN ── */}
      <SectionShell section={paraQuien} className="py-24 md:py-[100px]" defaultBg={{ background: "#F9FAFB" }}>
        <div id="para-quien" className="relative z-10 max-w-[1000px] mx-auto px-6 scroll-mt-32">
          <div className="grid md:grid-cols-2 gap-8">
            {/* YES */}
            <motion.div {...fadeUp()} className="rounded-2xl p-8 border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: GRADIENT }}>✓</span>
                {paraQuienData.title_yes}
              </h3>
              <ul className="space-y-3">
                {paraQuienData.yes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GRADIENT }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            {/* NO */}
            <motion.div {...fadeUp(0.1)} className="rounded-2xl p-8 border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>✗</span>
                {paraQuienData.title_no}
              </h3>
              <ul className="space-y-4">
                {paraQuienData.no.map((item, i) => (
                  <li key={i} className="text-sm" style={{ color: "#6B7280" }}>
                    <p className="mb-2">{item.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.chip && <RedirectChip label={item.chip.label} href={item.chip.href} text="" />}
                      {item.chips?.map((ch, ci) => <RedirectChip key={ci} label={ch.label} href={ch.href} text="" />)}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </SectionShell>

      {/* ── PRECIO ── */}
      <SectionShell section={precio} className="py-20 md:py-[80px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[440px] mx-auto px-6">
          <motion.div {...fadeUp()} className="relative rounded-[20px] p-12 text-center" style={{ border: "2px solid transparent", backgroundImage: `linear-gradient(#fff, #fff), ${GRADIENT}`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <span className="block text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: "#6B7280" }}>{precioData.label}</span>
            <h3 className="text-[42px] font-extrabold leading-tight mb-4" style={{ color: "#1A1A2E" }}>{precioData.price}</h3>
            <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />
            <p className="text-[13px] italic mb-6" style={{ color: "#6B7280" }}>{precioData.note}</p>
            <button className="w-full text-sm font-semibold text-white rounded-full py-3.5 mb-3 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg" style={{ background: GRADIENT }}>
              {precioData.cta}
            </button>
            <a href="#" className="text-sm font-medium hover:underline" style={{ color: "#BE1869" }}>{precioData.link}</a>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
}
