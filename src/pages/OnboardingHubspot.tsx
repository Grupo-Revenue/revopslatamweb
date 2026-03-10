import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Settings, Users, FileText, RefreshCw, CheckCircle, CalendarDays } from "lucide-react";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";


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

/* ─── Redirect Chip ─── */
const RedirectChip = ({ label, href }: { label: string; href: string }) => (
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

/* ─── Counter hook ─── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return { ref, value };
}

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "EN MARCHA EN 3 SEMANAS",
    title: "En marcha rápido, con las bases correctas",
    subtitle: "Acabas de comprar HubSpot y quieres empezar. En 3 semanas tienes el portal funcionando — con proceso, no solo con configuración.",
    cta: "Agendar mi Onboarding →",
    cta2_text: "¿Es este el servicio correcto? ↓",
    breadcrumb: "Diseña y Construye → Onboarding HubSpot",
    weeks: [
      { week: "Semana 1", label: "Validación y kick-off", icon: "check" },
      { week: "Semana 2", label: "Construcción del portal", icon: "check" },
      { week: "Semana 3", label: "Capacitación y go-live", icon: "rocket" },
    ],
  },
  problema: {
    title: "Comprar HubSpot es fácil. Usarlo bien es otra cosa.",
    body: "La mayoría de las empresas compran HubSpot con la mejor intención. Lo configuran como pueden — o como les dice una agencia que no entiende su operación.\n\nEl resultado: un CRM que existe pero que nadie usa. O peor: que todos usan de forma diferente.",
    stats: [
      { num: 3, suffix: " meses", label: "promedio hasta abandono sin proceso" },
      { num: 67, suffix: "%", label: "de implementaciones sin adopción real" },
      { num: 0, suffix: " UF", label: "de retorno si nadie lo usa" },
    ],
    footnote: "Estimaciones basadas en nuestra experiencia de campo — no datos de estudios externos.",
  },
  incluye: {
    title: "Lo que tienes al final de las 3 semanas",
    features: [
      { icon: "settings", title: "Portal configurado con proceso", text: "Pipeline, etapas, propiedades y automatizaciones básicas — todo sobre proceso validado." },
      { icon: "users", title: "Equipo capacitado por rol", text: "Cada persona aprende lo que necesita para su función. Sin capacitaciones genéricas." },
      { icon: "file", title: "Documentación completa", text: "Todo lo configurado, documentado. Para onboarding de nuevos y para crecer sobre bases sólidas." },
      { icon: "refresh", title: "Automatizaciones básicas", text: "Las automatizaciones esenciales para que el proceso ocurra sin intervención manual." },
      { icon: "check", title: "Proceso estándar validado", text: "No partimos de cero. Usamos un proceso validado en múltiples implementaciones, adaptado a tu realidad." },
      { icon: "calendar", title: "Seguimiento a 30 días", text: "Un mes después del go-live revisamos contigo que todo funcione como debe." },
    ],
  },
  proceso: {
    title: "3 semanas. Así:",
    steps: [
      { week: "Semana 1", title: "Validación y kick-off", items: ["Revisamos el proceso estándar contigo", "Hacemos ajustes mínimos a tu realidad", "Recopilamos accesos al portal"] },
      { week: "Semana 2", title: "Construcción del portal", items: ["Configuración completa en HubSpot", "Revisiones de avance contigo", "Ajustes según feedback"] },
      { week: "Semana 3", title: "Capacitación y go-live", items: ["Sesión de capacitación por rol", "Entrega + documentación", "Portal en producción 🚀"] },
    ],
  },
  paraQuien: {
    title_yes: "Es para ti si",
    title_no: "No es para ti si",
    yes: [
      "Acabas de adquirir HubSpot Smart CRM o Sales Pro",
      "Proceso simple: un pipeline, equipo hasta 5-6 personas",
      "Necesitas arrancar rápido sin proyecto largo",
      "Vienes de Excel o no has tenido CRM estructurado",
    ],
    no: [
      { text: "Proceso complejo o muy específico", chip: { label: "Implementación a Medida →", href: "/implementacion-hubspot" } },
      { text: "HubSpot mal configurado que necesita rehacerse", chip: { label: "Conoce tu pista →", href: "/conoce-tu-pista" } },
      { text: "Necesitas integrar con otros sistemas", chip: { label: "Integraciones Custom →", href: "/integraciones-desarrollo" } },
      { text: "Tu problema es de proceso, no de herramienta", chip: { label: "Diseño de Procesos →", href: "/diseño-de-procesos" } },
    ],
  },
  precio: {
    label: "INVERSIÓN",
    price: "Desde 50 UF + IVA",
    note: "Precio para Smart CRM Pro o Sales Pro. Hubs adicionales se cotizan según alcance.",
    cta: "Agendar mi Onboarding →",
    link: "¿Tienes HubSpot pero está mal configurado? Cuéntanos →",
    link_href: "/conoce-tu-pista",
  },
};

/* ─── Week Cards Visual ─── */
function WeekCards({ weeks }: { weeks: typeof DEF.hero.weeks }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="rounded-[20px] p-7" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-col gap-3">
        {weeks.map((w, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4 rounded-xl px-5 py-4"
            style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid transparent`, borderImage: `${GRADIENT} 1` }}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
          >
            <div className="flex-1">
              <span className="text-[11px] uppercase font-bold tracking-wider block mb-1" style={{ color: HUBSPOT }}>{w.week}</span>
              <span className="text-white text-sm font-medium">{w.label}</span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.5, type: "spring", stiffness: 300, damping: 15 }}
              className="text-lg"
            >
              {w.icon === "rocket" ? "🚀" : "✓"}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-4 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.span
          className="inline-block text-xs font-bold text-white px-5 py-2 rounded-full"
          style={{ background: GRADIENT }}
          animate={{ boxShadow: ["0 0 0px rgba(190,24,105,0)", "0 0 20px rgba(190,24,105,0.4)", "0 0 0px rgba(190,24,105,0)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          HubSpot funcionando
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ─── Feature Icon ─── */
function FeatureIcon({ type }: { type: string }) {
  const p = { size: 28, strokeWidth: 1.5 };
  switch (type) {
    case "settings": return <Settings {...p} />;
    case "users": return <Users {...p} />;
    case "file": return <FileText {...p} />;
    case "refresh": return <RefreshCw {...p} />;
    case "check": return <CheckCircle {...p} />;
    case "calendar": return <CalendarDays {...p} />;
    default: return <Settings {...p} />;
  }
}

/* ─── Timeline ─── */
function Timeline3({ steps }: { steps: typeof DEF.proceso.steps }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref}>
      {/* Desktop */}
      <div className="hidden md:block relative">
        <svg className="absolute top-[20px] left-0 w-full h-[2px]">
          <defs><linearGradient id="obLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
          <motion.line x1="0" y1="1" x2="100%" y2="1" stroke="url(#obLine)" strokeWidth="2" strokeDasharray="600" initial={{ strokeDashoffset: 600 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.2 }} />
        </svg>
        <div className="grid grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div key={i} className="text-center pt-14" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.2 }}>
              <div className="mx-auto -mt-14 mb-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: GRADIENT }}>{i + 1}</div>
              <span className="text-[11px] uppercase font-bold tracking-wider block mb-2" style={{ color: HUBSPOT }}>{s.week}</span>
              <h4 className="font-bold text-base mb-3" style={{ color: "#1A1A2E" }}>{s.title}</h4>
              <ul className="space-y-1.5 text-left max-w-[240px] mx-auto">
                {s.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "#6B7280" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GRADIENT }} />{it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-8 relative pl-8">
        <svg className="absolute left-[15px] top-0 w-[2px] h-full">
          <defs><linearGradient id="obLineM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
          <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="url(#obLineM)" strokeWidth="2" strokeDasharray="400" initial={{ strokeDashoffset: 400 }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.2 }} />
        </svg>
        {steps.map((s, i) => (
          <motion.div key={i} className="relative" initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.2 }}>
            <div className="absolute -left-8 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: GRADIENT }}>{i + 1}</div>
            <span className="text-[11px] uppercase font-bold tracking-wider block mb-1" style={{ color: HUBSPOT }}>{s.week}</span>
            <h4 className="font-bold text-sm mb-2" style={{ color: "#1A1A2E" }}>{s.title}</h4>
            <ul className="space-y-1">
              {s.items.map((it, j) => (
                <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "#6B7280" }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GRADIENT }} />{it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OnboardingHubspot() {
  const { getSection } = usePageSections("onboarding-hubspot");
  const hero = getSection("hero");
  const problema = getSection("problema");
  const incluye = getSection("incluye");
  const proceso = getSection("proceso");
  const paraQuien = getSection("para-quien");
  const precio = getSection("precio");

  const hm = mt(hero), pm = mt(problema), im = mt(incluye), prm = mt(proceso), pqm = mt(paraQuien), prec = mt(precio);

  const h = { badge: (hm.badge as string) ?? DEF.hero.badge, title: hero?.title ?? DEF.hero.title, subtitle: hero?.subtitle ?? DEF.hero.subtitle, cta: hero?.cta_text ?? DEF.hero.cta, cta2: (hm.cta2_text as string) ?? DEF.hero.cta2_text, breadcrumb: (hm.breadcrumb as string) ?? DEF.hero.breadcrumb, weeks: (hm.weeks as typeof DEF.hero.weeks) ?? DEF.hero.weeks };
  const prob = { title: problema?.title ?? DEF.problema.title, body: problema?.body ?? DEF.problema.body, stats: (pm.stats as typeof DEF.problema.stats) ?? DEF.problema.stats, footnote: (pm.footnote as string) ?? DEF.problema.footnote };
  const inc = { title: incluye?.title ?? DEF.incluye.title, features: (im.features as typeof DEF.incluye.features) ?? DEF.incluye.features };
  const proc = { title: proceso?.title ?? DEF.proceso.title, steps: (prm.steps as typeof DEF.proceso.steps) ?? DEF.proceso.steps };
  const pq = { title_yes: (pqm.title_yes as string) ?? DEF.paraQuien.title_yes, title_no: (pqm.title_no as string) ?? DEF.paraQuien.title_no, yes: (pqm.yes as string[]) ?? DEF.paraQuien.yes, no: (pqm.no as typeof DEF.paraQuien.no) ?? DEF.paraQuien.no };
  const pr = { label: (prec.label as string) ?? DEF.precio.label, price: precio?.title ?? DEF.precio.price, note: (prec.note as string) ?? DEF.precio.note, cta: precio?.cta_text ?? DEF.precio.cta, link: (prec.link as string) ?? DEF.precio.link, link_href: (prec.link_href as string) ?? DEF.precio.link_href };

  /* counter refs */
  const s1 = useCountUp(prob.stats[0]?.num ?? 3, 1000);
  const s2 = useCountUp(prob.stats[1]?.num ?? 67, 1200);
  const s3 = useCountUp(prob.stats[2]?.num ?? 0, 800);
  const counters = [s1, s2, s3];

  const scrollToFit = () => document.getElementById("para-quien")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen font-['Lexend']" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ── */}
      <SectionShell section={hero} className="min-h-[85vh] flex items-center" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-[55%_45%] gap-12 items-center">
          <div>
            <motion.p {...fadeUp()} className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>{h.breadcrumb}</motion.p>
            <motion.span {...fadeUp(0.05)} className="inline-block text-[11px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-full mb-6" style={{ background: `${HUBSPOT}26`, color: HUBSPOT }}>{h.badge}</motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(40px, 5vw, 60px)", maxWidth: 580 }}>{h.title}</motion.h1>
            <motion.p {...fadeUp(0.15)} className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>{h.subtitle}</motion.p>
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-4">
              <button className="text-sm font-semibold text-white rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(190,24,105,0.4)]" style={{ background: GRADIENT }}>{h.cta}</button>
              <button onClick={scrollToFit} className="text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white transition-colors">{h.cta2}</button>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.25)} className="hidden lg:block">
            <WeekCards weeks={h.weeks} />
          </motion.div>
        </div>
      </SectionShell>

      

      {/* ── PROBLEMA ── */}
      <SectionShell section={problema} className="py-24 md:py-[120px]" defaultBg={{ background: "#fff" }}>
        <GradientMesh variant="light" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[680px] mx-auto px-6 text-center">
          <motion.h2 {...fadeUp()} className="font-bold tracking-[-0.02em] mb-6" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{prob.title}</motion.h2>
          {prob.body.split("\n\n").map((p, i) => (
            <motion.p key={i} {...fadeUp(0.1 + i * 0.05)} className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>{p}</motion.p>
          ))}
          <div className="grid grid-cols-3 gap-6 mt-10 mb-6">
            {prob.stats.map((st, i) => (
              <motion.div key={i} {...fadeUp(0.2 + i * 0.1)}>
                <div ref={counters[i].ref} className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                  {counters[i].value}{st.suffix}
                </div>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{st.label}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp(0.5)} className="text-[11px] italic" style={{ color: "#9CA3AF" }}>{prob.footnote}</motion.p>
        </div>
      </SectionShell>

      {/* ── QUÉ INCLUYE ── */}
      <SectionShell section={incluye} className="py-24 md:py-[100px]" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{inc.title}</motion.h2>
          <div className="grid md:grid-cols-2 gap-5">
            {inc.features.map((f, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="rounded-2xl p-7 bg-white border transition-all duration-300 hover:shadow-md" style={{ borderColor: "#E5E7EB" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = HUBSPOT)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}
              >
                <div className="mb-3" style={{ color: "#1A1A2E" }}><FeatureIcon type={f.icon} /></div>
                <h3 className="font-bold text-[15px] mb-2" style={{ color: "#1A1A2E" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ── CÓMO FUNCIONA ── */}
      <SectionShell section={proceso} className="py-24 md:py-[100px]" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto px-6">
          <motion.h2 {...fadeUp()} className="text-center font-bold tracking-[-0.02em] mb-14" style={{ color: "#1A1A2E", fontSize: "clamp(28px, 4vw, 36px)" }}>{proc.title}</motion.h2>
          <Timeline3 steps={proc.steps} />
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
      <WaveDivider fromColor="#F9FAFB" toColor="#1A1A2E" />
      <SectionShell section={precio} className="py-20 md:py-[80px]" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="section" />
        <GradientMesh variant="center" />
        <div className="relative z-10 max-w-[440px] mx-auto px-6">
          <motion.div {...fadeUp()} className="relative rounded-[20px] p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <span className="block text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>{pr.label}</span>
            <h3 className="text-[42px] font-extrabold leading-tight mb-4" style={{ color: "#1A1A2E" }}>{pr.price}</h3>
            <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />
            <p className="text-[13px] italic mb-6" style={{ color: "#6B7280" }}>{pr.note}</p>
            <button className="w-full text-sm font-semibold text-white rounded-full py-3.5 mb-3 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg" style={{ background: GRADIENT }}>{pr.cta}</button>
            <Link to={pr.link_href} className="text-sm font-medium hover:underline" style={{ color: "#BE1869" }}>{pr.link}</Link>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
}
