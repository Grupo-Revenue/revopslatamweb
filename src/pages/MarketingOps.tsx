import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Check, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";
const ACCENT = "#FF7A59";
const DARK = "#1A1A2E";

/* ═══ counter hook ═══ */
function useCounter(end: number, dur = 1500, inView = false) {
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
  return v;
}

/* ═══════════════════════════════════════════════════════════
   HERO FUNNEL
   ═══════════════════════════════════════════════════════════ */
const funnelLevels = [
  { label: "Leads captados", count: 4200, width: "100%" },
  { label: "Leads nutridos", count: 1860, width: "78%" },
  { label: "MQLs calificados", count: 620, width: "52%" },
  { label: "Entregados a ventas ✓", count: 310, width: "36%" },
];

const HeroFunnel = () => {
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
        padding: "32px 28px",
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div className="space-y-3">
        {funnelLevels.map((lvl, i) => (
          <FunnelLevel key={lvl.label} lvl={lvl} i={i} inView={inView} isLast={i === 3} />
        ))}
      </div>

      {/* leak line between level 0-1 */}
      <motion.div
        className="absolute right-4 flex items-center gap-2"
        style={{ top: "22%" }}
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <span className="text-[11px] text-red-400/70 italic whitespace-nowrap">Sin nurturing → se pierden</span>
        <X size={14} style={{ color: "rgba(239,68,68,0.5)" }} />
      </motion.div>
    </motion.div>
  );
};

const FunnelLevel = ({
  lvl,
  i,
  inView,
  isLast,
}: {
  lvl: (typeof funnelLevels)[0];
  i: number;
  inView: boolean;
  isLast: boolean;
}) => {
  const count = useCounter(lvl.count, 1500, inView);
  const opacities = [0.35, 0.5, 0.65, 1];

  return (
    <motion.div
      className="mx-auto relative"
      style={{ width: lvl.width }}
      initial={{ opacity: 0, y: -16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + i * 0.3, duration: 0.5 }}
    >
      <div
        className="relative rounded-xl px-5 py-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, rgba(190,24,105,${opacities[i]}), rgba(98,36,190,${opacities[i]}))`,
        }}
      >
        <span className="text-white text-sm font-medium">{lvl.label}</span>
        <span className="text-white text-lg font-bold tabular-nums">{count.toLocaleString()}</span>
      </div>

      {/* floating badge on last level */}
      {isLast && (
        <motion.span
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wide text-white px-3 py-1 rounded-full whitespace-nowrap"
          style={{ background: GRADIENT }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          Alineado con ventas ✓
        </motion.span>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   OPERATIONS GRID
   ═══════════════════════════════════════════════════════════ */
const opsItems = [
  { emoji: "⚙️", grad: true, title: "Automatizaciones de marketing", desc: "Workflows de nurturing, lead scoring, asignación automática. Los leads no se enfríen esperando atención manual." },
  { emoji: "📣", grad: false, title: "Gestión de campañas", desc: "Pauta en buscadores y redes operada por alguien que entiende el CRM, no solo las plataformas." },
  { emoji: "🔧", grad: true, title: "Marketing Hub activo", desc: "Formularios, emails, secuencias, listas y segmentación. Que la herramienta trabaje, no solo exista." },
  { emoji: "🤝", grad: false, title: "Alineación marketing-ventas", desc: "Definición de MQL, protocolo de handoff y seguimiento de leads hasta el cierre." },
  { emoji: "📊", grad: true, title: "Reportería integrada", desc: "Métricas conectadas con pipeline. No solo impresiones — cuánto de lo invertido terminó en revenue." },
];

/* ═══ ChipLink ═══ */
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
   PAGE
   ═══════════════════════════════════════════════════════════ */
const MarketingOps = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── S1: HERO ── */}
      <section className="relative overflow-hidden" style={{ background: DARK, minHeight: "85vh" }}>
        <div className="mx-auto max-w-[1200px] px-6 pt-36 pb-24 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-[85vh]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link to="/opera-tu-pista" className="hover:text-white/60 transition-colors">Opera tu pista</Link>
              <ChevronRight size={12} />
              <span className="text-white/70">Marketing Ops</span>
            </div>

            <span
              className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,122,89,0.15)", color: ACCENT }}
            >
              Operación, no agencia
            </span>

            <h1 className="font-bold text-white leading-[1.08] mb-6" style={{ fontSize: "clamp(40px, 5vw, 58px)" }}>
              Tu operación de marketing funcionando, no solo planificada
            </h1>

            <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500 }}>
              Automatizaciones activas, campañas que se miden, leads que llegan a ventas en el momento correcto.
              El músculo que la mayoría necesita pero pocos tienen internamente.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03] hover:shadow-xl" style={{ background: GRADIENT }}>
                Cuéntanos cómo está tu marketing →
              </button>
              <button
                onClick={() => document.getElementById("problema")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                ¿Es este el servicio correcto? ↓
              </button>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HeroFunnel />
          </div>
        </div>
      </section>

      {/* ── S2: EL PROBLEMA ── */}
      <ProblemSection />

      {/* ── S3: QUÉ OPERAMOS ── */}
      <OpsSection />

      {/* ── S4: CÓMO FUNCIONA ── */}
      <HowSection />

      {/* ── S5: PARA QUIÉN ES ── */}
      <ForWhomSection />

      {/* ── S6: CTA FINAL ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="mx-auto max-w-[480px] px-6">
          <div
            className="text-center rounded-[20px] p-10"
            style={{
              background: "#fff",
              border: "1.5px solid #E5E7EB",
              boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] block mb-4" style={{ color: "#6B7280" }}>
              Este servicio empieza con una conversación
            </span>
            <h2 className="text-lg font-bold mb-3" style={{ color: DARK }}>
              Cuéntanos cómo está operando tu marketing hoy.
            </h2>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: "#6B7280" }}>
              En 30 minutos evaluamos qué tiene más impacto en tu operación.
            </p>
            <button
              className="w-full text-sm font-semibold text-white py-3.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: GRADIENT }}
            >
              Cuéntanos cómo está tu marketing →
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

  const cards = [
    {
      emoji: "😓",
      title: "Tienen herramienta, falta operación",
      desc: "Marketing Hub comprado, automatizaciones a medias, campañas que nadie optimiza. La inversión existe — el retorno, no.",
    },
    {
      emoji: "⚡",
      title: "Tienen estrategia, falta ejecución",
      desc: "Saben qué quieren hacer pero nadie tiene tiempo de hacerlo bien. El día a día se come la operación.",
    },
  ];

  return (
    <section id="problema" ref={ref} style={{ padding: "100px 0" }}>
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-2xl md:text-[34px] font-bold leading-tight mb-12" style={{ color: DARK }}>
          La brecha entre "tenemos marketing" y "el marketing funciona"
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              className="rounded-2xl p-8"
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <span className="text-3xl mb-3 block">{c.emoji}</span>
              <h3 className="font-bold text-base mb-2" style={{ color: DARK }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 mx-auto text-center text-sm font-bold px-6 py-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(190,24,105,0.06), rgba(98,36,190,0.06))",
            color: "#BE1869",
            maxWidth: 520,
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Marketing Ops no es creatividad. Es la diferencia entre un plan y un motor.
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Operations Section ─── */
const OpsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ background: "#F9FAFB", padding: "100px 0" }}>
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-14" style={{ color: DARK }}>
          Lo que operamos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opsItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-2xl p-7 border transition-all duration-300"
              style={{ borderColor: "#E5E7EB" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ borderColor: ACCENT }}
            >
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <h4 className="font-bold text-[15px] mb-2" style={{ color: DARK }}>{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── How it works ─── */
const HowSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 0" }}>
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-12" style={{ color: DARK }}>
          Integrado a tu operación, no en paralelo
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Como add-on de RevOps as a Service",
              desc: "Las prioridades de marketing se priorizan junto al resto de la operación. Marketing y ventas alineados bajo el mismo sprint.",
              chip: "Recomendado →",
            },
            {
              title: "Como servicio independiente",
              desc: "Para equipos que ya tienen su operación RevOps ordenada y necesitan músculo de ejecución en marketing. Mismo modelo de sprint quincenal.",
              chip: null,
            },
          ].map((path, i) => (
            <motion.div
              key={path.title}
              className="rounded-2xl p-7"
              style={{
                background: "#F9FAFB",
                borderLeft: "3px solid",
                borderImage: `${GRADIENT} 1`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <h4 className="font-bold text-base mb-3" style={{ color: DARK }}>{path.title}</h4>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B7280" }}>{path.desc}</p>
              {path.chip && (
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
                >
                  {path.chip}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── For Whom ─── */
const ForWhomSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const yes = [
    "Tienes Marketing Hub pero no lo operas con su potencial",
    "Nadie tiene tiempo de gestionar campañas con criterio",
    "El handoff marketing-ventas es caótico o inexistente",
    "Quieres pauta gestionada por alguien que entiende el CRM",
  ];
  const no: { text: string; note?: string; chip?: string; chipTo?: string }[] = [
    { text: "Buscas agencia creativa, contenido o branding", note: "Ese no es nuestro foco" },
    { text: "No tienes Marketing Hub", chip: "Diseña y Construye →", chipTo: "/diseña-y-construye-tu-pista" },
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
                    {n.note && <span className="block text-xs mt-1 italic" style={{ color: "#9CA3AF" }}>→ {n.note}</span>}
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

export default MarketingOps;
