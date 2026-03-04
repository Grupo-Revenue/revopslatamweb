import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─── animation helper ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

/* ─── SVG Track ─── */
const TrackSVG = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    const timeout = setTimeout(() => {
      path.style.transition = "stroke-dashoffset 2s ease-out";
      path.style.strokeDashoffset = "0";
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <svg viewBox="0 0 800 120" className="w-full max-w-[600px] mx-auto" style={{ opacity: 0.15 }}>
      <defs>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BE1869" />
          <stop offset="100%" stopColor="#6224BE" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M 20 60 C 120 20, 200 100, 300 60 S 480 10, 550 60 S 700 110, 780 60"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ─── Stat Card for Section 2 ─── */
const StatCard = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
  <motion.div
    {...fadeUp(delay)}
    className="rounded-2xl p-5 sm:p-6 flex items-center gap-4"
    style={{
      background: "#ffffff",
      border: "1px solid #E5E7EB",
      boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
    }}
  >
    <span className="text-2xl flex-shrink-0">{icon}</span>
    <span className="text-[15px] sm:text-base font-medium" style={{ color: "#1A1A2E" }}>
      {text}
    </span>
  </motion.div>
);

/* ─── Pricing Card ─── */
type PricingCardProps = {
  badge: string;
  badgeHighlight?: boolean;
  title: string;
  tagline: string;
  description: string;
  price: string;
  duration: string;
  href: string;
  highlighted?: boolean;
  delay: number;
};

const PricingCard = ({
  badge, badgeHighlight, title, tagline, description,
  price, duration, href, highlighted, delay,
}: PricingCardProps) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-[20px] p-[2px] transition-all duration-300 group"
    style={{
      background: highlighted
        ? "linear-gradient(135deg, #BE1869, #6224BE)"
        : "transparent",
    }}
  >
    <div
      className="rounded-[18px] p-8 sm:p-9 flex flex-col h-full transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
      style={{
        background: "#ffffff",
        border: highlighted ? "none" : "1px solid #E5E7EB",
      }}
      onMouseEnter={(e) => {
        if (!highlighted) e.currentTarget.style.borderColor = "#BE1869";
      }}
      onMouseLeave={(e) => {
        if (!highlighted) e.currentTarget.style.borderColor = "#E5E7EB";
      }}
    >
      {/* Badge */}
      <span
        className="inline-block self-start text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-5"
        style={
          badgeHighlight
            ? { background: "linear-gradient(90deg, #BE1869, #6224BE)", color: "#fff" }
            : { background: "#F3F4F6", color: "#6B7280" }
        }
      >
        {badge}
      </span>

      {/* Title */}
      <h3 className="text-[22px] font-bold leading-tight tracking-tight" style={{ color: "#1A1A2E" }}>
        {title}
      </h3>

      {/* Tagline */}
      <p
        className="mt-1 text-[14px] font-semibold"
        style={{
          background: "linear-gradient(90deg, #BE1869, #6224BE)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {tagline}
      </p>

      {/* Description */}
      <p className="mt-4 text-[15px] leading-[1.7] flex-1" style={{ color: "#6B7280" }}>
        {description}
      </p>

      {/* Separator */}
      <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />

      {/* Price */}
      <p className="text-[24px] font-bold" style={{ color: "#1A1A2E" }}>{price}</p>
      <p className="text-[14px] mt-0.5" style={{ color: "#6B7280" }}>{duration}</p>

      {/* CTA */}
      <Link
        to={href}
        className="mt-6 inline-flex items-center justify-center text-[15px] font-semibold transition-all duration-200 hover:scale-[1.02]"
        style={
          highlighted
            ? {
                background: "linear-gradient(90deg, #BE1869, #6224BE)",
                color: "#fff",
                borderRadius: 9999,
                padding: "12px 28px",
              }
            : {
                background: "transparent",
                color: "#BE1869",
                borderRadius: 9999,
                padding: "12px 28px",
                border: "2px solid #BE1869",
              }
        }
      >
        Ver diagnóstico →
      </Link>
    </div>
  </motion.div>
);

/* ─── Stat number ─── */
const BigStat = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="text-center">
    <p
      className="text-[36px] sm:text-[48px] font-extrabold tracking-tight"
      style={{
        background: "linear-gradient(90deg, #BE1869, #6224BE)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </p>
    <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
      {label}
    </p>
  </motion.div>
);

/* ═══════════════ PAGE ═══════════════ */
const ConoceTuPista = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── SECTION 1: HERO ─── */}
      <section
        className="relative overflow-hidden pt-36 sm:pt-44 pb-20 sm:pb-28 px-6"
        style={{ background: "#1A1A2E" }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] mb-6"
            style={{
              background: "linear-gradient(90deg, #BE1869, #6224BE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Conoce tu pista
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="font-extrabold leading-[1.08] tracking-tight"
            style={{
              color: "#ffffff",
              fontSize: "clamp(40px, 6vw, 64px)",
            }}
          >
            Antes de correr, necesitas conocer tu pista
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-[17px] sm:text-[18px] leading-[1.7] mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 560 }}
          >
            En RevOps LATAM no asumimos dónde están tus problemas.
            Los encontramos — con metodología, con datos y con 14 años
            de experiencia en el mercado chileno.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-10">
            <Link
              to="#diagnosticos"
              className="inline-flex items-center text-[15px] sm:text-base font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
              style={{
                background: "linear-gradient(90deg, #BE1869, #6224BE)",
                borderRadius: 9999,
                padding: "14px 32px",
              }}
            >
              Quiero conocer mi pista →
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="mt-14">
            <TrackSVG />
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 2: EL PROBLEMA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left */}
          <div className="flex-1 max-w-[520px]">
            <motion.h2
              {...fadeUp(0)}
              className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
              style={{ color: "#1A1A2E" }}
            >
              ¿Sientes que tu operación comercial debería rendir más?
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="mt-6 text-[16px] leading-[1.7]" style={{ color: "#6B7280" }}>
              La mayoría de las empresas en crecimiento llegan a un punto
              donde tienen equipo, herramientas y actividad — pero los
              números no responden igual. El pipeline no es predecible.
              Las áreas no hablan el mismo idioma. Nadie tiene un número
              en el que confiar.
            </motion.p>
            <motion.p {...fadeUp(0.15)} className="mt-4 text-[16px] leading-[1.7] font-bold" style={{ color: "#1A1A2E" }}>
              El problema casi nunca es la gente.
              Casi siempre es el sistema.
            </motion.p>
          </div>

          {/* Right: stat cards */}
          <div className="flex-1 w-full max-w-[440px] flex flex-col gap-4">
            <StatCard icon="⚠️" text="Pipeline impredecible" delay={0.1} />
            <StatCard icon="📊" text="Datos inconsistentes entre áreas" delay={0.2} />
            <StatCard icon="🔄" text="Inversión sin retorno claro" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: ELIGE TU DIAGNÓSTICO ─── */}
      <section id="diagnosticos" className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[1100px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            Tres diagnósticos. Uno es el tuyo.
          </motion.h2>
          <motion.p
            {...fadeUp(0.08)}
            className="mt-4 text-center text-[16px] sm:text-[17px] leading-[1.6] max-w-[560px] mx-auto"
            style={{ color: "#6B7280" }}
          >
            El nivel correcto depende de tu tamaño y complejidad.
            Aquí te ayudamos a elegir.
          </motion.p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <PricingCard
              badge="STARTER"
              title="RevOps Checkup"
              tagline="Claridad en 2 semanas"
              description="Para equipos pequeños que necesitan claridad rápida. Sabrás exactamente qué está frenando tu crecimiento y qué hacer al respecto."
              price="Desde 80 UF"
              duration="2 semanas"
              href="/revops-checkup"
              delay={0.1}
            />
            <PricingCard
              badge="GROWTH"
              badgeHighlight
              highlighted
              title="Diagnóstico RevOps"
              tagline="Visión completa en 3 semanas"
              description="Para empresas en crecimiento que necesitan un diagnóstico profundo de su operación comercial, tecnología y procesos. El más elegido."
              price="Desde 150 UF"
              duration="3 semanas"
              href="/diagnostico-revops"
              delay={0.2}
            />
            <PricingCard
              badge="ENTERPRISE"
              title="Diagnóstico Motor de Ingresos"
              tagline="Transformación en 5 semanas"
              description="Para operaciones complejas con múltiples equipos, herramientas y fuentes de datos. Análisis integral del motor de ingresos completo."
              price="Desde 250 UF"
              duration="5 semanas"
              href="/motor-de-ingresos"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: POR QUÉ DIAGNOSTICAR PRIMERO ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[680px] mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#ffffff" }}
          >
            El diagnóstico no es un gasto.
            <br />
            Es el inicio de una relación.
          </motion.h2>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-6 text-[16px] sm:text-[17px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            El 70% de nuestros clientes que pasan por un diagnóstico
            continúan con un proyecto de implementación o un retainer.
            No porque los convenzamos — sino porque el diagnóstico revela
            oportunidades concretas que no querían dejar pasar.
          </motion.p>
          <motion.p
            {...fadeUp(0.15)}
            className="mt-4 text-[16px] sm:text-[17px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Un buen diagnóstico no te dice que tienes problemas.
            Te dice cuánto te están costando — y qué pasa si los resuelves.
          </motion.p>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-12">
            <BigStat value="14 años" label="de experiencia" delay={0.15} />
            <BigStat value="Platinum" label="HubSpot Partners" delay={0.25} />
            <BigStat value="Cientos" label="de equipos alineados" delay={0.35} />
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: CTA FINAL ─── */}
      <section className="py-16 sm:py-20 px-6 text-center" style={{ background: "#ffffff" }}>
        <div className="max-w-[560px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E" }}
          >
            ¿No sabes cuál diagnóstico necesitas?
          </motion.h2>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-4 text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: "#6B7280" }}
          >
            En 15 minutos de conversación te ayudamos
            a identificar el nivel correcto — sin compromiso.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8">
            <Link
              to="#"
              className="inline-flex items-center text-[15px] sm:text-base font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
              style={{
                background: "linear-gradient(90deg, #BE1869, #6224BE)",
                borderRadius: 9999,
                padding: "14px 32px",
              }}
            >
              Agendar conversación gratuita →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConoceTuPista;
