import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, Bot, Zap, MessageSquare, Code2, Search, TrendingDown, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/services/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import ForWhomSection from "@/components/services/ForWhomSection";
import SectionDivider from "@/components/services/SectionDivider";
import ResponsiveHeroImage from "@/components/services/ResponsiveHeroImage";
import DotPattern from "@/components/services/DotPattern";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import ChipLink from "@/components/services/ChipLink";
import DynamicCTA from "@/components/DynamicCTA";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import { useLeadForm } from "@/hooks/useLeadForm";
import type { HomeSection } from "@/hooks/useHomeSections";

const AI_BLUE = "#6366F1";
const gradient = "linear-gradient(135deg,#BE1869,#6224BE)";
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

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.5, delay: d, ease: "easeOut" as const },
});

/* ── Particles ── */
const Particles = () => {
  const dots = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: 1 + Math.random() * 2, dur: 8 + Math.random() * 12, delay: Math.random() * 6,
    })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map((d) => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: "rgba(255,255,255,0.06)" }}
          animate={{ y: [0, -20, 0], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/* ── Agent Feed ── */
interface FeedItem { time: string; text: string; chipLabel: string; chipColor: string; chipBg: string; done: boolean }

const allFeedItems: FeedItem[] = [
  { time: "09:14", text: "Lead calificado automáticamente", chipLabel: "Enviado a ventas", chipColor: "#16A34A", chipBg: "rgba(74,222,128,0.15)", done: true },
  { time: "09:22", text: "Seguimiento enviado — sin respuesta 48h", chipLabel: "Automatización activa", chipColor: AI_BLUE, chipBg: "rgba(99,102,241,0.15)", done: true },
  { time: "09:31", text: "Reunión agendada por WhatsApp", chipLabel: "Vambe", chipColor: "#BE1869", chipBg: "rgba(190,24,105,0.1)", done: true },
  { time: "09:47", text: "Calificando nuevo lead entrante…", chipLabel: "En proceso", chipColor: "#EAB308", chipBg: "rgba(234,179,8,0.15)", done: false },
  { time: "09:52", text: "Email de nurturing enviado", chipLabel: "Workflow activo", chipColor: "#16A34A", chipBg: "rgba(74,222,128,0.15)", done: true },
  { time: "10:01", text: "Lead reasignado por inactividad", chipLabel: "Regla automática", chipColor: AI_BLUE, chipBg: "rgba(99,102,241,0.15)", done: true },
  { time: "10:08", text: "Propuesta generada con IA", chipLabel: "GPT integrado", chipColor: "#BE1869", chipBg: "rgba(190,24,105,0.1)", done: true },
  { time: "10:15", text: "Procesando datos de pipeline…", chipLabel: "En proceso", chipColor: "#EAB308", chipBg: "rgba(234,179,8,0.15)", done: false },
];

const AgentFeed = () => {
  const [items, setItems] = useState<FeedItem[]>(allFeedItems.slice(0, 4));
  const idx = useRef(4);

  useEffect(() => {
    const iv = setInterval(() => {
      setItems((prev) => {
        const next = [...prev.slice(1), allFeedItems[idx.current % allFeedItems.length]];
        idx.current++;
        return next;
      });
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="rounded-[20px] p-6 md:p-8 relative overflow-hidden backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}>
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full" style={{ background: AI_BLUE, boxShadow: `0 0 8px ${AI_BLUE}`, animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
        <span className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>Agente IA — Activo</span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {items.map((item, i) => (
          <motion.div key={`${item.time}-${item.text}-${i}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-[12px] font-mono shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>[{item.time}]</span>
            <span className="text-[12px] shrink-0 mt-0.5" style={{ color: item.done ? "rgba(74,222,128,0.8)" : "rgba(234,179,8,0.8)" }}>{item.done ? "✓" : "⟳"}</span>
            <div className="flex-1 min-w-0">
              <span className="text-[15px] block" style={{ color: "rgba(255,255,255,0.8)" }}>{item.text}</span>
              <span className="inline-block mt-1.5 text-[12px] font-medium px-2 py-0.5 rounded-full" style={{ color: item.chipColor, background: item.chipBg, animation: item.done ? "none" : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}>
                {item.chipLabel}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          Tiempo promedio de respuesta:{" "}
          <span className="font-bold" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3 min</span>
          <span className="mx-2" style={{ color: "rgba(255,255,255,0.2)" }}>vs</span>
          <span style={{ color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>4+ horas</span>
        </p>
      </div>
    </div>
  );
};

/* ─── defaults ─── */
const DEF = {
  hero: {
    badge: "VANGUARDIA OPERATIVA",
    title: "La ventaja que tus competidores aún no tienen",
    subtitle: "No implementamos IA por implementar. Mapeamos tu operación, identificamos dónde genera más impacto y construimos la solución correcta — integrada a HubSpot desde el primer día.",
    cta_text: "Quiero saber dónde la IA impacta mi operación →",
    cta2_text: "¿Es este el servicio correcto? ↓",
  },
  problema: {
    title: "El problema no es la IA.\nEs cómo se está implementando.",
    body: "La mayoría de los intentos fallan por la misma razón: alguien compró una herramienta, la instaló sobre un proceso que ya tenía problemas y esperó resultados. La IA amplificó los problemas — no los resolvió.",
    highlight: "La IA que genera ventaja real no se instala. Se diseña.",
    bad_items: ["Herramienta comprada, proceso sin ordenar", "Solución genérica, sin integración al CRM", "El equipo no la entiende, nadie la usa"],
    good_items: ["Proceso diseñado antes de implementar", "Integrada a HubSpot, sin silos", "El equipo la opera desde el día 1"],
  },
  capacidades: {
    title: "Cuatro capacidades.\nUna sola lógica: IA integrada a tu operación.",
  },
  consultoria: {
    badge: "SIEMPRE EL PRIMER PASO",
    title: "Antes de implementar: el mapa.",
    body: "Todo proyecto de IA en RevOps LATAM parte con una pregunta: ¿dónde está el mayor impacto en tu motor de ingresos?\n\nMapeamos tu operación e identificamos los 3-5 puntos donde la IA genera más resultado. Ese mapa es lo que separa una implementación que funciona de una que se abandona en 60 días.",
  },
  proceso: {
    title: "El proceso",
  },
  contratacion: {
    title: "Dos formas de incorporar IA a tu operación",
  },
  paraQuien: {
    yes_items: [
      "Tienes HubSpot funcionando y quieres dar el siguiente paso",
      "Tu equipo pierde tiempo en tareas repetitivas",
      "Quieres calificar más leads sin contratar más personas",
      "Intentaste implementar IA antes y no funcionó",
    ],
    no_items: [
      { text: "Tu proceso no está ordenado", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
      { text: "Buscas una demo sin aplicación real", note: "eso no hacemos" },
      { text: "No tienes HubSpot", note: "nuestras soluciones viven en ese ecosistema" },
    ],
  },
  ctaFinal: {
    title: "El primer paso es el mapa,\nno la herramienta",
    subtitle: "En 30 minutos identificamos dónde la IA tiene más impacto en tu operación — antes de hablar de soluciones.",
    cta_text: "Quiero saber dónde la IA impacta mi operación",
    cta2_text: "Primero necesito ordenar mi operación →",
    cta2_url: "/conoce-tu-pista",
  },
};

/* ── Page ── */
const PotenciaConIA = () => {
  const { getSection, loading } = usePageSections("potencia-con-ia");
  const { openLeadForm } = useLeadForm();

  const hero = getSection("hero");
  const problema = getSection("problema");
  const capacidades = getSection("capacidades");
  const consultoria = getSection("consultoria");
  const proceso = getSection("proceso");
  const contratacion = getSection("contratacion");
  const paraQuien = getSection("para-quien");
  const ctaFinal = getSection("cta-final");

  const hm = mt(hero);
  const pm = mt(problema);
  const cm = mt(capacidades);
  const conm = mt(consultoria);
  const prm = mt(proceso);
  const ctm = mt(contratacion);
  const pqm = mt(paraQuien);
  const cfm = mt(ctaFinal);

  // Resolved values with CMS fallbacks
  const h = {
    badge: (hm.badge as string) ?? DEF.hero.badge,
    title: hero?.title ?? DEF.hero.title,
    subtitle: hero?.subtitle ?? DEF.hero.subtitle,
    cta_text: hero?.cta_text ?? DEF.hero.cta_text,
    cta2_text: (hm.cta2_text as string) ?? DEF.hero.cta2_text,
  };

  const prob = {
    title: problema?.title ?? DEF.problema.title,
    body: problema?.body ?? DEF.problema.body,
    highlight: (pm.highlight as string) ?? DEF.problema.highlight,
    bad_items: (pm.bad_items as string[]) ?? DEF.problema.bad_items,
    good_items: (pm.good_items as string[]) ?? DEF.problema.good_items,
  };

  const cap = {
    title: capacidades?.title ?? DEF.capacidades.title,
  };

  const con = {
    badge: (conm.badge as string) ?? DEF.consultoria.badge,
    title: consultoria?.title ?? DEF.consultoria.title,
    body: consultoria?.body ?? DEF.consultoria.body,
  };

  const proc = {
    title: proceso?.title ?? DEF.proceso.title,
  };

  const cont = {
    title: contratacion?.title ?? DEF.contratacion.title,
  };

  const pq = {
    yes_items: (pqm.yes_items as string[]) ?? DEF.paraQuien.yes_items,
    no_items: (pqm.no_items as Array<{ text: string; chip?: string; chipTo?: string; note?: string }>) ?? DEF.paraQuien.no_items,
  };

  const cf = {
    title: ctaFinal?.title ?? DEF.ctaFinal.title,
    subtitle: ctaFinal?.subtitle ?? DEF.ctaFinal.subtitle,
    cta_text: ctaFinal?.cta_text ?? DEF.ctaFinal.cta_text,
    cta_url: ctaFinal?.cta_url ?? "#",
    cta2_text: (cfm.cta2_text as string) ?? DEF.ctaFinal.cta2_text,
    cta2_url: (cfm.cta2_url as string) ?? DEF.ctaFinal.cta2_url,
  };

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: probStyle } = useSectionStyles(problema);
  const { getStyle: capStyle } = useSectionStyles(capacidades);
  const { getStyle: conStyle } = useSectionStyles(consultoria);
  const { getStyle: procStyle, getBgStyle: procBgStyle } = useSectionStyles(proceso);
  const { getStyle: contStyle } = useSectionStyles(contratacion);
  const { getStyle: pqStyle, getBgStyle: pqBgStyle } = useSectionStyles(paraQuien);
  const { hasBg: pqHasBg, bgLayerStyle: pqBgLayerStyle } = useSectionBackground(paraQuien);
  const { getStyle: cfStyle } = useSectionStyles(ctaFinal);

  const scrollToPlans = useCallback(() => {
    document.getElementById("ia-capacidades")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const defaultCapabilities = [
    { icon: <Bot size={40} style={{ color: "#BE1869" }} />, badge: "HubSpot Breeze AI", badgeBg: "rgba(255,122,89,0.1)", badgeColor: "#FF7A59", title: "Agentes IA en HubSpot", desc: "Asistentes de ventas y chatbots de calificación operando dentro del ecosistema HubSpot. Configurados para tu proceso — no en modo demo.", tag: "Breeze AI · Agentes nativos", hoverBorder: "#FF7A59" },
    { icon: <Zap size={40} style={{ color: AI_BLUE }} />, badge: "HubSpot Workflows", badgeBg: "rgba(99,102,241,0.1)", badgeColor: AI_BLUE, title: "Automatizaciones Inteligentes", desc: "Lead scoring predictivo, asignación automática y seguimientos contextuales. HubSpot tomando decisiones simples para que tu equipo se concentre en las complejas.", tag: "Operations Hub · IA nativa", hoverBorder: AI_BLUE },
    { icon: <MessageSquare size={40} style={{ color: "#BE1869" }} />, badge: "Herramientas especializadas", badgeBg: "rgba(190,24,105,0.08)", badgeColor: "#BE1869", title: "Agentes IA de Terceros", desc: "Implementación de Vambe — agentes WhatsApp que califican, responden y agendan — integrados con HubSpot. Todo en un solo sistema.", tag: "Vambe · WhatsApp Business", hoverBorder: "#BE1869" },
    { icon: <Code2 size={40} style={{ color: AI_BLUE }} />, badge: "DESARROLLO CUSTOM", badgeBg: "rgba(99,102,241,0.1)", badgeColor: AI_BLUE, title: "Agentes a Medida", desc: "Cuando el mercado no tiene lo que necesitas. Construimos el agente sobre tu proceso, integrado a tu stack, documentado para que tu equipo lo opere.", tag: "Custom · API · HubSpot integrado", hoverBorder: AI_BLUE },
  ];

  const defaultPhases = [
    { chip: "El primer paso", chipColor: AI_BLUE, title: "Diagnóstico de oportunidades", desc: "Mapeamos tu operación e identificamos los 3-5 puntos de mayor impacto. Antes de hablar de herramientas.", tag: "30-60 min", tagBg: `rgba(99,102,241,0.12)`, tagColor: AI_BLUE },
    { title: "Diseño de la solución", desc: "Qué se implementa, con qué herramienta y en qué orden. Documentado antes de construir.", tag: "Sin sorpresas", tagBg: "rgba(190,24,105,0.08)", tagColor: "#BE1869" },
    { title: "Implementación", desc: "Construcción, integración con HubSpot y pruebas. El equipo participa desde el inicio." },
    { chip: "Siempre incluido", chipColor: "#BE1869", title: "Activación y acompañamiento", desc: "No entregamos y desaparecemos. Acompañamos, medimos y ajustamos hasta que funcione como debe.", tag: "Siempre incluido", tagBg: "rgba(190,24,105,0.08)", tagColor: "#BE1869" },
  ];

  const capabilities = (cm.cards as typeof defaultCapabilities) ?? defaultCapabilities;
  const phases = (prm.phases as typeof defaultPhases) ?? defaultPhases;

  if (loading) return <div className="min-h-screen" style={{ background: "#0D0D1A" }} />;

  const opensHeroForm = hm.cta1_opens_lead_form === true;
  const opensCtaForm = cfm.cta1_opens_lead_form === true;

  return (
    <div className="min-h-screen" style={{ background: "#0D0D1A" }}>
      <Navbar />

      {/* ─── HERO ─── */}
      <SectionShell section={hero} className="min-h-screen" defaultBg={{ background: "linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 100%)" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-36 pb-24 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-screen">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/" className="hover:text-white/60 transition-colors">Inicio</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Potencia con IA</span>
            </div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-6" style={{ background: (hm.badge_bg as string) || "rgba(99,102,241,0.15)", color: (hm.badge_color as string) || AI_BLUE }}>
              {h.badge}
            </span>
            <h1 className="font-bold text-white leading-[1.08] mb-6 whitespace-pre-line" style={{ fontSize: "clamp(40px, 5vw, 62px)", ...heroStyle("title") }}>
              {(() => {
                const lineBreak = hm.title_line_break as string;
                if (lineBreak && h.title.includes(lineBreak)) {
                  const idx = h.title.indexOf(lineBreak);
                  return h.title.slice(0, idx).trimEnd() + "\n" + h.title.slice(idx);
                }
                return h.title;
              })()}
            </h1>
            <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500, ...heroStyle("body") }}>{h.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              {(hm.cta_style_key as string) ? (
                <DynamicCTA
                  styleKey={hm.cta_style_key as string}
                  onClick={opensHeroForm ? () => openLeadForm("potencia-con-ia-hero") : scrollToPlans}
                >
                  {h.cta_text}
                </DynamicCTA>
              ) : (
                <button onClick={opensHeroForm ? () => openLeadForm("potencia-con-ia-hero") : scrollToPlans} className="text-[15px] font-semibold text-white px-8 py-4 rounded-full transition-all hover:scale-[1.03]" style={{ background: (hm.cta_bg as string) || gradient, color: (hm.cta_color as string) || "#fff", boxShadow: "0 4px 20px rgba(190,24,105,0.35)" }}>
                  {h.cta_text}
                </button>
              )}
              <button onClick={() => document.getElementById("ia-problema")?.scrollIntoView({ behavior: "smooth" })} className="text-[15px] font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                {h.cta2_text}
              </button>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {hero?.image_url ? <ResponsiveHeroImage src={hero.image_url} alt={hero.title || ""} metadata={hm} defaultMaxWidth="460px" /> : <AgentFeed />}
          </motion.div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── S2 — El Problema ─── */}
      <SectionShell section={problema} className="py-[120px] px-4 sm:px-6" defaultBg={{ background: "#fff" }}>
        <div id="ia-problema" className="relative z-10 max-w-[700px] mx-auto text-center">
          <SectionHeading title={prob.title} />
          <motion.p {...fadeUp(0.1)} className="text-base leading-relaxed max-w-[620px] mx-auto -mt-8" style={{ color: "#6B7280", ...probStyle("body") }}>
            {prob.body}
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="mt-6 inline-block px-5 py-2.5 rounded-full text-[15px] font-bold" style={{ background: "rgba(190,24,105,0.06)", color: "#BE1869" }}>
            {prob.highlight}
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 mt-10 text-left">
            <motion.div {...fadeUp(0.2)} className="rounded-[20px] p-7" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
              <p className="text-[14px] font-semibold uppercase mb-3" style={{ color: "#EF4444" }}>IA mal implementada</p>
              {prob.bad_items.map((t) => (
                <p key={t} className="flex items-start gap-2 text-[15px] mb-2" style={{ color: "#6B7280" }}><span style={{ color: "#EF4444" }}>✗</span> {t}</p>
              ))}
            </motion.div>
            <motion.div {...fadeUp(0.25)} className="rounded-[20px] p-7 relative overflow-hidden" style={{ background: "#fff" }}>
              <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ padding: 1, background: gradient, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              <p className="text-[14px] font-semibold uppercase mb-3" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IA con RevOps LATAM</p>
              {prob.good_items.map((t) => (
                <p key={t} className="flex items-start gap-2 text-[15px] mb-2" style={{ color: "#6B7280" }}><span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✓</span> {t}</p>
              ))}
            </motion.div>
          </div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── S3 — Capacidades ─── */}
      <SectionShell section={capacidades} className="py-[120px] px-4 sm:px-6" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern opacity={0.3} />
        <div id="ia-capacidades" className="relative z-10 max-w-[1100px] mx-auto">
          <SectionHeading title={cap.title} titleStyle={capStyle("title")} />
          <div className="grid sm:grid-cols-2 gap-8">
            {capabilities.map((c, i) => (
              <ServiceCard key={c.title} delay={0.1 + i * 0.08} hoverBorder={c.hoverBorder}>
                <div className="mb-4">{typeof c.icon === "string" ? <span className="text-[40px]">{c.icon}</span> : c.icon}</div>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
                <h3 className="text-[17px] font-bold mb-2" style={{ color: DARK }}>{c.title}</h3>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>{c.desc}</p>
                <span className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>{c.tag}</span>
              </ServiceCard>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── S4 — Consultoría Estratégica ─── */}
      <SectionShell section={consultoria} className="py-[120px] px-4 sm:px-6" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[640px] mx-auto text-center">
          <SectionHeading badge={con.badge} title={con.title} />
          <motion.div {...fadeUp(0.1)} className="text-[15px] leading-relaxed space-y-4 -mt-8" style={{ color: "#6B7280", ...conStyle("body") }}>
            {con.body.split("\n\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: <Search size={14} />, text: "¿Dónde se pierde más tiempo manual?" },
              { icon: <TrendingDown size={14} />, text: "¿En qué punto se caen los leads?" },
              { icon: <Lightbulb size={14} />, text: "¿Qué decisiones se toman hoy sin datos?" },
            ].map((q) => (
              <span key={q.text} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-[14px] transition-all duration-300 hover:shadow-md hover:-translate-y-1" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#6B7280" }}>
                {q.icon} {q.text}
              </span>
            ))}
          </motion.div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── S5 — Timeline / Proceso ─── */}
      <SectionShell section={proceso} className="py-[120px] px-4 sm:px-6" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-[660px] mx-auto">
          <SectionHeading title={proc.title} />
          <div className="relative">
            <div className="absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-[3px] rounded-full" style={{ background: `linear-gradient(180deg, #BE1869 0%, #6224BE 100%)`, opacity: 0.25, boxShadow: "0 0 8px rgba(190,24,105,0.15)" }} />
            {phases.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(0.1 + i * 0.1)} className="relative pl-12 sm:pl-14 pb-12 last:pb-0">
                <div className="absolute left-[7px] sm:left-[11px] top-1 w-[18px] h-[18px] rounded-full border-[3px] border-white" style={{ background: gradient, boxShadow: "0 0 0 3px rgba(190,24,105,0.15), 0 4px 12px rgba(190,24,105,0.2)" }} />
                {p.chip && <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-2" style={{ background: `${p.chipColor}18`, color: p.chipColor }}>{p.chip}</span>}
                <h3 className="text-[17px] font-bold mb-1.5" style={{ color: DARK }}>{p.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>{p.desc}</p>
                {(p as any).tag && <span className="inline-block mt-2 text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: (p as any).tagBg, color: (p as any).tagColor }}>{(p as any).tag}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </SectionShell>


      {/* ─── S6 — Cómo se contrata ─── */}
      <SectionShell section={contratacion} className="py-[100px] px-4 sm:px-6" defaultBg={{ background: "#fff" }}>
        <div className="relative z-10 max-w-[760px] mx-auto">
          <SectionHeading title={cont.title} />
          <div className="grid sm:grid-cols-2 gap-8">
            <ServiceCard delay={0.1} style={{ borderLeft: "3px solid", borderImage: `${gradient} 1` }}>
              <span className="text-2xl mb-3 block">🎯</span>
              <h3 className="text-[17px] font-bold mb-2" style={{ color: DARK }}>Como proyecto independiente</h3>
              <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>Fases definidas, alcance claro, entrega. Para empresas que quieren implementar una capacidad de IA específica.</p>
              <button onClick={() => openLeadForm("potencia-con-ia-proyecto")} className="text-[15px] font-semibold inline-flex items-center gap-1" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Conversemos <ArrowRight size={14} style={{ color: "#BE1869" }} />
              </button>
            </ServiceCard>
            <ServiceCard delay={0.15} style={{ borderLeft: `3px solid ${AI_BLUE}` }}>
              <span className="text-2xl mb-3 block">♾️</span>
              <h3 className="text-[17px] font-bold mb-2" style={{ color: DARK }}>Como add-on de RevOps as a Service</h3>
              <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>Integrado al ciclo de sprints. La IA se incorpora progresivamente a medida que la operación madura.</p>
              <Link to="/revops-as-a-service" className="text-[15px] font-semibold inline-flex items-center gap-1" style={{ color: AI_BLUE }}>
                Ver RevOps as a Service <ArrowRight size={14} />
              </Link>
            </ServiceCard>
          </div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── S7 — Para quién es ─── */}
      <ForWhomSection yesItems={pq.yes_items} noItems={pq.no_items} />

      <SectionDivider />

      {/* ─── S8 — CTA Final ─── */}
      <SectionShell section={ctaFinal} className="py-[100px] px-4 sm:px-6" defaultBg={{ background: "#0D0D1A" }}>
        <Particles />
        <BackgroundOrbs variant="section" />
        <div className="relative z-10 max-w-[600px] mx-auto text-center">
          <motion.h2 {...fadeUp()} className="font-bold leading-tight whitespace-pre-line" style={{ fontSize: "clamp(26px, 4vw, 34px)", color: "#fff", ...cfStyle("title") }}>
            {cf.title}
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", ...cfStyle("body") }}>
            {cf.subtitle}
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-col items-center gap-4">
            {(cfm.cta_style_key as string) ? (
              <DynamicCTA
                styleKey={cfm.cta_style_key as string}
                onClick={opensCtaForm ? () => openLeadForm("potencia-con-ia-cta-final") : undefined}
              >
                {cf.cta_text}
              </DynamicCTA>
            ) : (
              opensCtaForm ? (
                <button onClick={() => openLeadForm("potencia-con-ia-cta-final")} className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: gradient, boxShadow: "0 4px 20px rgba(190,24,105,0.35)", ...cfStyle("cta") }}>
                  {cf.cta_text} <ArrowRight size={18} />
                </button>
              ) : (
                <Link to={cf.cta_url} className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: gradient, boxShadow: "0 4px 20px rgba(190,24,105,0.35)", ...cfStyle("cta") }}>
                  {cf.cta_text} <ArrowRight size={18} />
                </Link>
              )
            )}
            <Link to={cf.cta2_url} className="text-sm underline underline-offset-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              {cf.cta2_text}
            </Link>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
};

export default PotenciaConIA;
