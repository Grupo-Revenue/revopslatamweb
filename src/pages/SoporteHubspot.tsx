import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Check, X, ArrowRight, Tag, User, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ═══ counter hook ═══ */
function useCounter(end: number, dur = 1200, inView = false, suffix = "") {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const s = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - s) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - t, 3)) * end));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, dur]);
  return v + suffix;
}

/* ═══ ChipLink ═══ */
const ChipLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-all hover:scale-105"
    style={{ background: "linear-gradient(135deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))", color: "#BE1869" }}
  >
    {children} <ArrowRight size={12} />
  </Link>
);

/* ═══════════════════════════════════════════════════════════
   PLANS
   ═══════════════════════════════════════════════════════════ */
const plans = [
  {
    key: "base",
    label: "SOPORTE BASE",
    labelColor: "#6B7280",
    price: "15",
    priceDisplay: true,
    hours: "10 horas mensuales",
    features: [
      "10 horas mensuales de soporte",
      "Especialista HubSpot asignado",
      "SLA: respuesta en 24 horas hábiles",
      "Hora extra: 1,5 UF + IVA",
    ],
    note: "Horas no consumidas no se acumulan",
    cta: "Contratar Soporte Base →",
    ctaSolid: false,
    featured: false,
    savingChip: null,
  },
  {
    key: "activo",
    label: "SOPORTE ACTIVO",
    labelGradient: true,
    price: "26",
    priceDisplay: true,
    hours: "20 horas mensuales",
    features: [
      "20 horas mensuales de soporte",
      "Especialista HubSpot asignado",
      "SLA: respuesta en 12 horas hábiles",
      "Hora extra: 1,3 UF + IVA",
    ],
    note: "Horas no consumidas no se acumulan",
    cta: "Contratar Soporte Activo →",
    ctaSolid: true,
    featured: true,
    savingChip: "Mejor tarifa por hora",
  },
  {
    key: "medida",
    label: "SOPORTE A MEDIDA",
    labelColor: DARK,
    price: null,
    priceDisplay: false,
    priceText: "Cotización personalizada",
    hours: "Para portales con mayor volumen o necesidades especiales",
    features: [
      "Horas mensuales a definir",
      "SLA personalizado",
      "Puede combinarse con otros servicios",
      "Tarifas por volumen disponibles",
    ],
    note: null,
    cta: "Solicitar cotización →",
    ctaSolid: false,
    featured: false,
    savingChip: null,
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
        boxShadow: plan.featured ? "0 20px 60px rgba(190,24,105,0.12)" : "none",
        order: plan.featured ? -1 : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      whileHover={{
        y: plan.featured ? -4 : -2,
        boxShadow: plan.featured
          ? "0 24px 70px rgba(190,24,105,0.18)"
          : "0 12px 40px rgba(0,0,0,0.08)",
      }}
    >
      {plan.featured && (
        <span
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wide text-white px-4 py-1.5 rounded-full whitespace-nowrap"
          style={{ background: GRADIENT }}
        >
          Más popular
        </span>
      )}

      {/* label */}
      {"labelGradient" in plan && plan.labelGradient ? (
        <span className="text-xs font-bold uppercase tracking-[0.14em] mb-4 bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
          {plan.label}
        </span>
      ) : (
        <span className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: plan.labelColor }}>
          {plan.label}
        </span>
      )}

      {/* price */}
      {plan.priceDisplay && plan.price ? (
        <>
          <div className="flex items-baseline gap-2 mb-1">
            {plan.featured ? (
              <span className="text-[48px] font-bold leading-none bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                {plan.price}
              </span>
            ) : (
              <span className="text-[48px] font-bold leading-none" style={{ color: DARK }}>{plan.price}</span>
            )}
            <span className="text-sm" style={{ color: "#6B7280" }}>UF</span>
          </div>
          <span className="text-sm mb-1" style={{ color: "#6B7280" }}>+ IVA / mes</span>
        </>
      ) : (
        <span className="text-xl font-bold mb-1" style={{ color: DARK }}>
          {(plan as any).priceText}
        </span>
      )}
      <span className="text-sm mb-5" style={{ color: "#6B7280" }}>{plan.hours}</span>

      <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />

      {/* features */}
      <ul className="space-y-3 mb-5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: DARK }}>
            <span
              className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: plan.featured ? GRADIENT : `${ACCENT}1a` }}
            >
              <Check size={12} color={plan.featured ? "#fff" : ACCENT} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {plan.note && (
        <p className="text-xs italic mb-5" style={{ color: "#6B7280" }}>{plan.note}</p>
      )}

      <div className="h-px mb-5" style={{ background: "#E5E7EB" }} />

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
        {plan.cta}
      </button>

      {plan.savingChip && (
        <span
          className="mt-4 mx-auto inline-block text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
        >
          {plan.savingChip}
        </span>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   COVERAGE TAGS
   ═══════════════════════════════════════════════════════════ */
const coverageTags = [
  "Workflows y automatizaciones",
  "Propiedades y campos personalizados",
  "Reportes y dashboards",
  "Configuración de usuarios",
  "Secuencias y plantillas de email",
  "Pipelines y etapas",
  "Integraciones nativas",
  "Listas y segmentación",
  "Formularios y páginas",
  "Ajustes técnicos en el portal",
];

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
const SoporteHubspot = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });

  const stat24 = useCounter(24, 1200, heroInView, "h");
  const stat12 = useCounter(12, 1200, heroInView, "h");

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── S1: HERO ── */}
      <section className="relative overflow-hidden" style={{ background: DARK, minHeight: "80vh" }}>
        <div ref={heroRef} className="mx-auto max-w-[680px] px-6 pt-36 pb-24 text-center flex flex-col items-center min-h-[80vh] justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/opera-tu-pista" className="hover:text-white/60 transition-colors">Opera tu pista</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Soporte HubSpot</span>
            </div>

            {/* badge */}
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(74,222,128,0.15)", color: "#16A34A" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#4ADE80", boxShadow: "0 0 8px #4ADE80", animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
              />
              Contratación online disponible
            </span>

            <h1 className="font-bold text-white leading-[1.08] mb-6" style={{ fontSize: "clamp(40px, 5vw, 58px)" }}>
              Tu HubSpot siempre funcionando
            </h1>

            <p className="text-lg leading-relaxed mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>
              Un especialista que conoce tu portal, disponible cuando lo necesitas. Sin reuniones. Sin explicar desde cero cada vez.
            </p>

            <button
              onClick={() => scrollTo("planes")}
              className="text-base font-semibold text-white px-9 py-4 rounded-xl transition-all hover:scale-[1.03] hover:shadow-xl mb-12"
              style={{ background: GRADIENT }}
            >
              Ver planes y contratar →
            </button>

            {/* stats */}
            <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
              {[
                { value: stat24, label: "respuesta máxima plan base" },
                { value: stat12, label: "respuesta plan activo" },
                { value: "0", label: "reuniones para empezar" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-[32px] font-bold bg-clip-text text-transparent block" style={{ backgroundImage: GRADIENT }}>
                    {s.value}
                  </span>
                  <span className="text-xs block mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── S2: CÓMO FUNCIONA ── */}
      <HowSection />

      {/* ── S3: PLANES ── */}
      <section id="planes" style={{ background: "#F9FAFB", padding: "100px 0" }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
            Elige tu plan y contrata ahora
          </h2>
          <p className="text-center text-base mb-14 mx-auto" style={{ color: "#6B7280", maxWidth: 480 }}>
            Sin reuniones de venta. Sin propuestas. Elige, contrata y asignamos tu especialista en 24 horas hábiles.
          </p>
          <div className="grid md:grid-cols-3 gap-7 items-start">
            {plans.map((p, i) => (
              <PlanCard key={p.key} plan={p} i={i} />
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: "#9CA3AF" }}>
            Todos los planes requieren portal HubSpot activo. Servicio reactivo — se activa vía ticket. No incluye consultoría estratégica.
          </p>
        </div>
      </section>

      {/* ── S4: QUÉ RESOLVEMOS ── */}
      <CoverageSection />

      {/* ── S5: PARA QUIÉN ES ── */}
      <ForWhomSection />

      {/* ── S6: CTA FINAL ── */}
      <section style={{ background: DARK, padding: "80px 0" }}>
        <div className="mx-auto max-w-[560px] px-6 text-center">
          <h2 className="text-white text-2xl md:text-[28px] font-bold mb-4">
            Contrátalo ahora. Operando en 24 horas.
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Sin reuniones de venta. Sin propuestas. Elige tu plan, y asignamos tu especialista en 24 horas hábiles.
          </p>
          <button
            onClick={() => scrollTo("planes")}
            className="text-base font-semibold text-white px-9 py-4 rounded-xl transition-all hover:scale-[1.03] hover:shadow-xl"
            style={{ background: GRADIENT }}
          >
            Ver planes →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ─── How Section ─── */
const HowSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const steps = [
    { icon: Tag, color: GRADIENT, num: "01", title: "Abres un ticket", desc: "Describes lo que necesitas. Sin formularios largos, sin reuniones previas." },
    { icon: User, color: ACCENT, num: "02", title: "Tu especialista lo atiende", desc: "Asignado a tu cuenta. No explicas el contexto desde cero cada vez." },
    { icon: CheckCircle, color: GRADIENT, num: "03", title: "Resuelto en el SLA", desc: "Tiempo de respuesta garantizado según tu plan. Sin sorpresas." },
  ];

  return (
    <section ref={ref} style={{ padding: "80px 0" }}>
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-2xl md:text-[32px] font-bold mb-14" style={{ color: DARK }}>
          Simple. Sin overhead.
        </h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* connectors desktop */}
          <svg className="hidden md:block absolute top-6 left-[17%] right-[17%] h-1 pointer-events-none" style={{ width: "66%" }}>
            <line x1="0" y1="2" x2="50%" y2="2" stroke="url(#dotGrad1)" strokeWidth={2} strokeDasharray="6 6" opacity={0.3} />
            <line x1="50%" y1="2" x2="100%" y2="2" stroke="url(#dotGrad2)" strokeWidth={2} strokeDasharray="6 6" opacity={0.3} />
            <defs>
              <linearGradient id="dotGrad1"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient>
              <linearGradient id="dotGrad2"><stop offset="0%" stopColor="#6224BE" /><stop offset="100%" stopColor="#BE1869" /></linearGradient>
            </defs>
          </svg>

          {steps.map((s, i) => {
            const Icon = s.icon;
            const isGrad = s.color === GRADIENT;
            return (
              <motion.div
                key={s.num}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <div
                  className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: isGrad ? GRADIENT : `${ACCENT}1a` }}
                >
                  <Icon size={22} color={isGrad ? "#fff" : ACCENT} />
                </div>
                <span className="text-[11px] font-bold tracking-widest bg-clip-text text-transparent block mb-2" style={{ backgroundImage: GRADIENT }}>
                  {s.num}
                </span>
                <h4 className="font-bold text-base mb-2" style={{ color: DARK }}>{s.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── Coverage Section ─── */
const CoverageSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 0" }}>
      <div className="mx-auto max-w-[700px] px-6">
        <h2 className="text-center text-xl md:text-[28px] font-bold mb-10" style={{ color: DARK }}>
          Lo que cubre el soporte
        </h2>
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {coverageTags.map((tag, i) => (
            <motion.span
              key={tag}
              className="text-sm px-5 py-2.5 rounded-full border cursor-default transition-all duration-200"
              style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: DARK }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{
                borderColor: "#BE1869",
                color: "#BE1869",
                background: "rgba(190,24,105,0.04)",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ─── For Whom ─── */
const ForWhomSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const yes = [
    "HubSpot implementado y funcionando bien",
    "No necesitas consultoría — solo mantención puntual",
    "Tu equipo usa HubSpot activamente",
    "Terminaste una implementación y quieres mantener el portal en buenas manos",
  ];
  const no: { text: string; chip?: string; chipTo?: string }[] = [
    { text: "Necesitas mejorar estratégicamente tu operación", chip: "RevOps as a Service →", chipTo: "/revops-as-a-service" },
    { text: "Tu portal tiene problemas estructurales", chip: "Conoce tu pista →", chipTo: "/conoce-tu-pista" },
  ];

  return (
    <section ref={ref} style={{ background: "#F9FAFB", padding: "100px 0" }}>
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

export default SoporteHubspot;
