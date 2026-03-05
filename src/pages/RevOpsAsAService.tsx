import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Check, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

/* ═══ smooth scroll helper ═══ */
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ═══════════════════════════════════════════════════════════
   HERO — Sprint Timeline visual
   ═══════════════════════════════════════════════════════════ */
const sprintItems = [
  { label: "Lunes pasado", text: "Reunión de sprint — 3 prioridades definidas", done: true },
  { label: "Esta semana", text: "Pipeline optimizado · Automatización activa", done: true },
  { label: "En progreso", text: "Campaña de nurturing configurada", partial: true },
  { label: "Próximo lunes", text: "Cierre de sprint + reporte de KPIs", pending: true },
];

const SprintTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 32,
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <span className="text-white/80 text-sm font-semibold">Sprint actual</span>
        <span
          className="text-[11px] font-bold px-3 py-1 rounded-full"
          style={{ background: "rgba(190,24,105,0.15)", color: "#BE1869" }}
        >
          Semana 2 de 2
        </span>
      </div>

      {/* timeline */}
      <div className="relative pl-7">
        {/* vertical line */}
        <motion.div
          className="absolute left-[11px] top-1 bottom-1 w-[2px]"
          style={{ background: GRADIENT, transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <div className="space-y-6">
          {sprintItems.map((item, i) => (
            <motion.div
              key={i}
              className="relative flex items-start gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
            >
              {/* dot */}
              <div
                className="absolute -left-7 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                style={{
                  background: item.done
                    ? GRADIENT
                    : item.partial
                    ? "linear-gradient(135deg, #BE1869 50%, rgba(255,255,255,0.1) 50%)"
                    : "transparent",
                  border: item.pending ? "2px solid rgba(190,24,105,0.5)" : "none",
                  animation: item.pending ? "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" : undefined,
                }}
              >
                {item.done && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wide block mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.label}
                </span>
                <span className="text-sm text-white/90">{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="mt-7 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/50">Siguiente sprint en 4 días</span>
          <span className="text-white/60 font-semibold">75%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: GRADIENT }}
            initial={{ width: 0 }}
            animate={inView ? { width: "75%" } : {}}
            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PRICING PLANS
   ═══════════════════════════════════════════════════════════ */
const plans = [
  {
    key: "claridad",
    label: "CLARIDAD",
    labelColor: "#6B7280",
    price: "50",
    promesa: "Sabrás exactamente qué está pasando en tu operación y tendrás un camino claro de qué mejorar cada mes.",
    para: "HubSpot funcionando, equipo pequeño, falta dirección estratégica.",
    features: [
      "Consultor RevOps asignado",
      "Especialista HubSpot técnico",
      "Sprint quincenal",
      "Soporte por ticket",
      "Reporte mensual de KPIs",
    ],
    ctaLabel: "Empezar con Claridad →",
    ctaSolid: false,
    featured: false,
  },
  {
    key: "momentum",
    label: "MOMENTUM",
    labelGradient: true,
    price: "90",
    promesa: "Tu operación de ventas y marketing funcionando alineada, mejorando cada mes, sin que tengas que empujarla.",
    para: "Equipos de ventas y marketing que necesitan alineación real y ejecución constante.",
    features: [
      "Consultor RevOps Senior",
      "Mayor capacidad de ejecución",
      "Arquitecto de soluciones disponible",
      "Análisis de pipeline mensual",
      "Playbooks comerciales activos",
      "Marketing Ops incluido",
    ],
    ctaLabel: "Empezar con Momentum →",
    ctaSolid: true,
    featured: true,
  },
  {
    key: "escala",
    label: "ESCALA",
    labelColor: DARK,
    price: "160",
    promesa: "Tu función completa de Revenue Operations — sin contratar, sin esperar, sin riesgo.",
    para: "Empresas en crecimiento con múltiples equipos que quieren delegar su operación completa.",
    features: [
      "Marketing Ops Specialist asignado",
      "Gobierno ventas + marketing + CS",
      "Reunión estratégica mensual con liderazgo",
      "Reporting ejecutivo para directorio",
      "IA incluida en consultoría estratégica",
    ],
    ctaLabel: "Empezar con Escala →",
    ctaSolid: false,
    featured: false,
  },
];

const PlanCard = ({ plan, i }: { plan: (typeof plans)[0]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col bg-white rounded-[20px] border"
      style={{
        padding: "40px 36px",
        borderColor: plan.featured ? "transparent" : "#E5E7EB",
        borderTopWidth: plan.featured ? 3 : 1,
        borderTopColor: plan.featured ? "#BE1869" : "#E5E7EB",
        borderImage: plan.featured ? `${GRADIENT} 1` : undefined,
        boxShadow: plan.featured
          ? "0 20px 60px rgba(190,24,105,0.15)"
          : "none",
        order: plan.featured ? -1 : undefined, // mobile-first: featured first
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      whileHover={{ y: plan.featured ? -4 : -2, boxShadow: plan.featured
        ? "0 24px 70px rgba(190,24,105,0.2)"
        : "0 12px 40px rgba(0,0,0,0.08)" }}
    >
      {/* featured badge */}
      {plan.featured && (
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wide text-white px-4 py-1.5 rounded-full whitespace-nowrap"
          style={{ background: GRADIENT }}
        >
          ⭐ Más contratado
        </span>
      )}

      {/* label */}
      {plan.labelGradient ? (
        <span
          className="text-xs font-bold uppercase tracking-[0.14em] mb-4 bg-clip-text text-transparent"
          style={{ backgroundImage: GRADIENT }}
        >
          {plan.label}
        </span>
      ) : (
        <span className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: plan.labelColor }}>
          {plan.label}
        </span>
      )}

      {/* price */}
      <div className="flex items-baseline gap-2 mb-1">
        {plan.labelGradient ? (
          <span
            className="text-[48px] font-bold leading-none bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENT }}
          >
            {plan.price}
          </span>
        ) : (
          <span className="text-[48px] font-bold leading-none" style={{ color: DARK }}>
            {plan.price}
          </span>
        )}
        <span className="text-sm" style={{ color: "#6B7280" }}>UF</span>
      </div>
      <span className="text-sm mb-5" style={{ color: "#6B7280" }}>+ IVA / mes</span>

      {/* promesa */}
      <div
        className="text-base italic leading-relaxed mb-5 pl-4"
        style={{
          color: DARK,
          borderLeft: `3px solid`,
          borderImage: `${GRADIENT} 1`,
        }}
      >
        {plan.promesa}
      </div>

      {/* para quien */}
      <p className="text-sm mb-5 leading-relaxed" style={{ color: "#6B7280" }}>
        {plan.para}
      </p>

      <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />

      {/* features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: DARK }}>
            <span
              className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: GRADIENT }}
            >
              <Check size={12} color="#fff" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className="w-full text-sm font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
        style={
          plan.ctaSolid
            ? { background: GRADIENT, color: "#fff" }
            : {
                background: "transparent",
                border: "2px solid transparent",
                backgroundClip: "padding-box",
                backgroundImage: `linear-gradient(#fff, #fff), ${GRADIENT}`,
                backgroundOrigin: "border-box",
                WebkitBackgroundClip: "padding-box, border-box",
                color: DARK,
              }
        }
      >
        {plan.ctaLabel}
      </button>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MONTHLY FLOW
   ═══════════════════════════════════════════════════════════ */
const flowSteps = [
  {
    code: "S1",
    title: "Inicio de sprint",
    desc: "Reunión de 60 minutos con tu consultor. Revisamos qué pasó, qué está moviéndose y definimos juntos las 3-5 prioridades del sprint. Nada se ejecuta sin estar priorizado contigo.",
    chip: "Semana 1",
  },
  {
    code: "EJ",
    title: "Ejecución",
    desc: "Tu consultor y el equipo trabajan en las prioridades. Tienes visibilidad del avance. Urgencias se canalizan por soporte.",
    chip: "Semanas 1 y 2",
  },
  {
    code: "CI",
    title: "Cierre de sprint",
    desc: "Reporte de lo ejecutado, métricas clave y propuesta de prioridades para el siguiente sprint. Concreto, sin relleno.",
    chip: "Cada 2 semanas",
  },
  {
    code: "KPI",
    title: "Dashboard mensual",
    desc: "KPIs actualizados. Visibilidad real de tu pipeline, marketing y operación comercial. Sin Excel, sin construcción manual.",
    chip: "Cada mes",
  },
];

const MonthlyFlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid md:grid-cols-4 gap-8 relative">
      {/* connector line desktop */}
      <svg className="hidden md:block absolute top-[28px] left-[56px] right-[56px] h-[3px] pointer-events-none" style={{ width: "calc(100% - 112px)" }}>
        <motion.line
          x1="0" y1="1.5" x2="100%" y2="1.5"
          stroke="url(#flowGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BE1869" />
            <stop offset="100%" stopColor="#6224BE" />
          </linearGradient>
        </defs>
      </svg>

      {flowSteps.map((step, i) => (
        <motion.div
          key={step.code}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
        >
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4 relative z-10"
            style={{ background: GRADIENT }}
          >
            {step.code}
          </div>
          <h4 className="font-bold text-base mb-2" style={{ color: DARK }}>{step.title}</h4>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>{step.desc}</p>
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
          >
            {step.chip}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TEAM
   ═══════════════════════════════════════════════════════════ */
const teamRoles = [
  { emoji: "🧠", title: "Consultor RevOps", desc: "Estrategia, priorización y mejora continua. Tu interlocutor principal." },
  { emoji: "⚙️", title: "Especialista HubSpot", desc: "Todo lo que se decide en sprint, construido en HubSpot." },
  { emoji: "🏗️", title: "Arquitecto de Soluciones", desc: "Decisiones técnicas complejas cuando el sprint lo requiere." },
  { emoji: "📣", title: "Marketing Ops Specialist", desc: "Automatizaciones, campañas y alineación marketing-ventas." },
  { emoji: "📊", title: "Gerente de Operaciones", desc: "Supervisión de calidad y cumplimiento de cada sprint." },
];

/* ═══════════════════════════════════════════════════════════
   FOR-WHOM chip link
   ═══════════════════════════════════════════════════════════ */
const ChipLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-all hover:scale-105"
    style={{
      background: "linear-gradient(135deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))",
      color: "#BE1869",
    }}
  >
    {children} <ArrowRight size={12} />
  </Link>
);

/* ═══════════════════════════════════════════════════════════
   COMPARISON TABLE
   ═══════════════════════════════════════════════════════════ */
const compRows = [
  ["Costo mensual", "$3.5M–$4.5M CLP + beneficios", "90 UF + IVA"],
  ["Para arrancar", "3–6 meses", "Sprint 1"],
  ["Expertise", "1 persona", "Equipo de 4 especialistas"],
];

const ComparisonTable = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="mx-auto max-w-[700px] overflow-x-auto"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: 28,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
        <span />
        <span className="text-white/40 text-center">RevOps Manager interno</span>
        <span
          className="text-center px-3 py-2 rounded-lg"
          style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.2), rgba(98,36,190,0.2))", color: "#fff" }}
        >
          Plan Momentum
        </span>
      </div>
      {compRows.map(([label, intern, us], i) => (
        <div
          key={label}
          className="grid grid-cols-3 gap-2 py-3 text-sm"
          style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
        >
          <span className="text-white/70 font-medium">{label}</span>
          <span className="text-center text-white/40">{intern}</span>
          <span className="text-center font-bold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
            {us}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
const RevOpsAsAService = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── S1: HERO ── */}
      <section className="relative overflow-hidden" style={{ background: DARK, minHeight: "90vh" }}>
        <div className="mx-auto max-w-[1200px] px-6 pt-36 pb-24 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-[90vh]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/opera-tu-pista" className="hover:text-white/60 transition-colors">Opera tu pista</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">RevOps as a Service</span>
            </div>

            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-white px-4 py-1.5 rounded-full mb-6" style={{ background: GRADIENT }}>
              Tu RevOps Manager externo
            </span>

            <h1 className="font-bold text-white leading-[1.08] mb-6" style={{ fontSize: "clamp(40px, 5vw, 62px)" }}>
              Tu Revenue Operations, operando desde el primer mes
            </h1>

            <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>
              Sin contratar. Sin esperar. Sin curva de aprendizaje. Un consultor asignado y un equipo especialista operando tu motor de ingresos sprint a sprint.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => scrollTo("planes")} className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03] hover:shadow-xl" style={{ background: GRADIENT }}>
                Ver los planes →
              </button>
              <button onClick={() => scrollTo("tu-mes")} className="text-sm font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                ¿Cómo funciona en la práctica? ↓
              </button>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <SprintTimeline />
          </div>
        </div>
      </section>

      {/* ── S2: EL PROBLEMA ── */}
      <ProblemSection />

      {/* ── S3: PLANES ── */}
      <section id="planes" style={{ background: "#F9FAFB", padding: "100px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-14" style={{ color: DARK }}>
            Elige el nivel de operación que necesitas
          </h2>
          <div className="grid md:grid-cols-3 gap-7 items-start">
            {plans.map((p, i) => (
              <PlanCard key={p.key} plan={p} i={i} />
            ))}
          </div>
          <p className="text-center text-[13px] mt-8" style={{ color: "#6B7280" }}>
            Todos los planes incluyen onboarding sin costo. Compromiso mínimo 3 meses. Precios en UF + IVA.
          </p>
        </div>
      </section>

      {/* ── S4: ASÍ SE VE TU MES ── */}
      <section id="tu-mes" style={{ padding: "100px 0" }}>
        <div className="mx-auto max-w-[1000px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            Así se ve tu mes con RevOps LATAM
          </h2>
          <p className="text-center text-base mb-14" style={{ color: "#6B7280" }}>
            Sin sorpresas. Sabes qué esperar antes de empezar.
          </p>
          <MonthlyFlow />
        </div>
      </section>

      {/* ── S5: EL EQUIPO ── */}
      <TeamSection />

      {/* ── S6: PARA QUIÉN ES ── */}
      <ForWhomSection />

      {/* ── S7: ARGUMENTO PRECIO ── */}
      <section style={{ background: DARK, padding: "80px 0" }}>
        <div className="mx-auto max-w-[700px] px-6 text-center">
          <h2 className="text-white text-3xl font-bold mb-10">Lo que cuesta no tenerlo</h2>
          <ComparisonTable />
          <p className="text-[13px] mt-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Estimación basada en rangos salariales de mercado en Chile para perfiles RevOps senior, 2025.
          </p>
        </div>
      </section>

      {/* ── S8: CTA FINAL ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: DARK }}>
            El primer sprint empieza cuando tú quieras
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={() => scrollTo("planes")} className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl hover:scale-[1.03] hover:shadow-xl transition-all" style={{ background: GRADIENT }}>
              Ver los planes →
            </button>
            <button className="text-sm font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03]" style={{ border: "1.5px solid #E5E7EB", color: DARK }}>
              Conversemos primero →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ─── Problem Section ─── */
const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const left = [
    "Las reuniones de pipeline son las mismas de siempre",
    "Los procesos diseñados en la implementación se degradaron",
    "Marketing y ventas siguen jalando para lados distintos",
  ];
  const right = [
    "Nadie tiene tiempo de mejorar procesos",
    "Las decisiones se toman con intuición, no con datos",
    "HubSpot no evoluciona con el negocio",
  ];

  return (
    <section ref={ref} style={{ padding: "100px 0" }}>
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-2xl md:text-[34px] font-bold leading-tight mb-12" style={{ color: DARK }}>
          Tienes HubSpot. Tienes equipo. Pero nadie está operando el motor.
        </h2>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          {[left, right].map((col, ci) =>
            col.map((text, i) => (
              <motion.div
                key={text}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: ci === 0 ? -15 : 15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + (ci * 3 + i) * 0.08, duration: 0.4 }}
              >
                <X size={16} className="mt-0.5 shrink-0" style={{ color: "#EF4444" }} />
                <span className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{text}</span>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          className="mt-14 mx-auto text-center text-sm font-bold leading-relaxed px-6 py-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))",
            color: "#BE1869",
            maxWidth: 560,
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          No es falta de voluntad. Es falta de una función dedicada a que eso no pase.
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Team Section ─── */
const TeamSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ background: "#F9FAFB", padding: "100px 0" }}>
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-14" style={{ color: DARK }}>
          No contratas una persona. Accedes a un equipo.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamRoles.map((r, i) => (
            <motion.div
              key={r.title}
              className="bg-white rounded-2xl p-7 border transition-all duration-300 hover:border-[#BE1869]"
              style={{ borderColor: "#E5E7EB" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span className="text-3xl mb-3 block">{r.emoji}</span>
              <h4 className="font-bold text-[15px] mb-1" style={{ color: DARK }}>{r.title}</h4>
              <p className="text-[13px] leading-relaxed" style={{ color: "#6B7280" }}>{r.desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-[13px] mt-8" style={{ color: "#6B7280" }}>
          <strong>Claridad:</strong> roles 1+2 · <strong>Momentum:</strong> roles 1+2+3+4 · <strong>Escala:</strong> equipo completo
        </p>
      </div>
    </section>
  );
};

/* ─── For Whom Section ─── */
const ForWhomSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const yes = [
    "Tienes HubSpot pero nadie lo opera estratégicamente",
    "Tu equipo apaga incendios en lugar de mejorar procesos",
    "Quieres decisiones respaldadas por datos, no intuición",
    "Estás creciendo y no quieres construir equipo interno",
  ];
  const no: { text: string; chip?: string; chipTo?: string }[] = [
    { text: "Aún no tienes HubSpot", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
    { text: "No sabes dónde está el problema", chip: "Conoce tu pista →", chipTo: "/conoce-tu-pista" },
    { text: "Solo necesitas soporte técnico", chip: "Soporte HubSpot →", chipTo: "/soporte-hubspot" },
  ];

  return (
    <section ref={ref} style={{ padding: "100px 0" }}>
      <div className="mx-auto max-w-[900px] px-6 grid md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: DARK }}>Es para ti si</h3>
          <ul className="space-y-4">
            {yes.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm" style={{ color: "#374151" }}>
                <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: GRADIENT }}>
                  <Check size={12} color="#fff" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: DARK }}>No es para ti si</h3>
          <ul className="space-y-4">
            {no.map((n) => (
              <li key={n.text} className="text-sm" style={{ color: "#6B7280" }}>
                <div className="flex items-start gap-3">
                  <X size={16} className="mt-0.5 shrink-0" style={{ color: "#EF4444" }} />
                  <div>
                    {n.text}
                    {n.chip && n.chipTo && (
                      <div className="mt-1.5">
                        <ChipLink to={n.chipTo}>{n.chip}</ChipLink>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default RevOpsAsAService;
