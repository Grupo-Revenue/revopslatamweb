import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Megaphone, BarChart3, Heart, Settings, Globe, Check, X, ChevronDown } from "lucide-react";
import { useLeadForm } from "@/hooks/useLeadForm";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hubspotLogo from "@/assets/logos/hubspot.svg";

/* ─── Reusable fade-in wrapper ─── */
const FadeIn = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up: [20, 0], down: [-20, 0], left: [40, 0], right: [-40, 0] };
  const axis = direction === "left" || direction === "right" ? "x" : "y";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, [axis]: dirs[direction][0] }}
      animate={inView ? { opacity: 1, [axis]: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Hero Stats Counter ─── */
const StatCounter = ({ value, suffix = "", label }: { value?: number; suffix?: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const display = value ? useAnimatedCounter(value, 1500, inView, suffix) : suffix;

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-[32px] font-bold"
        style={{ backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {display}
      </div>
      <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
    </div>
  );
};

/* ─── Comparison Table ─── */
const comparisonRows = [
  { label: "Foco", agency: "Implementar la herramienta", revops: "Operar el motor de ingresos" },
  { label: "Punto de partida", agency: "El software", revops: "Tu proceso comercial" },
  { label: "Entrega", agency: "Portal configurado", revops: "Sistema funcionando" },
  { label: "Después de implementar", agency: "Se van", revops: "Operamos contigo" },
  { label: "Éxito medido en", agency: "HubSpot bien configurado", revops: "Revenue predecible" },
  { label: "Estrategia incluida", agency: "No siempre", revops: "Siempre primero" },
];

/* ─── Hub Cards Data ─── */
const hubCards = [
  {
    badge: "GENERA LA DEMANDA",
    badgeBg: "rgba(190,24,105,0.08)",
    badgeColor: "#BE1869",
    icon: Megaphone,
    iconColor: "url(#grad)",
    useGradient: true,
    title: "Marketing Hub",
    desc: "Formularios, emails, nurturing, lead scoring, landing pages y atribución. Para que marketing demuestre su impacto real en el pipeline — no solo en clics e impresiones.",
    tag: "Ideal para equipos de marketing",
  },
  {
    badge: "CONVIERTE LEADS",
    badgeBg: "rgba(7,121,215,0.08)",
    badgeColor: "#0779D7",
    icon: BarChart3,
    iconColor: "#0779D7",
    useGradient: false,
    title: "Sales Hub",
    desc: "Pipeline con etapas claras, automatizaciones de seguimiento, secuencias, playbooks y forecast confiable. Para que el Director Comercial lidere con datos — no con intuición.",
    tag: "Ideal para equipos comerciales",
  },
  {
    badge: "RETIENE Y EXPANDE",
    badgeBg: "rgba(28,163,152,0.08)",
    badgeColor: "#1CA398",
    icon: Heart,
    iconColor: "#1CA398",
    useGradient: false,
    title: "Service Hub",
    desc: "Tickets, NPS, CSAT y alertas de churn. Para conectar la postventa al motor de ingresos completo — y que CS deje de ser invisible en la estrategia comercial.",
    tag: "Ideal para equipos de Customer Success",
  },
  {
    badge: "CONECTA TODO",
    badgeBg: "rgba(98,36,190,0.08)",
    badgeColor: "#6224BE",
    icon: Settings,
    iconColor: "#6224BE",
    useGradient: false,
    title: "Operations Hub",
    desc: "Sincronización de datos, limpieza automática y workflows operativos avanzados. La pieza que hace que el resto del ecosistema funcione bien — cuando los datos están limpios, todas las decisiones mejoran.",
    tag: "Ideal para empresas con stack complejo",
  },
  {
    badge: "CIERRA EL CICLO",
    badgeBg: "rgba(190,24,105,0.06)",
    badgeColor: "#BE1869",
    icon: Globe,
    iconColor: "url(#grad)",
    useGradient: true,
    title: "Content Hub",
    desc: "Sitio web, blog, landing pages y SEO integrado en HubSpot. Para que cada visita, formulario y descarga quede registrada automáticamente en el perfil del contacto.",
    tag: "Ideal para presencia digital integrada al CRM",
  },
];

/* ─── Timeline Steps ─── */
const steps = [
  {
    num: "01",
    title: "Diagnóstico primero",
    desc: "Mapeamos tu operación comercial real antes de configurar cualquier cosa. Sin este paso, HubSpot queda configurado para una empresa ideal que no existe.",
    chip: "Siempre el primer paso",
  },
  {
    num: "02",
    title: "Diseño antes de construir",
    desc: "Arquitectura completa documentada y validada con el equipo antes de tocar el portal. Qué propiedades, qué pipeline, qué automatizaciones, qué reportes.",
    chip: "Cero sorpresas",
  },
  {
    num: "03",
    title: "Implementación con el equipo",
    desc: "Construimos junto al equipo que va a usar el sistema — no para ellos. La adopción no es un problema de capacitación: es un problema de participación en el diseño.",
    chip: "Adopción garantizada",
  },
  {
    num: "04",
    title: "Activación y acompañamiento",
    desc: "No entregamos el portal y desaparecemos. Acompañamos la activación, medimos el uso real y hacemos los ajustes necesarios. El sistema queda funcionando — no solo configurado.",
    chip: "Siempre incluido",
  },
];

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: "¿Qué es un HubSpot Partner?",
    a: "Un HubSpot Partner es una empresa certificada por HubSpot para implementar, configurar y operar sus productos. Los partners están organizados en niveles según su experiencia y volumen de clientes: Starter, Gold, Platinum, Diamond y Elite. RevOps LATAM es HubSpot Platinum Partner en Chile — uno de los niveles más altos del ecosistema de partners en la región.",
  },
  {
    q: "¿Cuál es la diferencia entre un partner Platinum y uno Gold?",
    a: "El nivel Platinum refleja mayor experiencia acumulada, mayor volumen de implementaciones exitosas y certificaciones más avanzadas del equipo. En el directorio global de HubSpot hay miles de partners — los niveles más altos representan una fracción pequeña. En Chile y LATAM, los partners Platinum son especialmente escasos.",
  },
  {
    q: "¿Cómo elegir un partner de HubSpot en Chile?",
    a: "Más allá del nivel de partnership, hay tres preguntas que importan: ¿El partner entiende tu tipo de negocio y proceso comercial? ¿Tiene experiencia operando HubSpot después de la implementación — o solo configura y se va? ¿Puede mostrarte implementaciones reales en empresas similares a la tuya? El nivel Platinum es una señal de experiencia, pero no reemplaza el fit estratégico.",
  },
  {
    q: "¿Cuánto cuesta implementar HubSpot con un partner en Chile?",
    a: "El costo depende de la complejidad del proyecto: los módulos a implementar, el tamaño del equipo, las integraciones requeridas y el nivel de personalización. En RevOps LATAM trabajamos con una calculadora de precios que entrega un rango según las características de cada proyecto. El punto de partida siempre es el diagnóstico — para no cotizar una implementación sin entender qué necesita realmente la empresa.",
  },
  {
    q: "¿Puedo contratar HubSpot directamente sin un partner?",
    a: "Sí. HubSpot se puede contratar directamente en hubspot.com. Un partner agrega valor en la implementación, la configuración estratégica, la integración con otras herramientas y la operación continua. Si solo necesitas la licencia, no necesitas un partner. Si quieres que HubSpot funcione de verdad en tu operación, un partner con experiencia hace la diferencia entre una inversión que rinde y una que se desperdicia.",
  },
  {
    q: "¿RevOps LATAM solo trabaja con HubSpot?",
    a: "Sí. HubSpot es el ecosistema central de todo lo que hacemos. No somos technology-agnostic — somos especialistas. Esa especialización profunda es lo que nos permite implementar y operar HubSpot con el nivel de detalle que los resultados requieren. Podemos integrarlo con prácticamente cualquier herramienta del stack del cliente, pero el motor siempre es HubSpot.",
  },
  {
    q: "¿Son partner de HubSpot en México, Colombia, Perú o Argentina?",
    a: "Sí. Somos HubSpot Platinum Partner con operación en toda LATAM. Nuestro equipo trabaja con empresas en México, Colombia, Perú y Argentina con la misma metodología que aplicamos en Chile. El horario, el idioma, la cultura comercial y la realidad del mercado latinoamericano son el contexto en el que operamos todos los días.",
  },
  {
    q: "¿Qué diferencia a RevOps LATAM de otras consultoras HubSpot?",
    a: "Tres cosas concretas: primero, siempre empezamos con diagnóstico — nunca proponemos soluciones antes de entender el problema. Segundo, no entregamos y desaparecemos — ofrecemos operación continua post-implementación. Tercero, no somos una agencia que configura HubSpot: somos una consultora de Revenue Operations que usa HubSpot como motor central para construir operaciones comerciales que escalan.",
  },
];

/* ═══════════════════════════════════════ */
/* ─── PAGE COMPONENT ─── */
/* ═══════════════════════════════════════ */
const HubspotPartnerChile = () => {
  const { openLeadForm } = useLeadForm();
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = "Partner HubSpot Chile y LATAM | RevOps LATAM — Consultora Platinum";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "RevOps LATAM es HubSpot Platinum Partner en Chile y LATAM. No somos una agencia. Somos la consultora que implementa HubSpot y opera tu motor de ingresos completo. 14 años de experiencia en la región.");
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "RevOps LATAM es HubSpot Platinum Partner en Chile y LATAM. No somos una agencia. Somos la consultora que implementa HubSpot y opera tu motor de ingresos completo. 14 años de experiencia en la región.";
      document.head.appendChild(m);
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      {/* ══════════ SECTION 1 — HERO ══════════ */}
      <section
        className="relative flex items-center justify-center px-6"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(180deg, #1A1A2E 0%, #0D0D1A 100%)",
          paddingTop: 120,
          paddingBottom: 80,
        }}
      >
        <div className="text-center" style={{ maxWidth: 760 }}>
          {/* Platinum Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center mx-auto mb-8"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "16px 32px",
              gap: 12,
            }}
          >
            {/* HubSpot icon circle */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF7A59, #FF5733)",
              }}
            >
              <span className="text-white font-bold" style={{ fontSize: 12, lineHeight: 1 }}>H</span>
            </div>
            <span className="text-white font-bold" style={{ fontSize: 14 }}>HubSpot</span>
            <span className="font-bold" style={{ fontSize: 14, color: "#FF7A59" }}>Platinum Partner</span>
            <span
              className="uppercase font-bold"
              style={{
                fontSize: 10,
                color: "#FF7A59",
                background: "rgba(255,122,89,0.15)",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              CERTIFICADO
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white font-bold leading-[1.15] mb-6"
            style={{ fontSize: "clamp(40px, 5vw, 66px)" }}
          >
            Somos HubSpot Platinum Partner
            <br />en Chile y LATAM.
            <br />Pero no somos una agencia.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-10"
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 600 }}
          >
            Llevamos 14 años implementando y operando HubSpot en empresas B2B de Chile, México, Colombia, Perú y Argentina. No configuramos la herramienta y nos vamos — construimos el motor de ingresos completo.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-14"
          >
            <button
              onClick={() => openLeadForm("hubspot-partner-chile")}
              className="text-white font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #BE1869, #6224BE)",
                borderRadius: 999,
                padding: "14px 32px",
                fontSize: 16,
              }}
            >
              Agenda una conversación →
            </button>
            <button
              onClick={() => scrollToSection("como-trabajamos")}
              className="font-semibold transition-all duration-300 hover:scale-[1.03]"
              style={{
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 999,
                padding: "14px 32px",
                fontSize: 16,
                background: "transparent",
              }}
            >
              Ver cómo trabajamos ↓
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 48 }}
          >
            <StatCounter suffix="Platinum" label="Nivel de partnership HubSpot" />
            <StatCounter value={14} suffix=" años" label="Operando en Chile y LATAM" />
            <StatCounter suffix="5 Hubs" label="Implementamos todo el ecosistema" />
          </motion.div>
        </div>
      </section>

      {/* ══════════ SECTION 2 — POSICIONAMIENTO ══════════ */}
      <section className="px-6" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start" style={{ maxWidth: 1100 }}>
          {/* Left text */}
          <FadeIn>
            <div style={{ maxWidth: 480 }}>
              <h2 className="font-bold mb-8" style={{ fontSize: 34, color: "#1A1A2E", lineHeight: 1.25 }}>
                Ser partner de HubSpot no nos hace buenos.
                <br />Saber operar el negocio detrás
                <br />de la herramienta, sí.
              </h2>

              <p className="mb-5" style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
                Hay cientos de partners de HubSpot en el mundo. La diferencia no está en el badge — está en el enfoque.
              </p>
              <p className="mb-6" style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
                La mayoría llega, configura HubSpot según las mejores prácticas del manual, entrega el portal y desaparece. El equipo lo adopta parcialmente, los procesos se deterioran en 90 días y seis meses después nadie sabe si HubSpot está sirviendo para algo.
              </p>

              {/* Callout */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(190,24,105,0.04), rgba(98,36,190,0.04))",
                  borderLeft: "3px solid",
                  borderImage: "linear-gradient(180deg, #BE1869, #6224BE) 1",
                  borderRadius: "0 12px 12px 0",
                  padding: "20px 24px",
                }}
              >
                <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.7, fontWeight: 500 }}>
                  Nosotros hacemos lo contrario. Antes de abrir HubSpot, entendemos tu proceso comercial real. El resultado: un HubSpot que tu equipo usa, que produce datos confiables y que se convierte en la pista por donde fluye tu revenue.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right — Comparison Table */}
          <FadeIn direction="right" delay={0.2}>
            <div
              style={{
                background: "#F9FAFB",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #E5E7EB",
                boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_1fr] mb-4" style={{ gap: 8 }}>
                <div />
                <div className="text-center" style={{ fontSize: 13, color: "#9CA3AF" }}>Agencia HubSpot</div>
                <div
                  className="text-center font-bold"
                  style={{
                    fontSize: 13,
                    backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    borderTop: "2px solid",
                    borderImage: "linear-gradient(135deg, #BE1869, #6224BE) 1",
                    background: "linear-gradient(135deg, rgba(190,24,105,0.04), rgba(98,36,190,0.04))",
                    padding: "8px 4px 4px",
                    borderRadius: "8px 8px 0 0",
                  }}
                >
                  <span style={{ backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    RevOps LATAM
                  </span>
                </div>
              </div>

              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr] items-center"
                  style={{
                    gap: 8,
                    padding: "12px 0",
                    borderBottom: i < comparisonRows.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{row.label}</span>
                  <span className="text-center" style={{ fontSize: 14, color: "#9CA3AF" }}>{row.agency}</span>
                  <div className="text-center flex items-center justify-center gap-1">
                    <Check size={14} style={{ color: "#BE1869", flexShrink: 0 }} />
                    <span
                      className="font-bold"
                      style={{
                        fontSize: 14,
                        backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {row.revops}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ SECTION 3 — ECOSISTEMA HUBSPOT ══════════ */}
      <section className="px-6" style={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 1100 }}>
          <FadeIn>
            <span
              className="uppercase font-bold tracking-widest mb-4 inline-block"
              style={{
                fontSize: 11,
                backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LO QUE IMPLEMENTAMOS
            </span>
            <h2 className="font-bold mb-5 mx-auto" style={{ fontSize: 34, color: "#1A1A2E", maxWidth: 640, lineHeight: 1.25 }}>
              Implementamos todo el ecosistema HubSpot.
              <br />Siempre desde la lógica del motor de ingresos.
            </h2>
            <p className="mx-auto mb-14" style={{ fontSize: 16, color: "#6B7280", maxWidth: 560, lineHeight: 1.7 }}>
              Cada Hub de HubSpot es una pieza de la pista. La diferencia entre una implementación que funciona y una que no es si las piezas están conectadas entre sí — y con el proceso real del negocio.
            </p>
          </FadeIn>

          {/* SVG gradient defs for icons */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BE1869" />
                <stop offset="100%" stopColor="#6224BE" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeIn key={card.title} delay={i * 0.1}>
                  <div
                    className="text-left h-full transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 20,
                      padding: 36,
                      border: "1px solid #E5E7EB",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#BE1869";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(190,24,105,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E5E7EB";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Badge */}
                    <span
                      className="inline-block uppercase font-bold tracking-wider mb-4"
                      style={{
                        fontSize: 11,
                        color: card.badgeColor,
                        background: card.badgeBg,
                        borderRadius: 999,
                        padding: "4px 12px",
                      }}
                    >
                      {card.badge}
                    </span>

                    {/* Icon */}
                    <div className="mb-4">
                      {card.useGradient ? (
                        <Icon size={40} stroke="url(#grad)" />
                      ) : (
                        <Icon size={40} style={{ color: card.iconColor as string }} />
                      )}
                    </div>

                    <h3 className="font-bold mb-3" style={{ fontSize: 17, color: "#1A1A2E" }}>{card.title}</h3>
                    <p className="mb-5" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{card.desc}</p>

                    {/* Tag chip */}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 12,
                        color: "#6B7280",
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: 999,
                        padding: "4px 14px",
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 4 — CÓMO TRABAJAMOS ══════════ */}
      <section id="como-trabajamos" className="px-6" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 900 }}>
          <FadeIn>
            <h2 className="font-bold mb-3" style={{ fontSize: 32, color: "#1A1A2E" }}>Nuestra forma de implementar</h2>
            <p className="italic mb-14" style={{ fontSize: 16, color: "#6B7280" }}>
              No empezamos con HubSpot. Empezamos con tu proceso.
            </p>
          </FadeIn>

          {/* Timeline — horizontal desktop, vertical mobile */}
          <div className="relative">
            {/* Desktop horizontal line */}
            <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[3px]" style={{ background: "linear-gradient(90deg, #BE1869, #6224BE)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, i) => (
                <FadeIn key={step.num} delay={i * 0.15}>
                  <div className="relative flex flex-col items-center text-center">
                    {/* Mobile vertical line */}
                    {i < steps.length - 1 && (
                      <div className="lg:hidden absolute top-[56px] left-1/2 -translate-x-1/2 w-[3px] h-[calc(100%+32px)]" style={{ background: "linear-gradient(180deg, #BE1869, #6224BE)" }} />
                    )}

                    {/* Circle number */}
                    <div
                      className="relative z-10 flex items-center justify-center text-white font-bold mb-5"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #BE1869, #6224BE)",
                        fontSize: 18,
                      }}
                    >
                      {step.num}
                    </div>

                    <h3 className="font-bold mb-3" style={{ fontSize: 16, color: "#1A1A2E" }}>{step.title}</h3>
                    <p className="mb-4" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{step.desc}</p>

                    {/* Chip */}
                    <span
                      className="inline-block font-semibold"
                      style={{
                        fontSize: 12,
                        background: "linear-gradient(135deg, rgba(190,24,105,0.08), rgba(98,36,190,0.08))",
                        backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        padding: "4px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(190,24,105,0.15)",
                      }}
                    >
                      {step.chip}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 5 — PARA QUIÉN ══════════ */}
      <section className="px-6" style={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <FadeIn>
            <h2 className="font-bold text-center mb-10" style={{ fontSize: 30, color: "#1A1A2E", lineHeight: 1.3 }}>
              No somos el partner correcto para todos.
              <br />Y eso está bien.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Green card */}
            <FadeIn delay={0.1}>
              <div
                style={{
                  background: "rgba(22,163,74,0.04)",
                  border: "1px solid rgba(22,163,74,0.15)",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "rgba(22,163,74,0.15)" }}>
                    <Check size={14} style={{ color: "#16A34A" }} />
                  </div>
                  <span className="font-bold" style={{ fontSize: 14, color: "#16A34A" }}>Somos el partner correcto si:</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Tienes entre 10 y 200 empleados y equipo comercial activo",
                    "Quieres que HubSpot sea el centro de tu operación — no una herramienta más",
                    "Buscas un partner que entienda el negocio, no solo la plataforma",
                    "Quieres que alguien opere contigo después de la implementación",
                    "Estás en Chile, México, Colombia, Perú, Argentina o cualquier país de LATAM",
                    "Quieres resultados medibles, no promesas",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: "#374151" }}>
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: "#16A34A" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Red card */}
            <FadeIn delay={0.2}>
              <div
                style={{
                  background: "rgba(220,38,38,0.04)",
                  border: "1px solid rgba(220,38,38,0.12)",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "rgba(220,38,38,0.12)" }}>
                    <X size={14} style={{ color: "#DC2626" }} />
                  </div>
                  <span className="font-bold" style={{ fontSize: 14, color: "#DC2626" }}>No somos el partner correcto si:</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Solo necesitas configuración técnica sin estrategia",
                    "Buscas el partner más barato del directorio",
                    "No tienes equipo comercial activo ni proceso definido",
                    "Quieres resultados en 2 semanas sin involucrarte",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: "#374151" }}>
                      <X size={16} className="shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 6 — FAQ ══════════ */}
      <section className="px-6" style={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <FadeIn>
            <div className="text-center mb-12">
              <span
                className="uppercase font-bold tracking-widest mb-4 inline-block"
                style={{
                  fontSize: 11,
                  backgroundImage: "linear-gradient(135deg, #BE1869, #6224BE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="font-bold" style={{ fontSize: 30, color: "#1A1A2E", lineHeight: 1.3 }}>
                Lo que más nos preguntan sobre
                <br />ser partner HubSpot en Chile y LATAM
              </h2>
            </div>
          </FadeIn>

          <div>
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                      style={{ padding: "20px 0" }}
                    >
                      <span className="font-bold pr-4" style={{ fontSize: 16, color: "#1A1A2E" }}>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className="shrink-0 transition-transform duration-300"
                        style={{
                          color: "#9CA3AF",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, paddingBottom: 20 }}>{faq.a}</p>
                    </motion.div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 7 — CTA FINAL ══════════ */}
      <section className="px-6" style={{ background: "#1A1A2E", padding: "80px 24px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 620 }}>
          <FadeIn>
            <span
              className="inline-block uppercase font-bold tracking-wider mb-6"
              style={{
                fontSize: 11,
                color: "#FF7A59",
                background: "rgba(255,122,89,0.15)",
                borderRadius: 999,
                padding: "6px 16px",
              }}
            >
              HABLEMOS
            </span>
            <h2 className="text-white font-bold mb-5" style={{ fontSize: 30, lineHeight: 1.3 }}>
              ¿Buscas un partner de HubSpot
              <br />que entienda tu negocio
              <br />— no solo la herramienta?
            </h2>
            <p className="mb-10" style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              El primer paso es una conversación. En 30 minutos entendemos tu situación, te decimos con honestidad si somos el equipo correcto para ti y qué tendría más impacto en tu operación.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => openLeadForm("hubspot-partner-chile-cta")}
                className="text-white font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #BE1869, #6224BE)",
                  borderRadius: 999,
                  padding: "16px 36px",
                  fontSize: 16,
                }}
              >
                Agenda una conversación →
              </button>
              <a
                href="https://pulso.revopslatam.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  borderRadius: 999,
                  padding: "16px 36px",
                  fontSize: 16,
                  background: "transparent",
                }}
              >
                Ver el Pulso Comercial gratuito →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <Footer />
    </div>
  );
};

export default HubspotPartnerChile;
