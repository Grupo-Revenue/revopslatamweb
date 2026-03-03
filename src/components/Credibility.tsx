import { useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Cog, Compass, ArrowRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const scaleIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

interface CertItem {
  name: string;
  image_url: string;
}

interface MetricItem {
  value: string | number;
  desc: string;
  color: string;
}

const painPoints = [
  { icon: TrendingUp, label: "Crecimiento sin estructura" },
  { icon: Cog, label: "Tecnología sin proceso" },
  { icon: Compass, label: "Equipos sin dirección común" },
];

const Credibility = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const eyebrow = section?.subtitle ?? "No implementamos HubSpot. Diseñamos sistemas.";
  const title = section?.title ?? "14 Años Construyendo Revenue";

  // Parse metrics from metadata
  const metrics: MetricItem[] = Array.isArray(meta.metrics)
    ? (meta.metrics as MetricItem[])
    : [
        { value: 14, desc: "años construyendo sistemas de revenue", color: "#BE1869" },
        { value: "HubSpot", desc: "como plataforma central certificada", color: "#1CA398" },
        { value: "LATAM", desc: "foco en el contexto latinoamericano real", color: "#0779D7" },
      ];

  const certs: CertItem[] = Array.isArray(meta.certifications)
    ? meta.certifications.filter((item): item is CertItem => {
        if (!item || typeof item !== "object") return false;
        const cert = item as Record<string, unknown>;
        return typeof cert.name === "string" && typeof cert.image_url === "string";
      })
    : [];

  const colA: CertItem[] = [];
  const colB: CertItem[] = [];
  certs.forEach((c, i) => (i % 2 === 0 ? colA : colB).push(c));
  const speed = Math.max(certs.length * 3, 14);

  // Extract the big number from title or metrics
  const bigNumber = typeof metrics[0]?.value === "number" ? String(metrics[0].value) : "14";

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{
        background: "linear-gradient(165deg, #0D0D1A 0%, #111128 40%, #0D1A2E 100%)",
        ...getBgStyle(),
      }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      {/* Ambient glow effects */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(7,121,215,0.08) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(190,24,105,0.06) 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 w-full">
        {/* ── TOP: Hero statement ── */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pt-20 sm:pt-28 pb-12 sm:pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Eyebrow */}
            <motion.p
              {...fadeUp(0)}
              className="text-[11px] sm:text-[12px] font-semibold tracking-[0.25em] uppercase mb-8"
              style={{ color: "#0779D7" }}
            >
              {eyebrow}
            </motion.p>

            {/* Big typographic hero */}
            <div className="flex items-end gap-6 sm:gap-8 mb-6">
              <motion.span
                {...scaleIn(0.1)}
                className="text-[96px] sm:text-[140px] lg:text-[180px] font-black leading-[0.85] tracking-tighter"
                style={{
                  background: "linear-gradient(135deg, #BE1869 0%, #0779D7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {bigNumber}
              </motion.span>
              <motion.div {...fadeUp(0.2)} className="pb-3 sm:pb-5">
                <h2
                  className="text-[24px] sm:text-[32px] lg:text-[40px] font-bold leading-[1.1] tracking-tight"
                  style={{ color: "#FFFFFF" }}
                >
                  Años
                  <br />
                  Construyendo
                  <br />
                  <span style={{ color: "#0779D7" }}>Revenue</span>
                </h2>
              </motion.div>
            </div>

            {/* Narrative line */}
            <motion.p
              {...fadeUp(0.25)}
              className="text-[17px] sm:text-[19px] leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              No llegamos a RevOps por tendencia. Llegamos porque vimos el mismo
              patrón repetirse empresa tras empresa:
            </motion.p>
          </div>
        </div>

        {/* ── PAIN POINTS: Three striking cards ── */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-16 sm:pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={i}
                  {...fadeUp(0.3 + i * 0.08)}
                  className="group relative rounded-2xl p-6 sm:p-7 overflow-hidden cursor-default transition-all duration-500"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  whileHover={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(7,121,215,0.3)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 100%, rgba(7,121,215,0.08) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(7,121,215,0.1)",
                        border: "1px solid rgba(7,121,215,0.15)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#0779D7" }} />
                    </div>
                    <p
                      className="text-[16px] sm:text-[17px] font-medium leading-snug"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {point.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── PHILOSOPHY + CERTS ── */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-10 sm:pb-16">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Philosophy text */}
            <div className="flex-1 lg:basis-1/2">
              <motion.div {...fadeUp(0.35)} className="space-y-5">
                <p
                  className="text-[17px] sm:text-[18px] leading-[1.7] font-medium"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Por eso nuestra metodología pone el{" "}
                  <span style={{ color: "#BE1869" }}>diagnóstico antes que la implementación.</span>
                </p>
                <div className="space-y-3 pl-1">
                  {[
                    "Primero diseñamos el sistema.",
                    "Después configuramos la herramienta.",
                  ].map((line, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ArrowRight
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#0779D7" }}
                      />
                      <p
                        className="text-[16px] sm:text-[17px]"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
                <p
                  className="text-[15px] sm:text-[16px] pt-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Las certificaciones validan el dominio técnico.
                  <br />
                  La experiencia valida el criterio.
                </p>
              </motion.div>

              {/* Metrics strip */}
              <motion.div
                {...fadeUp(0.45)}
                className="mt-10 flex flex-wrap gap-6 sm:gap-10"
              >
                {metrics.map((m, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span
                      className="text-[28px] sm:text-[32px] font-black tracking-tight"
                      style={{ color: m.color }}
                    >
                      {m.value}
                    </span>
                    <span
                      className="text-[12px] sm:text-[13px] uppercase tracking-wide max-w-[140px] leading-tight"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {m.desc}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Cert marquee */}
            <motion.div
              {...fadeUp(0.4)}
              className="lg:basis-1/2 w-full flex-shrink-0"
            >
              {certs.length === 0 ? (
                <div
                  className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Sube certificaciones desde el admin
                  </p>
                </div>
              ) : (
                <div className="relative h-[400px] overflow-hidden cert-mask-dark">
                  <style>{`
                    .cert-mask-dark {
                      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
                      mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
                    }
                    @keyframes cert-scroll-up-dark {
                      0% { transform: translateY(0); }
                      100% { transform: translateY(-50%); }
                    }
                    @keyframes cert-scroll-down-dark {
                      0% { transform: translateY(-50%); }
                      100% { transform: translateY(0); }
                    }
                    .cert-col-up-dark {
                      animation: cert-scroll-up-dark ${speed}s linear infinite;
                    }
                    .cert-col-down-dark {
                      animation: cert-scroll-down-dark ${speed}s linear infinite;
                    }
                    .cert-col-up-dark:hover, .cert-col-down-dark:hover {
                      animation-play-state: paused;
                    }
                  `}</style>
                  <div className="flex gap-4 h-full">
                    <div className="flex-1 overflow-hidden">
                      <div className="cert-col-up-dark flex flex-col gap-4">
                        {[...colA, ...colA].map((cert, i) => (
                          <CertCard key={`a-${i}`} cert={cert} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="cert-col-down-dark flex flex-col gap-4">
                        {[...colB, ...colB].map((cert, i) => (
                          <CertCard key={`b-${i}`} cert={cert} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

function CertCard({ cert }: { cert: CertItem }) {
  return (
    <div className="flex items-center justify-center px-2 py-2">
      <div
        className="rounded-xl p-3.5 inline-flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <img
          src={cert.image_url}
          alt={cert.name || "Certificación"}
          className="w-full max-w-[184px] h-auto object-contain"
          loading="lazy"
          style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }}
        />
      </div>
    </div>
  );
}

export default Credibility;
