import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco.png";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, FileText, Layers, Settings, Users, BookOpen, HeartHandshake } from "lucide-react";
import { useLeadForm } from "@/hooks/useLeadForm";
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
import { usePageMeta } from "@/hooks/usePageMeta";
import { PAGE_SEO } from "@/lib/seo-config";


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



/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "MÁS SOLICITADO",
    title: "HubSpot construido para tu proceso, no al revés",
    subtitle: "Primero diseñamos. Después construimos. El resultado es un CRM que tu equipo realmente usa.",
    cta: "Cuéntanos dónde estás hoy →",
    cta2_text: "¿Es este el servicio correcto? ↓",
    breadcrumb: "Diseña y Construye → Implementación a Medida",
    before: ["Pipeline creado a intuición", "Propiedades que nadie completa", "El equipo volvió al Excel", "Datos inconsistentes", '"¿Quién implementó esto?"'],
    after: ["Proceso diseñado antes de construir", "CRM que refleja tu operación", "Equipo que elige usar HubSpot", "Datos confiables y consistentes", "Base para crecer sin rehacer"],
  },
  problema: {
    title: "Tienes HubSpot. Tu equipo no lo usa. Ya sabes por qué.",
    cases: [
      { title: "Lo implementaron sin proceso", text: "Meses después, el equipo sigue en Excel porque el CRM no refleja cómo trabajan. Cada etapa fue creada a intuición. Las propiedades no tienen lógica. El resultado: tecnología sin adopción." },
      { title: "Lo implementó una agencia de marketing", text: "Técnicamente puede funcionar. Operacionalmente no sirve. Implementar un CRM requiere entender operación comercial, no campañas. Son disciplinas distintas." },
      { title: "Lo implementaron internamente aprendiendo", text: "El portal es el reflejo de ese aprendizaje, con todo lo que implica. Cosas bien hechas, cosas que deberían rehacerse, y nadie que tenga el mapa completo de qué hace qué." },
    ],
    pill: "La implementación a medida parte desde el principio. Proceso primero. HubSpot después.",
  },
  incluye: {
    title: "Una implementación que se sostiene",
    items: [
      { icon: "filetext", title: "Diseño de proceso incluido", text: "Toda implementación parte con el blueprint. Sin plano no construimos." },
      { icon: "layers", title: "Por proceso, no por Hub", text: "Si tu ciclo requiere Sales + Marketing + Service, así lo construimos. La licencia sigue al proceso." },
      { icon: "settings", title: "Configuración completa", text: "Objetos, pipelines, propiedades, automatizaciones, vistas por rol y reportes ejecutivos." },
      { icon: "users", title: "Capacitación por rol", text: "Lo que necesita saber un SDR es distinto a lo que necesita un gerente. Capacitamos en consecuencia." },
      { icon: "book", title: "Documentación técnica", text: "Todo documentado para que el sistema viva más allá del proyecto." },
      { icon: "heart", title: "30 días post go-live", text: "Seguimos contigo después del lanzamiento para asegurar la adopción." },
    ],
  },
  fases: {
    title: "Cómo trabajamos",
    phases: [
      { badge: "2-3 semanas", title: "Diseño de procesos", text: "Talleres, mapeo, blueprint y validación. Nada se construye sin este paso.", chip: "Siempre incluido", chipType: "hubspot" },
      { badge: "3-6 semanas", title: "Construcción en HubSpot", text: "Implementación del proceso diseñado. Revisiones de avance en cada etapa.", chip: null, chipType: null },
      { badge: "1-2 semanas", title: "QA, capacitación y go-live", text: "Revisión de calidad, capacitación por rol y lanzamiento oficial.", chip: null, chipType: null },
      { badge: "30 días", title: "Acompañamiento post go-live", text: "Ajustes, soporte de adopción y seguimiento.", chip: "Incluido siempre", chipType: "brand" },
    ],
  },
  paraQuien: {
    title_yes: "Es para ti si",
    title_no: "No es para ti si",
    yes: [
      "Acabas de adquirir HubSpot y quieres arrancar con las bases correctas",
      "Tienes HubSpot pero tu equipo sigue trabajando en Excel",
      "Tu implementación anterior quedó mal y necesita rehacerse",
      "Tienes un proceso comercial complejo que ninguna configuración estándar resuelve",
      "Tienes múltiples equipos o pipelines que deben alinearse en un solo sistema",
      "Vienes de otro CRM y la migración no quedó bien",
      "HubSpot está funcionando pero quieres que sea más potente y fácil de usar para tu equipo",
      "Necesitas conectar HubSpot con tu ERP, sistema de facturación u otras herramientas",
    ],
    no: [
      "No tienes claridad de qué está fallando en tu operación comercial — primero necesitas un diagnóstico",
      "Buscas solo una agencia que configure HubSpot técnicamente sin entender tu proceso",
      "Necesitas una solución lista en 48 horas sin diseño previo",
      "No tienes HubSpot ni planeas adoptarlo como CRM principal",
    ],
  },
  precio: {
    label: "INVERSIÓN",
    headline: "Cada implementación es única.",
    subtext: "El precio depende de la complejidad de tu proceso, número de pipelines y alcance de configuración.",
    calcChip: "🔧 Calculadora de precio → disponible próximamente",
    cta: "Cuéntanos dónde estás hoy →",
    link: "30 minutos para mapear el alcance, sin compromiso →",
  },
};

/* ─── Before/After Toggle ─── */
function BeforeAfterToggle({ before, after }: { before: string[]; after: string[] }) {
  const [isAfter, setIsAfter] = useState(false);
  return (
    <div className="rounded-[20px] p-7" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => setIsAfter(false)} className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
            style={{ background: !isAfter ? GRADIENT : "transparent", color: !isAfter ? "#fff" : "rgba(255,255,255,0.5)" }}>
            Antes
          </button>
          <button onClick={() => setIsAfter(true)} className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
            style={{ background: isAfter ? GRADIENT : "transparent", color: isAfter ? "#fff" : "rgba(255,255,255,0.5)" }}>
            Después
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {!isAfter ? (
          <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="rounded-xl p-5 space-y-3" style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.15)" }}>
            {before.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm"><span style={{ color: "#ef4444" }}>✗</span><span className="text-white/80">{item}</span></div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="after" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="rounded-xl p-5 space-y-3" style={{ background: "rgba(190,24,105,0.05)", border: "1px solid rgba(190,24,105,0.2)" }}>
            {after.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>✓</span>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Accordion ─── */
function ProblemAccordion({ cases }: { cases: typeof DEF.problema.cases }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-[640px] mx-auto">
      {cases.map((c, i) => (
        <div key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-5 text-left">
            <span className="font-bold text-base" style={{ color: "#1A1A2E" }}>{c.title}</span>
            <ChevronDown size={18} className="transition-transform duration-200" style={{ color: "#6B7280", transform: open === i ? "rotate(180deg)" : "rotate(0)" }} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="pb-5 text-[15px] leading-relaxed" style={{ color: "#374151" }}>{c.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature Icon ─── */
function FIcon({ type }: { type: string }) {
  const p = { size: 32, strokeWidth: 1.5 };
  switch (type) {
    case "layers": return <Layers {...p} />;
    case "settings": return <Settings {...p} />;
    case "users": return <Users {...p} />;
    case "book": return <BookOpen {...p} />;
    case "heart": return <HeartHandshake {...p} />;
    default: return <FileText {...p} />;
  }
}

/* ─── Vertical Timeline ─── */
function PhasesTimeline({ phases }: { phases: typeof DEF.fases.phases }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="relative max-w-[600px] mx-auto pl-10 md:pl-14">
      {/* Line */}
      <svg className="absolute left-[17px] md:left-[25px] top-0 w-[2px] h-full">
        <defs><linearGradient id="phLineLp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
        <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#phLineLp)" strokeWidth="2" strokeDasharray="500" initial={{ strokeDashoffset: 500 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.8 }} />
      </svg>
      <div className="space-y-10">
        {phases.map((ph, i) => (
          <motion.div key={i} className="relative" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.2 }}>
            <div className="absolute -left-10 md:-left-14 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm" style={{ background: GRADIENT }}>{i + 1}</div>
            <span className="inline-block text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full mb-2" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>{ph.badge}</span>
            <h4 className="font-bold text-base mb-2" style={{ color: "#1A1A2E" }}>{ph.title}</h4>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B7280" }}>{ph.text}</p>
            {ph.chip && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: ph.chipType === "hubspot" ? `${HUBSPOT}1a` : "linear-gradient(90deg, rgba(190,24,105,0.1), rgba(98,36,190,0.1))", color: ph.chipType === "hubspot" ? HUBSPOT : "#BE1869" }}>
                {ph.chip}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-[12px] text-center" style={{ color: "#9CA3AF" }}>
        *Tiempos referenciales de un proyecto estándar. Los plazos dependerán de la complejidad de tu implementación.
      </p>
    </div>
  );
}

/* ─── Include Grid (dark-bg aware) ─── */
function IncludeGrid({ section, title, items }: { section?: HomeSection; title: string; items: typeof DEF.incluye.items }) {
  const { getStyle } = useSectionStyles(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const styles = (meta.styles as Record<string, unknown>) ?? {};
  const bgColor = (styles.background as Record<string, string>)?.color ?? "";
  const bgGradient = (styles.background as Record<string, string>)?.gradient ?? "";
  const isDark = bgColor.includes("#1A1A2E") || bgColor.includes("#0D0D1A") || bgGradient.includes("#1A1A2E") || bgGradient.includes("#0D0D1A") || section?.background_image_url != null;

  const titleStyle = getStyle("title");
  const defaultTitleColor = isDark ? "#fff" : "#1A1A2E";
  const subtitleColor = isDark ? "rgba(255,255,255,0.7)" : "#6B7280";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  return (
    <div className="relative z-10 max-w-[900px] mx-auto px-6">
      <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: defaultTitleColor, fontSize: "clamp(28px, 4vw, 36px)", ...titleStyle }}>{title}</motion.h2>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
        {items.map((item, i) => (
          <motion.div key={i} {...fadeUp(0.1 + i * 0.06)} className="py-6" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div className="flex items-start gap-4">
              <div className="shrink-0" style={isDark ? { background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : { color: "#1A1A2E" }}><FIcon type={item.icon} /></div>
              <div>
                <h3 className="font-bold text-[15px] mb-1" style={{ color: isDark ? "#fff" : "#1A1A2E" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: subtitleColor }}>{item.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Service Scale ─── */
const SERVICES = [
  { badge: "EL FUNDAMENTO", title: "Diseño de Procesos", desc: "El plano de tu operación comercial antes de tocar cualquier herramienta. Para quien quiere construir bien desde el primer día.", price: "Desde 45 UF + IVA", featured: false },
  { badge: "MÁS RÁPIDO", title: "Onboarding HubSpot", desc: "En marcha en 3 semanas. Para proceso simple, equipo de hasta 5-6 personas y quien acaba de adquirir HubSpot.", price: "Desde 50 UF + IVA", featured: false },
  { badge: "MÁS SOLICITADO", title: "Implementación HubSpot a Medida", desc: "Tu proceso exacto en HubSpot. Para procesos complejos, múltiples pipelines o implementaciones que necesitan rehacerse desde las bases.", price: "Precio según alcance", featured: true },
  { badge: "AVANZADO", title: "Personalización del CRM", desc: "HubSpot que se ve y funciona como tu negocio. CRM Cards personalizadas, vistas por rol y datos de sistemas externos en un solo lugar.", price: "Precio según alcance", featured: false },
  { badge: "TÉCNICO", title: "Integraciones y Desarrollo Custom", desc: "Tu ecosistema, finalmente conectado. ERP, WhatsApp, portales a medida y HubSpot como centro de tu operación.", price: "Precio según alcance", featured: false },
];

function ServiceScale({ openLeadForm }: { openLeadForm: (source: string) => void }) {
  return (
    <div className="relative z-10 max-w-[640px] mx-auto px-6">
      <motion.h2 {...fadeUp()} className="text-center font-bold tracking-tight mb-5" style={{ color: "#fff", fontSize: "clamp(24px, 5vw, 28px)" }}>
        ¿Por dónde partir? Depende de dónde estás.
      </motion.h2>
      <motion.p {...fadeUp(0.05)} className="text-center text-[15px] sm:text-[16px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto 48px" }}>
        Tenemos servicios para cada momento. Desde el arranque rápido hasta la implementación más compleja.
      </motion.p>
      <div className="flex flex-col gap-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.08 + i * 0.06)}
            className="rounded-2xl p-6 sm:p-8 border transition-all"
            style={{
              background: s.featured ? "#F0EEFF" : "#FFFFFF",
              borderColor: s.featured ? "#6224BE" : "rgba(0,0,0,0.08)",
              borderWidth: s.featured ? 2 : 0.5,
              boxShadow: s.featured ? "0 8px 32px rgba(98,36,190,0.1)" : "none",
            }}
          >
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3"
              style={{
                background: s.featured ? GRADIENT : "rgba(98,36,190,0.06)",
                color: s.featured ? "#fff" : "#6224BE",
              }}
            >
              {s.badge}
            </span>
            <h3 className="font-bold text-lg mb-2" style={{ color: "#1A1A2E" }}>{s.title}</h3>
            <p className="text-[14px] sm:text-[15px] leading-relaxed mb-3" style={{ color: "#6B7280" }}>{s.desc}</p>
            <span className="text-[13px] font-semibold" style={{ color: "#BE1869" }}>{s.price}</span>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeUp(0.5)} className="mt-10 text-center">
        <p className="text-[13px] mb-4" style={{ color: "#6B7280" }}>¿No sabes cuál necesitas? Cuéntanos dónde estás y te orientamos.</p>
        <button
          onClick={() => openLeadForm("lp-implementacion-escala")}
          className="text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03]"
          style={{ background: "transparent", border: "1.5px solid #BE1869", color: "#BE1869" }}
        >
          Conversemos tu caso →
        </button>
      </motion.div>
    </div>
  );
}


export default function ImplementacionHubspotLanding() {
  const { openLeadForm } = useLeadForm();
  const { getSection, loading } = usePageSections("lp-implementacion-hubspot");
  const hero = getSection("hero");
  const problema = getSection("problema");
  const incluye = getSection("incluye");
  const fases = getSection("fases");
  const paraQuien = getSection("para-quien");
  const precio = getSection("precio");
  usePageMeta({ ...PAGE_SEO["/implementacion-hubspot"], path: "/lp/implementacion-hubspot" });

  const hm = mt(hero), pm = mt(problema), im = mt(incluye), fm = mt(fases), pqm = mt(paraQuien), prec = mt(precio);

  const h = { badge: (hm.badge as string) ?? DEF.hero.badge, title: hero?.title ?? DEF.hero.title, subtitle: hero?.subtitle ?? DEF.hero.subtitle, cta: hero?.cta_text ?? DEF.hero.cta, cta2: (hm.cta2_text as string) ?? DEF.hero.cta2_text, breadcrumb: (hm.breadcrumb as string) ?? DEF.hero.breadcrumb, before: (hm.before as string[]) ?? DEF.hero.before, after: (hm.after as string[]) ?? DEF.hero.after };
  const prob = { title: problema?.title ?? DEF.problema.title, cases: (pm.cases as typeof DEF.problema.cases) ?? DEF.problema.cases, pill: (pm.pill as string) ?? DEF.problema.pill };
  const inc = { title: incluye?.title ?? DEF.incluye.title, items: (im.items as typeof DEF.incluye.items) ?? DEF.incluye.items };
  const fas = { title: fases?.title ?? DEF.fases.title, phases: (fm.phases as typeof DEF.fases.phases) ?? DEF.fases.phases };
  const pq = { title_yes: (pqm.title_yes as string) ?? DEF.paraQuien.title_yes, title_no: (pqm.title_no as string) ?? DEF.paraQuien.title_no, yes: (pqm.yes as string[]) ?? DEF.paraQuien.yes, no: (pqm.no as typeof DEF.paraQuien.no) ?? DEF.paraQuien.no };
  const pr = { label: (prec.label as string) ?? DEF.precio.label, headline: (prec.headline as string) ?? DEF.precio.headline, subtext: (prec.subtext as string) ?? DEF.precio.subtext, calcChip: (prec.calcChip as string) ?? DEF.precio.calcChip, cta: precio?.cta_text ?? DEF.precio.cta, link: (prec.link as string) ?? DEF.precio.link };
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (loading) return <div className="min-h-screen" style={{ background: "#1A1A2E" }} />;

  const scrollToFit = () => document.getElementById("para-quien")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen font-['Lexend']" style={{ background: "#fff" }}>


      {/* ── HERO ── */}
      <SectionShell section={hero} className="flex flex-col items-center" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 w-full px-6 pt-16 sm:pt-24">
          <motion.img {...fadeUp(0)} src={logoBlanco} alt="Revops LATAM" className="h-7 mx-auto mb-10 sm:h-8 sm:mb-12" />
        </div>
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pb-12 lg:pb-20 grid lg:grid-cols-[55%_45%] gap-12 items-center">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <motion.span {...fadeUp(0.05)} className="inline-block text-[12px] uppercase font-bold tracking-[0.12em] px-4 py-1.5 rounded-full mb-6" style={{ background: (hm.badge_bg as string) || "rgba(255,255,255,0.08)", color: (hm.badge_color as string) || "#fff", border: (hm.badge_bg as string) ? "none" : "1px solid rgba(255,255,255,0.2)" }}>{h.badge}</motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line lg:max-w-[580px]" style={{ fontSize: "clamp(28px, 7vw, 52px)" }}>{h.title}</motion.h1>
            <motion.p {...fadeUp(0.15)} className="mt-4 text-[16px] sm:text-[17px] leading-[1.65] mb-8 lg:max-w-[500px]" style={{ color: "rgba(255,255,255,0.65)" }}>{h.subtitle}</motion.p>
            <motion.div {...fadeUp(0.2)}>
              <DynamicCTA styleKey={hm.cta_style_key as string} onClick={() => { openLeadForm("lp-implementacion-hero"); }} className="text-[15px] whitespace-nowrap font-semibold text-white rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]" style={{ background: (hm.cta_bg as string) || GRADIENT }}>{h.cta}</DynamicCTA>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.25)} className="hidden lg:block">
            {hero?.image_url ? <img src={hero.image_url} alt="" className="w-full max-w-[420px] rounded-2xl" /> : <BeforeAfterToggle before={h.before} after={h.after} />}
          </motion.div>
        </div>
      </SectionShell>


      {/* ── PROBLEMA ── */}
      <SectionShell section={problema} className="py-12 md:py-16" defaultBg={{ background: "#fff" }}>
        <GradientMesh variant="light" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="font-bold tracking-tight mb-10 text-center" style={{ color: "#1A1A2E", fontSize: "clamp(24px, 5vw, 28px)", maxWidth: 640, margin: "0 auto 40px" }}>{prob.title}</motion.h2>
          <motion.div {...fadeUp(0.1)}>
            <ProblemAccordion cases={prob.cases} />
          </motion.div>
          <motion.p {...fadeUp(0.3)} className="text-center text-[14px] font-semibold mt-10" style={{ color: "#BE1869" }}>
            {prob.pill}
          </motion.p>
        </div>
      </SectionShell>

      

      {/* ── ESCALA DE SERVICIOS ── */}
      <SectionShell section={incluye} className="pt-10 pb-14 md:pt-14 md:pb-20" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <ServiceScale openLeadForm={openLeadForm} />
      </SectionShell>

      {/* ── FASES ── */}
      <SectionShell section={fases} className="py-12 md:py-16" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-tight mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(24px, 5vw, 28px)" }}>{fas.title}</motion.h2>
          <PhasesTimeline phases={fas.phases} />
        </div>
      </SectionShell>

      {/* ── PARA QUIÉN ── */}
      <SectionShell section={paraQuien} className="py-12 md:py-16" defaultBg={{ background: "#F9FAFB" }}>
        <div id="para-quien" className="relative z-10 max-w-[1000px] mx-auto px-6 scroll-mt-32">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp()} className="rounded-2xl p-8 border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: GRADIENT }}>✓</span>
                {pq.title_yes}
              </h3>
              <ul className="space-y-3">
                {pq.yes.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] sm:text-[15px]" style={{ color: "#374151" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GRADIENT }} />{it}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="rounded-2xl p-8 border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: "#1A1A2E" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>✗</span>
                {pq.title_no}
              </h3>
              <ul className="space-y-3">
                {pq.no.map((item, i) => (
                  <li key={i} className="text-[15px] sm:text-[16px] leading-[1.6]" style={{ color: "#6B7280" }}>{typeof item === "string" ? item : (item as any).text}</li>
                ))}
              </ul>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid #E5E7EB" }}>
                <p className="text-[13px] mb-4 text-center" style={{ color: "#9CA3AF" }}>¿No estás seguro si esto es lo que necesitas? Cuéntanos tu situación y te orientamos sin compromiso.</p>
                <div className="text-center">
                  <button onClick={() => openLeadForm("lp-implementacion-no-fit")} className="text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.03]" style={{ background: "transparent", border: "1.5px solid #BE1869", color: "#BE1869" }}>Conversemos tu caso →</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionShell>

      {/* ── PRECIO ── */}
      
      <SectionShell section={precio} className="py-12 md:py-16" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="section" />
        <GradientMesh variant="center" />
        <div className="relative z-10 max-w-[480px] mx-auto px-6">
          <motion.div {...fadeUp()} className="relative rounded-[20px] p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <span className="block text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{pr.label}</span>
            <h3 className="text-[22px] sm:text-[26px] font-extrabold leading-tight mb-5" style={{ color: "#fff" }}>{pr.headline}</h3>
            <p className="text-[13px] text-center mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>El precio depende del alcance. En 30 minutos lo definimos juntos.</p>
            <DynamicCTA styleKey={mt(precio).cta_style_key as string} onClick={() => { openLeadForm("lp-implementacion-precio"); }} className="w-full text-[15px] whitespace-nowrap font-semibold text-white rounded-full py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg" style={{ background: GRADIENT }}>{pr.cta}</DynamicCTA>
          </motion.div>
        </div>
      </SectionShell>


      <footer className="py-6 text-center" style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={logoBlanco} alt="Revops LATAM" className="h-5 mx-auto mb-2" />
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          © 2026 Revops LATAM. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
