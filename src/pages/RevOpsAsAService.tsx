import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Check, X, Brain, Cog, HardHat, Megaphone, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import SectionHeading from "@/components/services/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import ForWhomSection from "@/components/services/ForWhomSection";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";

import GradientIcon from "@/components/services/GradientIcon";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const DARK = "#1A1A2E";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ═══ Sprint Timeline ═══ */
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
      className="relative backdrop-blur-sm"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <span className="text-white/80 text-[15px] font-semibold">Sprint actual</span>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.15)", color: "#BE1869" }}>
          Semana 2 de 2
        </span>
      </div>
      <div className="relative pl-7">
        <motion.div
          className="absolute left-[11px] top-1 bottom-1 w-[3px] rounded-full"
          style={{ background: GRADIENT, transformOrigin: "top", boxShadow: "0 0 8px rgba(190,24,105,0.3)" }}
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
              <div
                className="absolute -left-7 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                style={{
                  background: item.done ? GRADIENT : item.partial ? "linear-gradient(135deg, #BE1869 50%, rgba(255,255,255,0.1) 50%)" : "transparent",
                  border: item.pending ? "2px solid rgba(190,24,105,0.5)" : "none",
                  animation: item.pending ? "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" : undefined,
                  boxShadow: item.done ? "0 0 12px rgba(190,24,105,0.3)" : undefined,
                }}
              >
                {item.done && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <div>
                <span className="text-[12px] uppercase tracking-wide block mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
                <span className="text-[15px] text-white/90">{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-7 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="text-white/50">Siguiente sprint en 4 días</span>
          <span className="text-white/60 font-semibold">75%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div className="h-full rounded-full" style={{ background: GRADIENT }} initial={{ width: 0 }} animate={inView ? { width: "75%" } : {}} transition={{ delay: 1.2, duration: 1, ease: "easeOut" }} />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══ Plans ═══ */
const plans = [
  {
    key: "claridad", label: "CLARIDAD", labelColor: "#6B7280", price: "50",
    promesa: "Sabrás exactamente qué está pasando en tu operación y tendrás un camino claro de qué mejorar cada mes.",
    para: "HubSpot funcionando, equipo pequeño, falta dirección estratégica.",
    features: ["Consultor RevOps asignado", "Especialista HubSpot técnico", "Sprint quincenal", "Soporte por ticket", "Reporte mensual de KPIs"],
    ctaLabel: "Empezar con Claridad →", ctaSolid: false, featured: false,
  },
  {
    key: "momentum", label: "MOMENTUM", labelGradient: true, price: "90",
    promesa: "Tu operación de ventas y marketing funcionando alineada, mejorando cada mes, sin que tengas que empujarla.",
    para: "Equipos de ventas y marketing que necesitan alineación real y ejecución constante.",
    features: ["Consultor RevOps Senior", "Mayor capacidad de ejecución", "Arquitecto de soluciones disponible", "Análisis de pipeline mensual", "Playbooks comerciales activos", "Marketing Ops incluido"],
    ctaLabel: "Empezar con Momentum →", ctaSolid: true, featured: true,
  },
  {
    key: "escala", label: "ESCALA", labelColor: DARK, price: "160",
    promesa: "Tu función completa de Revenue Operations — sin contratar, sin esperar, sin riesgo.",
    para: "Empresas en crecimiento con múltiples equipos que quieren delegar su operación completa.",
    features: ["Marketing Ops Specialist asignado", "Gobierno ventas + marketing + CS", "Reunión estratégica mensual con liderazgo", "Reporting ejecutivo para directorio", "IA incluida en consultoría estratégica"],
    ctaLabel: "Empezar con Escala →", ctaSolid: false, featured: false,
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
        boxShadow: plan.featured ? "0 20px 60px rgba(190,24,105,0.15)" : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
        order: plan.featured ? -1 : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      whileHover={{
        y: plan.featured ? -6 : -4,
        boxShadow: plan.featured ? "0 24px 70px rgba(190,24,105,0.2)" : "0 12px 40px rgba(0,0,0,0.1)",
      }}
    >
      {plan.featured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wide text-white px-4 py-1.5 rounded-full whitespace-nowrap" style={{ background: GRADIENT }}>
          ⭐ Más contratado
        </span>
      )}
      {"labelGradient" in plan && plan.labelGradient ? (
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] mb-4 bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>{plan.label}</span>
      ) : (
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: plan.labelColor }}>{plan.label}</span>
      )}
      <div className="flex items-baseline gap-2 mb-1">
        {"labelGradient" in plan && plan.labelGradient ? (
          <span className="text-[48px] font-bold leading-none bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>{plan.price}</span>
        ) : (
          <span className="text-[48px] font-bold leading-none" style={{ color: DARK }}>{plan.price}</span>
        )}
        <span className="text-sm" style={{ color: "#6B7280" }}>UF</span>
      </div>
      <span className="text-sm mb-5" style={{ color: "#6B7280" }}>+ IVA / mes</span>
      <div className="text-base italic leading-relaxed mb-5 pl-4" style={{ color: DARK, borderLeft: `3px solid`, borderImage: `${GRADIENT} 1` }}>{plan.promesa}</div>
      <p className="text-sm mb-5 leading-relaxed" style={{ color: "#6B7280" }}>{plan.para}</p>
      <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[15px]" style={{ color: DARK }}>
            <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: GRADIENT }}>
              <Check size={12} color="#fff" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <button
        className="w-full text-[15px] font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
        style={
          plan.ctaSolid
            ? { background: GRADIENT, color: "#fff", boxShadow: "0 4px 20px rgba(190,24,105,0.35)" }
            : { background: "transparent", border: "2px solid transparent", backgroundClip: "padding-box", backgroundImage: `linear-gradient(#fff, #fff), ${GRADIENT}`, backgroundOrigin: "border-box", WebkitBackgroundClip: "padding-box, border-box", color: DARK }
        }
      >
        {plan.ctaLabel}
      </button>
    </motion.div>
  );
};

/* ═══ Monthly Flow ═══ */
const flowSteps = [
  { code: "S1", title: "Inicio de sprint", desc: "Reunión de 60 minutos con tu consultor. Revisamos qué pasó, qué está moviéndose y definimos juntos las 3-5 prioridades del sprint. Nada se ejecuta sin estar priorizado contigo.", chip: "Semana 1" },
  { code: "EJ", title: "Ejecución", desc: "Tu consultor y el equipo trabajan en las prioridades. Tienes visibilidad del avance. Urgencias se canalizan por soporte.", chip: "Semanas 1 y 2" },
  { code: "CI", title: "Cierre de sprint", desc: "Reporte de lo ejecutado, métricas clave y propuesta de prioridades para el siguiente sprint. Concreto, sin relleno.", chip: "Cada 2 semanas" },
  { code: "KPI", title: "Dashboard mensual", desc: "KPIs actualizados. Visibilidad real de tu pipeline, marketing y operación comercial. Sin Excel, sin construcción manual.", chip: "Cada mes" },
];

const MonthlyFlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid md:grid-cols-4 gap-8 relative">
      <svg className="hidden md:block absolute top-[28px] left-[56px] right-[56px] h-[3px] pointer-events-none" style={{ width: "calc(100% - 112px)" }}>
        <motion.line x1="0" y1="1.5" x2="100%" y2="1.5" stroke="url(#flowGrad)" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: "easeOut" }} />
        <defs><linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
      </svg>
      {flowSteps.map((step, i) => (
        <motion.div key={step.code} className="text-center" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}>
          <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4 relative z-10" style={{ background: GRADIENT, boxShadow: "0 4px 16px rgba(190,24,105,0.3)" }}>{step.code}</div>
          <h4 className="font-bold text-base mb-2" style={{ color: DARK }}>{step.title}</h4>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>{step.desc}</p>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}>{step.chip}</span>
        </motion.div>
      ))}
    </div>
  );
};

/* ═══ Team ═══ */
const teamRoles = [
  { emoji: "🧠", title: "Consultor RevOps", desc: "Estrategia, priorización y mejora continua. Tu interlocutor principal." },
  { emoji: "⚙️", title: "Especialista HubSpot", desc: "Todo lo que se decide en sprint, construido en HubSpot." },
  { emoji: "🏗️", title: "Arquitecto de Soluciones", desc: "Decisiones técnicas complejas cuando el sprint lo requiere." },
  { emoji: "📣", title: "Marketing Ops Specialist", desc: "Automatizaciones, campañas y alineación marketing-ventas." },
  { emoji: "📊", title: "Gerente de Operaciones", desc: "Supervisión de calidad y cumplimiento de cada sprint." },
];

/* ═══ Comparison Table ═══ */
const compRows = [
  ["Costo mensual", "$3.5M–$4.5M CLP + beneficios", "90 UF + IVA"],
  ["Para arrancar", "3–6 meses", "Sprint 1"],
  ["Expertise", "1 persona", "Equipo de 4 especialistas"],
];

const ComparisonTable = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div ref={ref} className="mx-auto max-w-[700px] overflow-x-auto backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
      <div className="grid grid-cols-3 gap-2 mb-4 text-[12px] font-bold uppercase tracking-wider">
        <span />
        <span className="text-white/40 text-center">RevOps Manager interno</span>
        <span className="text-center px-3 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.2), rgba(98,36,190,0.2))", color: "#fff" }}>Plan Momentum</span>
      </div>
      {compRows.map(([label, intern, us], i) => (
        <div key={label} className="grid grid-cols-3 gap-2 py-3 text-[15px]" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
          <span className="text-white/70 font-medium">{label}</span>
          <span className="text-center text-white/40">{intern}</span>
          <span className="text-center font-bold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>{us}</span>
        </div>
      ))}
    </motion.div>
  );
};

/* ═══ PAGE ═══ */
const RevOpsAsAService = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* Hero */}
      <ServiceHero
        breadcrumbs={[
          { label: "Opera tu pista", to: "/opera-tu-pista" },
          { label: "RevOps as a Service" },
        ]}
        badge="Tu RevOps Manager externo"
        title="Tu Revenue Operations, operando desde el primer mes"
        subtitle="Sin contratar. Sin esperar. Sin curva de aprendizaje. Un consultor asignado y un equipo especialista operando tu motor de ingresos sprint a sprint."
        primaryCta={{ label: "Ver los planes →", onClick: () => scrollTo("planes") }}
        secondaryCta={{ label: "¿Cómo funciona en la práctica? ↓", onClick: () => scrollTo("tu-mes") }}
        rightContent={<SprintTimeline />}
      />

      <WaveDivider fromColor="#1A1A2E" toColor="#ffffff" />

      {/* S2: El problema */}
      <ProblemSection />

      <SectionDivider />

      {/* S3: Planes */}
      <section id="planes" className="relative overflow-hidden" style={{ background: "#F9FAFB", padding: "120px 0" }}>
        <DotPattern opacity={0.3} />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <SectionHeading title="Elige el nivel de operación que necesitas" highlightWord={3} />
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((p, i) => (
              <PlanCard key={p.key} plan={p} i={i} />
            ))}
          </div>
          <p className="text-center text-[14px] mt-8" style={{ color: "#6B7280" }}>
            Todos los planes incluyen onboarding sin costo. Compromiso mínimo 3 meses. Precios en UF + IVA.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* S4: Así se ve tu mes */}
      <section id="tu-mes" style={{ padding: "120px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <SectionHeading
            title="Así se ve tu mes con RevOps LATAM"
            subtitle="Sin sorpresas. Sabes qué esperar antes de empezar."
          />
          <MonthlyFlow />
        </div>
      </section>

      <SectionDivider />

      {/* S5: El equipo */}
      <section className="relative overflow-hidden" style={{ background: "#1A1A2E", padding: "120px 0" }}>
        <BackgroundOrbs variant="section" />
        <NoiseOverlay opacity={0.03} />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <SectionHeading title="No contratas una persona. Accedes a un equipo." light highlightWord={6} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamRoles.map((r, i) => {
              const icons = [Brain, Cog, HardHat, Megaphone, BarChart3];
              const Icon = icons[i] || Cog;
              return (
                <ServiceCard key={r.title} delay={i * 0.1} variant="glass" hoverBorder="#BE1869">
                  <GradientIcon icon={Icon} size={44} iconSize={20} className="mb-4" />
                  <h4 className="font-bold text-base mb-1 text-white">{r.title}</h4>
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{r.desc}</p>
                </ServiceCard>
              );
            })}
          </div>
          <p className="text-center text-[14px] mt-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            <strong>Claridad:</strong> roles 1+2 · <strong>Momentum:</strong> roles 1+2+3+4 · <strong>Escala:</strong> equipo completo
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* S6: Para quién es */}
      <ForWhomSection
        background="#fff"
        yesItems={[
          "Tienes HubSpot pero nadie lo opera estratégicamente",
          "Tu equipo apaga incendios en lugar de mejorar procesos",
          "Quieres decisiones respaldadas por datos, no intuición",
          "Estás creciendo y no quieres construir equipo interno",
        ]}
        noItems={[
          { text: "Aún no tienes HubSpot", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
          { text: "No sabes dónde está el problema", chip: "Conoce tu pista →", chipTo: "/conoce-tu-pista" },
          { text: "Solo necesitas soporte técnico", chip: "Soporte HubSpot →", chipTo: "/soporte-hubspot" },
        ]}
      />

      <SectionDivider />

      {/* S7: Argumento precio */}
      <section className="relative overflow-hidden" style={{ background: DARK, padding: "100px 0" }}>
        <BackgroundOrbs variant="section" />
        <div className="relative z-10 mx-auto max-w-[700px] px-6 text-center">
          <SectionHeading title="Lo que cuesta no tenerlo" light />
          <ComparisonTable />
          <p className="text-[14px] mt-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Estimación basada en rangos salariales de mercado en Chile para perfiles RevOps senior, 2025.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* S8: CTA Final */}
      <section className="relative overflow-hidden" style={{ padding: "100px 0", background: "#fff" }}>
        <GradientMesh variant="center" />
        <div className="relative z-10 mx-auto max-w-[600px] px-6 text-center">
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: DARK }}>
            El primer sprint empieza cuando tú quieras
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => scrollTo("planes")}
              className="text-[15px] font-semibold text-white px-8 py-4 rounded-full hover:scale-[1.03] transition-all"
              style={{ background: GRADIENT, boxShadow: "0 4px 20px rgba(190,24,105,0.35)" }}
            >
              Ver los planes →
            </button>
            <button className="text-[15px] font-semibold px-8 py-4 rounded-full transition-all hover:scale-[1.03]" style={{ border: "1.5px solid #E5E7EB", color: DARK }}>
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
    <section ref={ref} style={{ padding: "120px 0" }}>
      <div className="mx-auto max-w-[900px] px-6">
        <SectionHeading title="Tienes HubSpot. Tienes equipo. Pero nadie está operando el motor." />
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          {[left, right].map((col, ci) =>
            col.map((text, i) => (
              <motion.div key={text} className="flex items-start gap-3" initial={{ opacity: 0, x: ci === 0 ? -15 : 15 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + (ci * 3 + i) * 0.08, duration: 0.4 }}>
                <X size={16} className="mt-0.5 shrink-0" style={{ color: "#EF4444" }} />
                <span className="text-base leading-relaxed" style={{ color: "#6B7280" }}>{text}</span>
              </motion.div>
            ))
          )}
        </div>
        <motion.div className="mt-14 mx-auto text-center text-base font-bold leading-relaxed px-6 py-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))", color: "#BE1869", maxWidth: 560 }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
          No es falta de voluntad. Es falta de una función dedicada a que eso no pase.
        </motion.div>
      </div>
    </section>
  );
};

export default RevOpsAsAService;
