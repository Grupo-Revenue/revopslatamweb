import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Search, Wrench, Settings, Brain,
  Building2, BarChart3, Megaphone, Heart, Cog,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PistaStorySticky from "@/components/landing/PistaStorySticky";
import { useLeadForm } from "@/hooks/useLeadForm";

/* ─── Helpers ─── */
const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block font-bold uppercase tracking-[0.14em]"
    style={{
      fontSize: 11,
      background: GRADIENT,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </span>
);

const EyebrowLight = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full"
    style={{
      fontSize: 11,
      background: "linear-gradient(135deg, rgba(190,24,105,0.15), rgba(98,36,190,0.15))",
      color: "#fff",
    }}
  >
    {children}
  </span>
);

/* ─── Section 3: Method cards data ─── */
const methodCards = [
  {
    num: "01",
    icon: Search,
    iconColor: undefined as string | undefined,
    badge: "EL PRIMER PASO",
    badgeBg: "rgba(190,24,105,0.08)",
    badgeColor: undefined as string | undefined,
    title: "Conoce tu pista",
    subtitle: "El diagnóstico",
    desc: "Antes de construir o cambiar cualquier cosa, necesitas saber exactamente qué está fallando y por qué. Mapeamos tu operación e identificamos los cuellos de botella que frenan tu crecimiento.",
    tags: [
      { label: "Diagnóstico del Motor de Ingresos", to: "/diagnostico-revops", color: undefined as string | undefined },
      { label: "Pulso Comercial", to: "https://pulso.revopslatam.com/", color: undefined as string | undefined, external: true },
    ],
    link: "/conoce-tu-pista",
  },
  {
    num: "02",
    icon: Wrench,
    badge: null,
    title: "Diseña y construye tu pista",
    subtitle: "La implementación",
    desc: "Con claridad del problema, diseñamos e implementamos el sistema. HubSpot configurado para tu proceso real. Integraciones sin silos. Procesos que el equipo realmente sigue.",
    tags: [
      { label: "Implementación HubSpot CRM", to: "/implementacion-hubspot" },
      { label: "Marketing Ops", to: "/marketing-ops" },
      { label: "Integraciones Custom", to: "/integraciones-desarrollo" },
    ],
    link: "/diseña-y-construye-tu-pista",
  },
  {
    num: "03",
    icon: Settings,
    badge: null,
    title: "Opera tu pista",
    subtitle: "La operación continua",
    desc: "Una pista bien construida necesita operación constante. Tu consultor asignado y el equipo especialista trabajan sprint a sprint — estrategia y ejecución en paralelo, todos los meses.",
    tags: [
      { label: "RevOps as a Service", to: "/revops-as-a-service" },
      { label: "Soporte HubSpot", to: "/soporte-hubspot" },
    ],
    link: "/opera-tu-pista",
  },
  {
    num: "04",
    icon: Brain,
    iconColor: "#6366F1",
    badge: "LA VENTAJA COMPETITIVA",
    badgeBg: "rgba(99,102,241,0.08)",
    badgeColor: "#6366F1",
    title: "Potencia tu pista con IA",
    subtitle: "La ventaja competitiva",
    desc: "Cuando la pista está ordenada, la IA la convierte en una ventaja real. Agentes que califican leads, automatizaciones con contexto, sistemas que aprenden.",
    tags: [
      { label: "IA para tu Motor de Ingresos", to: "/potencia-con-ia", color: "#6366F1" },
    ],
    link: "/potencia-con-ia",
  },
];

/* ─── Section 4: Role cards data ─── */
const roleCards = [
  {
    icon: Building2,
    iconColor: undefined as string | undefined,
    title: "CEO / Gerente General",
    pain: "Pusiste piezas nuevas en una pista que nunca estuvo bien diseñada. El caos siguió.",
    symptoms: [
      "Crecemos, pero deberíamos crecer más.",
      "No puedo predecir el cierre de mes.",
      "Algo está trabado y no sé qué.",
    ],
    options: [
      { text: "No sé qué está mal →", chip: "Diagnóstico", to: "/conoce-tu-pista" },
      { text: "Sé el problema, necesito quien lo opere →", chip: "RevOps as a Service", to: "/revops-as-a-service" },
      { text: "Quiero escalar lo que funciona →", chip: "IA para tu Motor", to: "/potencia-con-ia", chipColor: "#6366F1" },
    ],
  },
  {
    icon: BarChart3,
    title: "Director o Gerente Comercial",
    pain: "Heredaste un equipo sin procesos, un CRM mal configurado y la presión de demostrar resultados.",
    symptoms: [
      "Cada vendedor me da un forecast distinto.",
      "El CRM es un desastre.",
      "Sé qué está mal pero no tengo cómo probarlo.",
    ],
    options: [
      { text: "Necesito mapear los huecos →", chip: "Diagnóstico", to: "/conoce-tu-pista" },
      { text: "Necesito el CRM funcionando →", chip: "Implementación HubSpot", to: "/implementacion-hubspot" },
      { text: "Necesito mejora continua →", chip: "RevOps as a Service", to: "/revops-as-a-service" },
    ],
  },
  {
    icon: Megaphone,
    iconColor: "#FF7A59",
    title: "Director o Gerente de Marketing",
    pain: "Generas leads. Ventas dice que son malos. Y tú sabes que el problema no es solo tuyo.",
    symptoms: [
      "No puedo demostrar el ROI de marketing.",
      "Armé nurturing que nadie revisa.",
      "Entrego leads y ventas los rechaza.",
    ],
    options: [
      { text: "No sé dónde se rompe el flujo →", chip: "Diagnóstico", to: "/conoce-tu-pista" },
      { text: "Necesito HubSpot igual para los dos equipos →", chip: "Marketing Ops", to: "/marketing-ops", chipColor: "#FF7A59" },
      { text: "Necesito demostrar ROI →", chip: "RevOps as a Service", to: "/revops-as-a-service" },
    ],
  },
  {
    icon: Heart,
    iconColor: "#1CA398",
    title: "Customer Success y Servicio al Cliente",
    pain: "Tu área retiene clientes y evita churn. Pero si ese impacto no está medido, no existe para el negocio.",
    symptoms: [
      "Me entero que un cliente se fue por ventas.",
      "No tenemos alertas de clientes en riesgo.",
      "Sabemos que hay upsell. No cómo detectarlo.",
    ],
    options: [
      { text: "No tengo visibilidad →", chip: "Diagnóstico", to: "/conoce-tu-pista" },
      { text: "Necesito integrar CS al CRM →", chip: "Implementación HubSpot", to: "/implementacion-hubspot" },
      { text: "Necesito anticipar churn mes a mes →", chip: "RevOps as a Service", to: "/revops-as-a-service" },
    ],
  },
  {
    icon: Cog,
    title: "Operaciones / CRM / El que resuelve todo",
    pain: "Sabes exactamente qué está mal. Lo estás haciendo solo, sin respaldo y sin tiempo.",
    symptoms: [
      "Si me voy, HubSpot colapsa.",
      "Diseño procesos que nadie sigue.",
      "No tengo cómo justificar el presupuesto.",
    ],
    options: [
      { text: "Necesito el diagnóstico que justifique el cambio →", chip: "Diagnóstico", to: "/conoce-tu-pista" },
      { text: "Necesito el CRM e integraciones bien hechas →", chip: "Implementación + Integraciones", to: "/implementacion-hubspot" },
      { text: "Necesito un socio que comparta la carga →", chip: "RevOps as a Service", to: "/revops-as-a-service" },
    ],
  },
];

/* ─── Stagger fade variant ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ═══════════════════════════════════════════════ */
export default function QueHacemos() {
  const { openLeadForm } = useLeadForm();
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);
  const sec3InView = useInView(sec3Ref, { once: true, margin: "-80px" });
  const sec4InView = useInView(sec4Ref, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ══════ SECTION 1 — HERO ══════ */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(180deg, #1A1A2E 0%, #0D0D1A 100%)",
          padding: "160px 24px 100px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <EyebrowLight>QUÉ HACEMOS</EyebrowLight>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-white mt-8"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.25rem)", lineHeight: 1.1 }}
          >
            El problema no es tu equipo.
            <br />
            Es la pista donde está corriendo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6"
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 580, lineHeight: 1.6 }}
          >
            Llevamos 14 años ayudando a empresas B2B en LATAM a diseñar, construir y operar su motor de ingresos. Cada rol lo vive diferente — pero el sistema roto es siempre el mismo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/conoce-tu-pista"
              className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: GRADIENT,
                borderRadius: 999,
                padding: "14px 32px",
                boxShadow: "0 8px 30px rgba(190,24,105,0.35)",
              }}
            >
              Descubre dónde está rota tu pista <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => openLeadForm("que-hacemos-hero")}
              className="font-semibold text-white text-base transition-all duration-200 hover:bg-white/10"
              style={{
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 999,
                padding: "14px 32px",
                background: "transparent",
              }}
            >
              Agendar conversación
            </button>
          </motion.div>

          {/* Chips */}
          <motion.div
            className="flex flex-wrap items-center justify-center mt-10"
            style={{ gap: 12 }}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {["14 años en LATAM", "HubSpot Platinum Partner", "Diagnóstico primero, siempre"].map((t, i) => (
              <motion.span
                key={t}
                variants={fadeUp}
                className="text-white"
                style={{
                  fontSize: 13,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ SECTION 2 — PISTA STORY STICKY ══════ */}
      <PistaStorySticky />

      {/* ══════ SECTION 3 — LO QUE HACEMOS ══════ */}
      <section ref={sec3Ref} style={{ background: "#fff", padding: "100px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 960 }}>
          <Eyebrow>NUESTRA METODOLOGÍA</Eyebrow>
          <h2 className="font-bold mt-4" style={{ fontSize: 36, color: "#1A1A2E", lineHeight: 1.2 }}>
            Te acompañamos desde el diagnóstico
            <br className="hidden sm:block" />
            hasta la operación completa.
          </h2>
          <p className="mx-auto mt-4" style={{ color: "#6B7280", maxWidth: 560, fontSize: 16, lineHeight: 1.6 }}>
            Puedes entrar en cualquier punto — dependiendo de dónde está tu operación hoy.
          </p>
        </div>

        <motion.div
          className="mx-auto mt-14 grid gap-6"
          style={{ maxWidth: 960, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          variants={stagger}
          initial="hidden"
          animate={sec3InView ? "show" : "hidden"}
        >
          {methodCards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.num}
                variants={fadeUp}
                className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 20,
                  padding: 36,
                }}
                whileHover={{
                  borderColor: c.iconColor || "#BE1869",
                  boxShadow: "0 12px 40px rgba(190,24,105,0.1)",
                }}
              >
                {/* Decorative number */}
                <span
                  className="absolute top-4 right-5 font-bold select-none pointer-events-none"
                  style={{
                    fontSize: 64,
                    background: GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    opacity: 0.08,
                    lineHeight: 1,
                  }}
                >
                  {c.num}
                </span>

                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width: 40,
                    height: 40,
                    background: c.iconColor ? `${c.iconColor}14` : "rgba(190,24,105,0.08)",
                  }}
                >
                  <Icon size={20} style={{ color: c.iconColor || "#BE1869" }} />
                </div>

                {c.badge && (
                  <span
                    className="inline-block mt-4 font-bold uppercase tracking-wider"
                    style={{
                      fontSize: 11,
                      background: c.badgeBg || "rgba(190,24,105,0.08)",
                      color: c.badgeColor || "#BE1869",
                      borderRadius: 999,
                      padding: "4px 12px",
                    }}
                  >
                    {c.badge}
                  </span>
                )}

                <h3 className="font-bold mt-4" style={{ fontSize: 18, color: "#1A1A2E" }}>
                  <Link to={c.link} className="hover:underline">{c.title}</Link>
                </h3>
                <p className="italic mt-1" style={{ fontSize: 14, color: "#6B7280" }}>{c.subtitle}</p>
                <p className="mt-3" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{c.desc}</p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {c.tags.map((tag) =>
                    (tag as any).external ? (
                      <a
                        key={tag.label}
                        href={tag.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:opacity-80"
                        style={{
                          fontSize: 11,
                          background: tag.color ? `${tag.color}14` : "#F0F0F0",
                          color: tag.color || "#6B7280",
                          borderRadius: 999,
                          padding: "4px 12px",
                        }}
                      >
                        {tag.label}
                      </a>
                    ) : (
                      <Link
                        key={tag.label}
                        to={tag.to}
                        className="transition-colors duration-200 hover:opacity-80"
                        style={{
                          fontSize: 11,
                          background: tag.color ? `${tag.color}14` : "#F0F0F0",
                          color: tag.color || "#6B7280",
                          borderRadius: 999,
                          padding: "4px 12px",
                        }}
                      >
                        {tag.label}
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══════ SECTION 4 — SEGÚN TU ROL ══════ */}
      <section ref={sec4Ref} style={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 960 }}>
          <Eyebrow>SEGÚN TU ROL</Eyebrow>
          <h2 className="font-bold mt-4" style={{ fontSize: 34, color: "#1A1A2E", lineHeight: 1.2 }}>
            El motor de ingresos le importa a todos.
            <br className="hidden sm:block" />
            Pero cada rol lo vive diferente.
          </h2>
          <p className="mx-auto mt-4" style={{ color: "#6B7280", maxWidth: 580, fontSize: 16, lineHeight: 1.6 }}>
            El problema es el mismo — la pista rota. La entrada depende de cómo lo estás viviendo tú.
          </p>
        </div>

        <motion.div
          className="mx-auto mt-14 grid gap-5"
          style={{ maxWidth: 1000, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          variants={stagger}
          initial="hidden"
          animate={sec4InView ? "show" : "hidden"}
        >
          {roleCards.map((r) => {
            const Icon = r.icon;
            const color = r.iconColor || "#BE1869";
            return (
              <motion.div
                key={r.title}
                variants={fadeUp}
                className="transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: "28px 24px",
                }}
                whileHover={{
                  borderColor: color,
                  boxShadow: `0 8px 24px ${color}14`,
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 32, height: 32, background: `${color}14` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>

                <h3 className="font-bold mt-3" style={{ fontSize: 16, color: "#1A1A2E" }}>{r.title}</h3>
                <p className="italic mt-2" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{r.pain}</p>

                {/* Symptoms */}
                <div className="mt-3 space-y-1">
                  {r.symptoms.map((s) => (
                    <p key={s} style={{ fontSize: 12, color: "#9CA3AF" }}>— "{s}"</p>
                  ))}
                </div>

                <div className="my-4" style={{ height: 1, background: "#F0F0F0" }} />

                <p className="uppercase font-bold" style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.06em" }}>
                  Por dónde entrar:
                </p>
                <div className="mt-2 space-y-2">
                  {r.options.map((o) => (
                    <div key={o.text} className="flex items-start gap-2 flex-wrap" style={{ fontSize: 13 }}>
                      <span style={{ color: "#374151" }}>{o.text}</span>
                      <Link
                        to={o.to}
                        className="inline-flex items-center gap-1 font-semibold transition-all duration-200 hover:underline"
                        style={{
                          color: o.chipColor || "#BE1869",
                          background: o.chipColor ? `${o.chipColor}14` : "rgba(190,24,105,0.08)",
                          borderRadius: 999,
                          padding: "2px 10px",
                          fontSize: 12,
                        }}
                      >
                        {o.chip}
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ══════ SECTION 5 — CTA FINAL ══════ */}
      <section style={{ background: "#1A1A2E", padding: "80px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 600 }}>
          <h2 className="font-bold text-white" style={{ fontSize: 30, lineHeight: 1.25 }}>
            El primer paso es entender
            <br />
            dónde está tu pista hoy.
          </h2>
          <p className="mx-auto mt-5" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontSize: 16 }}>
            El Pulso Comercial es una evaluación gratuita de 5 minutos. Sin compromiso, sin pitch. Solo claridad sobre qué está frenando tu motor de ingresos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="https://pulso.revopslatam.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: GRADIENT,
                borderRadius: 999,
                padding: "16px 36px",
                boxShadow: "0 8px 30px rgba(190,24,105,0.35)",
              }}
            >
              Hacer el Pulso Comercial <ArrowRight size={16} />
            </a>
            <button
              onClick={() => openLeadForm("que-hacemos-cta")}
              className="font-semibold text-white text-sm transition-colors duration-200 hover:text-white/80"
              style={{ background: "transparent", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Prefiero hablar directo → Agendar conversación
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
