import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, Bot, Zap, MessageSquare, Code2, Search, TrendingDown, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import SectionHeading from "@/components/services/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import ForWhomSection from "@/components/services/ForWhomSection";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import ChipLink from "@/components/services/ChipLink";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import WaveDivider from "@/components/services/WaveDivider";

const AI_BLUE = "#6366F1";
const gradient = "linear-gradient(135deg,#BE1869,#6224BE)";
const DARK = "#1A1A2E";

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

/* ── Page ── */
const PotenciaConIA = () => {
  const scrollToPlans = useCallback(() => {
    document.getElementById("ia-capacidades")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const capabilities = [
    { icon: <Bot size={40} style={{ color: "#BE1869" }} />, badge: "HubSpot Breeze AI", badgeBg: "rgba(255,122,89,0.1)", badgeColor: "#FF7A59", title: "Agentes IA en HubSpot", desc: "Asistentes de ventas y chatbots de calificación operando dentro del ecosistema HubSpot. Configurados para tu proceso — no en modo demo.", tag: "Breeze AI · Agentes nativos", hoverBorder: "#FF7A59" },
    { icon: <Zap size={40} style={{ color: AI_BLUE }} />, badge: "HubSpot Workflows", badgeBg: "rgba(99,102,241,0.1)", badgeColor: AI_BLUE, title: "Automatizaciones Inteligentes", desc: "Lead scoring predictivo, asignación automática y seguimientos contextuales. HubSpot tomando decisiones simples para que tu equipo se concentre en las complejas.", tag: "Operations Hub · IA nativa", hoverBorder: AI_BLUE },
    { icon: <MessageSquare size={40} style={{ color: "#BE1869" }} />, badge: "Herramientas especializadas", badgeBg: "rgba(190,24,105,0.08)", badgeColor: "#BE1869", title: "Agentes IA de Terceros", desc: "Implementación de Vambe — agentes WhatsApp que califican, responden y agendan — integrados con HubSpot. Todo en un solo sistema.", tag: "Vambe · WhatsApp Business", hoverBorder: "#BE1869" },
    { icon: <Code2 size={40} style={{ color: AI_BLUE }} />, badge: "DESARROLLO CUSTOM", badgeBg: "rgba(99,102,241,0.1)", badgeColor: AI_BLUE, title: "Agentes a Medida", desc: "Cuando el mercado no tiene lo que necesitas. Construimos el agente sobre tu proceso, integrado a tu stack, documentado para que tu equipo lo opere.", tag: "Custom · API · HubSpot integrado", hoverBorder: AI_BLUE },
  ];

  const phases = [
    { chip: "El primer paso", chipColor: AI_BLUE, title: "Diagnóstico de oportunidades", desc: "Mapeamos tu operación e identificamos los 3-5 puntos de mayor impacto. Antes de hablar de herramientas.", tag: "30-60 min", tagBg: `rgba(99,102,241,0.12)`, tagColor: AI_BLUE },
    { title: "Diseño de la solución", desc: "Qué se implementa, con qué herramienta y en qué orden. Documentado antes de construir.", tag: "Sin sorpresas", tagBg: "rgba(190,24,105,0.08)", tagColor: "#BE1869" },
    { title: "Implementación", desc: "Construcción, integración con HubSpot y pruebas. El equipo participa desde el inicio." },
    { chip: "Siempre incluido", chipColor: "#BE1869", title: "Activación y acompañamiento", desc: "No entregamos y desaparecemos. Acompañamos, medimos y ajustamos hasta que funcione como debe.", tag: "Siempre incluido", tagBg: "rgba(190,24,105,0.08)", tagColor: "#BE1869" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0D0D1A" }}>
      <Navbar />

      {/* Hero */}
      <ServiceHero
        breadcrumbs={[
          { label: "Inicio", to: "/" },
          { label: "Potencia con IA" },
        ]}
        badge="VANGUARDIA OPERATIVA"
        badgeStyle={{ background: "rgba(99,102,241,0.15)", color: AI_BLUE }}
        title={<>La ventaja que tus competidores<br /><span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>aún no tienen</span></>}
        subtitle="No implementamos IA por implementar. Mapeamos tu operación, identificamos dónde genera más impacto y construimos la solución correcta — integrada a HubSpot desde el primer día."
        primaryCta={{ label: "Quiero saber dónde la IA impacta mi operación →", onClick: scrollToPlans }}
        secondaryCta={{ label: "¿Es este el servicio correcto? ↓", onClick: () => document.getElementById("ia-problema")?.scrollIntoView({ behavior: "smooth" }) }}
        rightContent={<AgentFeed />}
      />

      <SectionDivider />

      {/* S2 — El Problema */}
      <section id="ia-problema" className="py-[120px] px-4 sm:px-6" style={{ background: "#fff" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <SectionHeading title={<>El problema no es la IA.<br />Es cómo se está implementando.</>} />
          <motion.p {...fadeUp(0.1)} className="text-base leading-relaxed max-w-[620px] mx-auto -mt-8" style={{ color: "#6B7280" }}>
            La mayoría de los intentos fallan por la misma razón: alguien compró una herramienta, la instaló sobre un proceso que ya tenía problemas y esperó resultados. La IA amplificó los problemas — no los resolvió.
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="mt-6 inline-block px-5 py-2.5 rounded-full text-[15px] font-bold" style={{ background: "rgba(190,24,105,0.06)", color: "#BE1869" }}>
            La IA que genera ventaja real no se instala. Se diseña.
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 mt-10 text-left">
            <motion.div {...fadeUp(0.2)} className="rounded-[20px] p-7" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
              <p className="text-[14px] font-semibold uppercase mb-3" style={{ color: "#EF4444" }}>IA mal implementada</p>
              {["Herramienta comprada, proceso sin ordenar", "Solución genérica, sin integración al CRM", "El equipo no la entiende, nadie la usa"].map((t) => (
                <p key={t} className="flex items-start gap-2 text-[15px] mb-2" style={{ color: "#6B7280" }}><span style={{ color: "#EF4444" }}>✗</span> {t}</p>
              ))}
            </motion.div>
            <motion.div {...fadeUp(0.25)} className="rounded-[20px] p-7" style={{ border: "1px solid transparent", borderImage: `${gradient} 1`, background: "#fff" }}>
              <p className="text-[14px] font-semibold uppercase mb-3" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IA con RevOps LATAM</p>
              {["Proceso diseñado antes de implementar", "Integrada a HubSpot, sin silos", "El equipo la opera desde el día 1"].map((t) => (
                <p key={t} className="flex items-start gap-2 text-[15px] mb-2" style={{ color: "#6B7280" }}><span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✓</span> {t}</p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S3 — Capacidades */}
      <section id="ia-capacidades" className="relative overflow-hidden py-[120px] px-4 sm:px-6" style={{ background: "#F9FAFB" }}>
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <SectionHeading title={<>Cuatro capacidades.<br />Una sola lógica: IA integrada a tu operación.</>} />
          <div className="grid sm:grid-cols-2 gap-8">
            {capabilities.map((c, i) => (
              <ServiceCard key={c.title} delay={0.1 + i * 0.08} hoverBorder={c.hoverBorder}>
                <div className="mb-4">{c.icon}</div>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: c.badgeBg, color: c.badgeColor }}>{c.badge}</span>
                <h3 className="text-[17px] font-bold mb-2" style={{ color: DARK }}>{c.title}</h3>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>{c.desc}</p>
                <span className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>{c.tag}</span>
              </ServiceCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S4 — Consultoría Estratégica */}
      <section className="py-[120px] px-4 sm:px-6" style={{ background: "#fff" }}>
        <div className="max-w-[640px] mx-auto text-center">
          <SectionHeading
            badge="SIEMPRE EL PRIMER PASO"
            title="Antes de implementar: el mapa."
          />
          <motion.div {...fadeUp(0.1)} className="text-[15px] leading-relaxed space-y-4 -mt-8" style={{ color: "#6B7280" }}>
            <p>Todo proyecto de IA en RevOps LATAM parte con una pregunta: ¿dónde está el mayor impacto en tu motor de ingresos?</p>
            <p>Mapeamos tu operación e identificamos los 3-5 puntos donde la IA genera más resultado. Ese mapa es lo que separa una implementación que funciona de una que se abandona en 60 días.</p>
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
      </section>

      <SectionDivider />

      {/* S5 — Timeline */}
      <section className="relative overflow-hidden py-[120px] px-4 sm:px-6" style={{ background: "#F9FAFB" }}>
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-[660px] mx-auto">
          <SectionHeading title="El proceso" />
          <div className="relative">
            <div className="absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-[3px] rounded-full" style={{ background: `linear-gradient(180deg, #BE1869 0%, #6224BE 100%)`, opacity: 0.25, boxShadow: "0 0 8px rgba(190,24,105,0.15)" }} />
            {phases.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(0.1 + i * 0.1)} className="relative pl-12 sm:pl-14 pb-12 last:pb-0">
                <div className="absolute left-[7px] sm:left-[11px] top-1 w-[18px] h-[18px] rounded-full border-[3px] border-white" style={{ background: gradient, boxShadow: "0 0 0 3px rgba(190,24,105,0.15), 0 4px 12px rgba(190,24,105,0.2)" }} />
                {p.chip && <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-2" style={{ background: `${p.chipColor}18`, color: p.chipColor }}>{p.chip}</span>}
                <h3 className="text-[17px] font-bold mb-1.5" style={{ color: DARK }}>{p.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "#6B7280" }}>{p.desc}</p>
                {p.tag && <span className="inline-block mt-2 text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: p.tagBg, color: p.tagColor }}>{p.tag}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S6 — Cómo se contrata */}
      <section className="py-[100px] px-4 sm:px-6" style={{ background: "#fff" }}>
        <div className="max-w-[760px] mx-auto">
          <SectionHeading title="Dos formas de incorporar IA a tu operación" />
          <div className="grid sm:grid-cols-2 gap-8">
            <ServiceCard delay={0.1} style={{ borderLeft: "3px solid", borderImage: `${gradient} 1` }}>
              <span className="text-2xl mb-3 block">🎯</span>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: DARK }}>Como proyecto independiente</h3>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>Fases definidas, alcance claro, entrega. Para empresas que quieren implementar una capacidad de IA específica.</p>
              <button className="text-sm font-semibold inline-flex items-center gap-1" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Conversemos <ArrowRight size={14} style={{ color: "#BE1869" }} />
              </button>
            </ServiceCard>
            <ServiceCard delay={0.15} style={{ borderLeft: `3px solid ${AI_BLUE}` }}>
              <span className="text-2xl mb-3 block">♾️</span>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: DARK }}>Como add-on de RevOps as a Service</h3>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B7280" }}>Integrado al ciclo de sprints. La IA se incorpora progresivamente a medida que la operación madura.</p>
              <Link to="/revops-as-a-service" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: AI_BLUE }}>
                Ver RevOps as a Service <ArrowRight size={14} />
              </Link>
            </ServiceCard>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* S7 — Para quién es */}
      <ForWhomSection
        yesItems={[
          "Tienes HubSpot funcionando y quieres dar el siguiente paso",
          "Tu equipo pierde tiempo en tareas repetitivas",
          "Quieres calificar más leads sin contratar más personas",
          "Intentaste implementar IA antes y no funcionó",
        ]}
        noItems={[
          { text: "Tu proceso no está ordenado", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
          { text: "Buscas una demo sin aplicación real", note: "eso no hacemos" },
          { text: "No tienes HubSpot", note: "nuestras soluciones viven en ese ecosistema" },
        ]}
      />

      <SectionDivider />

      {/* S8 — CTA Final */}
      <section className="relative py-[100px] px-4 sm:px-6 overflow-hidden" style={{ background: "#0D0D1A" }}>
        <Particles />
        <BackgroundOrbs variant="section" />
        <div className="relative z-10 max-w-[600px] mx-auto text-center">
          <motion.h2 {...fadeUp()} className="font-bold leading-tight" style={{ fontSize: "clamp(26px, 4vw, 34px)", color: "#fff" }}>
            El primer paso es el mapa,<br />no la herramienta
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            En 30 minutos identificamos dónde la IA tiene más impacto en tu operación — antes de hablar de soluciones.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-col items-center gap-4">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: gradient, boxShadow: "0 4px 20px rgba(190,24,105,0.35)" }}>
              Quiero saber dónde la IA impacta mi operación <ArrowRight size={18} />
            </button>
            <Link to="/conoce-tu-pista" className="text-sm underline underline-offset-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              Primero necesito ordenar mi operación →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PotenciaConIA;
