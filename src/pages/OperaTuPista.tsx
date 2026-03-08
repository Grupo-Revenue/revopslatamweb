import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Zap, TrendingDown, GitBranch, Cog, Megaphone, Headphones } from "lucide-react";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";
import WaveDivider from "@/components/services/WaveDivider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── constants ─── */
const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

/* ─── counter hook ─── */
function useCounter(end: number, duration = 1500, inView = false, suffix = "") {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * end));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);
  return val + suffix;
}

/* ─── animated dashboard ─── */
const DashboardHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const metrics = [
    { label: "Pipeline activo", value: 842, suffix: "M", trend: "+12%" },
    { label: "Tasa de cierre", value: 34, suffix: "%", trend: "+5%" },
    { label: "Leads calificados", value: 127, suffix: "", trend: "+18%" },
    { label: "Ciclo promedio", value: 23, suffix: "d", trend: "-8%" },
  ];

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
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
      {/* shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
          animation: "shimmer 4s ease-in-out infinite",
        }}
      />
      {/* header */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="inline-block rounded-full"
          style={{
            width: 10,
            height: 10,
            background: "#4ADE80",
            boxShadow: "0 0 8px #4ADE80",
            animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        />
        <span className="text-white/80 text-sm font-semibold tracking-wide">
          Motor de Ingresos — Activo
        </span>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 gap-5">
        {metrics.map((m, i) => (
          <MetricBox key={m.label} {...m} inView={inView} delay={i * 0.15} />
        ))}
      </div>

      {/* sprint bar */}
      <div
        className="mt-6 pt-5 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="text-white/50 text-xs font-medium">Próximo sprint:</span>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: "rgba(190,24,105,0.15)", color: "#BE1869" }}
        >
          En 3 días
        </span>
      </div>
    </motion.div>
  );
};

const MetricBox = ({
  label,
  value,
  suffix,
  trend,
  inView,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  trend: string;
  inView: boolean;
  delay: number;
}) => {
  const display = useCounter(value, 1500, inView, suffix);
  const isNeg = trend.startsWith("-");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + delay, duration: 0.5 }}
    >
      <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}
      </p>
      <p className="text-[28px] font-bold text-white leading-none">{display}</p>
      <span className="text-xs font-semibold mt-1 inline-block" style={{ color: isNeg ? "#4ADE80" : "#4ADE80" }}>
        {isNeg ? "↓" : "↑"} {trend}
      </span>
    </motion.div>
  );
};

/* ─── service cards ─── */
const serviceCards = [
  {
    badge: "NUESTRO CORE",
    badgeBg: GRADIENT,
    badgeText: "#fff",
    icon: Cog,
    iconColor: GRADIENT,
    title: "RevOps as a Service",
    tagline: "Tu Revenue Operations, operando desde el primer mes",
    desc: "Consultoría estratégica y ejecución técnica en paralelo. Tu consultor asignado opera tu motor como si fuera parte de tu equipo.",
    price: "Desde 50 UF + IVA / mes",
    cta: "Ver planes →",
    ctaTo: "/revops-as-a-service",
  },
  {
    badge: "ADD-ON DISPONIBLE",
    badgeBg: `${ACCENT}1a`,
    badgeText: ACCENT,
    icon: Megaphone,
    iconColor: ACCENT,
    title: "Marketing Ops",
    tagline: "Tu operación de marketing funcionando, no solo planificada",
    desc: "Automatizaciones, campañas, nurturing y alineación con ventas. El músculo que la mayoría necesita pero pocos tienen internamente.",
    price: "",
    cta: "Ver servicio →",
    ctaTo: "/marketing-ops",
  },
  {
    badge: "CONTRATACIÓN ONLINE",
    badgeBg: "rgba(74,222,128,0.1)",
    badgeText: "#16A34A",
    icon: Headphones,
    iconColor: GRADIENT,
    title: "Soporte HubSpot",
    tagline: "Tu HubSpot siempre funcionando",
    desc: "Banco de horas mensual con especialista asignado. Ticket abierto, SLA garantizado, problema resuelto.",
    price: "Desde 15 UF + IVA / mes",
    cta: "Ver planes →",
    ctaTo: "/soporte-hubspot",
  },
];

const ServiceCard = ({ card, i }: { card: (typeof serviceCards)[0]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isGradientIcon = card.iconColor === GRADIENT;
  const Icon = card.icon;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col bg-white rounded-[20px] p-9 md:p-10 border border-[#E5E7EB] transition-all duration-300 cursor-default"
      style={{ willChange: "transform" }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      whileHover={{
        y: -4,
        boxShadow: "0 20px 50px -12px rgba(0,0,0,0.15)",
        borderColor: "#BE1869",
      }}
    >
      {/* badge */}
      <span
        className="self-start text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-5"
        style={{
          background: card.badge === "NUESTRO CORE" ? GRADIENT : card.badgeBg,
          color: card.badgeText,
        }}
      >
        {card.badge}
      </span>

      {/* icon */}
      <div className="mb-4">
        {isGradientIcon ? (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: GRADIENT }}
          >
            <Icon size={22} color="#fff" />
          </div>
        ) : (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${card.iconColor}1a` }}
          >
            <Icon size={22} color={card.iconColor} />
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold mb-1" style={{ color: DARK }}>{card.title}</h3>
      <p
        className="text-sm font-semibold mb-3 bg-clip-text text-transparent"
        style={{ backgroundImage: GRADIENT }}
      >
        {card.tagline}
      </p>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>{card.desc}</p>

      <div className="mt-auto">
        {card.price && (
          <p className="text-base font-bold mb-3" style={{ color: DARK }}>{card.price}</p>
        )}
        <Link
          to={card.ctaTo}
          className="text-sm font-semibold inline-flex items-center gap-1 bg-clip-text text-transparent transition-opacity hover:opacity-70"
          style={{ backgroundImage: GRADIENT }}
        >
          {card.cta}
        </Link>
      </div>
    </motion.div>
  );
};

/* ─── comparison table ─── */
const tableRows = [
  ["Costo mensual", "$3.5M–$4.5M CLP + beneficios", "Desde 50 UF"],
  ["Tiempo para arrancar", "3–6 meses", "Sprint 1"],
  ["Expertise", "1 persona, 1 perfil", "Equipo completo"],
  ["Riesgo de renuncia", "Alto", "Ninguno"],
  ["Curva de aprendizaje", "3–6 meses", "Cero"],
];

const ComparisonTable = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* header */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
        <span className="text-white/30" />
        <span className="text-white/40 text-center">RevOps Manager interno</span>
        <span
          className="text-center px-3 py-2 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(190,24,105,0.2), rgba(98,36,190,0.2))",
            color: "#fff",
          }}
        >
          RevOps LATAM
        </span>
      </div>

      {tableRows.map(([label, intern, us], i) => (
        <div
          key={label}
          className="grid grid-cols-3 gap-2 py-3 text-sm"
          style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
        >
          <span className="text-white/70 font-medium">{label}</span>
          <span className="text-center text-white/40">{intern}</span>
          <span
            className="text-center font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENT }}
          >
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
const OperaTuPista = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── S1: HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: DARK, minHeight: "90vh" }}
      >
        <BackgroundOrbs variant="hero" />
        <div className="mx-auto max-w-[1200px] px-6 pt-36 pb-24 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-[90vh]">
          {/* text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/" className="hover:text-white/60 transition-colors">Inicio</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Opera tu Pista</span>
            </div>

            {/* badge */}
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-white px-4 py-1.5 rounded-full mb-6"
              style={{ background: GRADIENT }}
            >
              Opera tu Pista
            </span>

            <h1
              className="font-bold text-white leading-[1.08] mb-6"
              style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
            >
              Un equipo completo que opera tu pista
              <br className="hidden md:block" />
              {" "}mientras tú corres la carrera
            </h1>

            <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>
              Construir la pista era el primer paso. Operarla bien, todos los días, es lo que convierte
              una buena implementación en resultados reales.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03] hover:shadow-xl"
                style={{ background: GRADIENT }}
              >
                Quiero que operen mi pista →
              </button>
              <Link
                to="/conoce-tu-pista"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Primero quiero un diagnóstico →
              </Link>
            </div>
          </motion.div>

          {/* visual */}
          <div className="hidden lg:block">
            <DashboardHero />
          </div>
        </div>
      </section>

      <WaveDivider fromColor={DARK} toColor="#ffffff" />

      {/* ── S2: EL PROBLEMA ── */}
      <ProblemSection />

      {/* ── S3: SERVICIOS ── */}
      <SectionDivider />

      <section className="relative overflow-hidden" style={{ background: "#F9FAFB", padding: "120px 0" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="mx-auto max-w-[1100px] px-6 relative z-10">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-14" style={{ color: DARK }}>
            Tres formas de operar tu pista con nosotros
          </h2>
          <div className="grid md:grid-cols-3 gap-7">
            {serviceCards.map((c, i) => (
              <ServiceCard key={c.title} card={c} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── S4: POR QUÉ CON NOSOTROS ── */}
      <WhyUsSection />

      {/* ── S5: CTA FINAL ── */}
      <WaveDivider fromColor="#F9FAFB" toColor={DARK} />
      <section className="relative overflow-hidden" style={{ padding: "80px 0", background: DARK }}>
        <BackgroundOrbs variant="section" />
        <GradientMesh variant="center" />
        <div className="relative z-10 mx-auto max-w-[600px] px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            ¿No sabes por dónde partir?
          </h2>
          <p className="text-base mb-8" style={{ color: "#6B7280" }}>
            Si aún no tienes claridad de qué necesita tu operación, el primer paso es un diagnóstico.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl hover:scale-[1.03] hover:shadow-xl transition-all"
              style={{ background: GRADIENT }}
            >
              Quiero que operen mi pista →
            </button>
            <Link
              to="/conoce-tu-pista"
              className="text-sm font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03]"
              style={{
                border: "1.5px solid #E5E7EB",
                color: DARK,
              }}
            >
              Primero quiero un diagnóstico →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

/* ─── Problem Section ─── */
const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cols = [
    { icon: "⏱️", title: "El día a día se come todo", desc: "Nadie tiene tiempo de mejorar procesos mientras el negocio avanza." },
    { icon: "📉", title: "Los procesos se degradan", desc: "Lo que se implementó bien empieza a deteriorarse sin mantenimiento activo." },
    { icon: "🔀", title: "Marketing y ventas siguen desconectados", desc: "Cada área trabaja hacia su propia métrica sin una función que las alinee." },
  ];

  return (
    <section ref={ref} style={{ padding: "100px 0" }}>
      <div className="mx-auto max-w-[960px] px-6">
        <h2 className="text-center text-2xl md:text-[36px] font-bold leading-tight mb-4" style={{ color: DARK }}>
          La mayoría de los CRM bien implementados igual terminan subutilizados
        </h2>
        <p className="text-center text-base mb-14 mx-auto" style={{ color: "#6B7280", maxWidth: 600 }}>
          No por la herramienta. Por lo que pasa después de implementar.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {cols.map((c, i) => (
            <motion.div
              key={c.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <h3 className="font-bold text-base mb-2" style={{ color: DARK }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-14 mx-auto text-center text-sm font-medium leading-relaxed px-6 py-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))",
            color: DARK,
            maxWidth: 640,
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Operar bien una pista requiere alguien que esté mirando los datos y afinando el motor — siempre.
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Why Us Section ─── */
const WhyUsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: DARK, padding: "100px 0" }}>
      <div className="mx-auto max-w-[1100px] px-6 grid lg:grid-cols-2 gap-14 items-start">
        {/* text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-white text-2xl md:text-[40px] font-bold leading-tight mb-6">
            No mandamos informes. Trabajamos.
          </h2>
          <div className="space-y-4 mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            <p className="text-base leading-relaxed">
              La diferencia entre un consultor tradicional y RevOps as a Service es simple: nos quedamos a ejecutar.
            </p>
            <p className="text-base leading-relaxed">
              Cada sprint definimos prioridades contigo. Cada sprint entregamos resultados. Cada mes tienes
              visibilidad completa de qué se hizo, qué mejoró y qué sigue.
            </p>
          </div>

          <div
            className="rounded-2xl px-6 py-5 text-sm leading-relaxed text-white/80"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <strong className="text-white">14 años</strong> operando motores de ingresos en LATAM
            <br />
            · HubSpot Platinum Partners +10 años
          </div>
        </motion.div>

        {/* table */}
        <ComparisonTable />
      </div>
    </section>
  );
};

export default OperaTuPista;
