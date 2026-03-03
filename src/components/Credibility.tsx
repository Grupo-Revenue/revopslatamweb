import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

interface CertItem {
  name: string;
  image_url: string;
}

const defaultCerts: CertItem[] = [];

const Credibility = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const eyebrow = section?.subtitle ?? "CERTIFICACIONES";
  const title = section?.title ?? "Somos expertos";
  const body =
    section?.body ??
    "Nuestro equipo de consultores especializados, contamos con certificaciones oficiales de HubSpot que validan experiencia y conocimiento.";
  const certs = (meta.certifications as CertItem[]) ?? defaultCerts;

  // Vertical infinite marquee
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    if (certs.length > 0) setAnimReady(true);
  }, [certs.length]);

  // Build 2-column grid rows for the marquee
  const rows: CertItem[][] = [];
  for (let i = 0; i < certs.length; i += 2) {
    rows.push(certs.slice(i, i + 2));
  }

  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: "#F5F5F8", ...getBgStyle() }}
    >
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        {/* Left — Text */}
        <div className="flex-1 lg:max-w-[460px] lg:sticky lg:top-32">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "#0779D7", ...getStyle("subtitle") }}
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="mt-3 text-[32px] md:text-[44px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E", ...getStyle("title") }}
          >
            {title}
          </motion.h2>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
            style={{ color: "#6B7280", ...getStyle("body") }}
          >
            {body}
          </motion.p>
        </div>

        {/* Right — Certification Carousel (vertical marquee) */}
        <div className="flex-1 w-full lg:max-w-[560px] relative">
          {certs.length === 0 ? (
            <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed" style={{ borderColor: "#D1D5DB" }}>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                Sube certificaciones desde el admin
              </p>
            </div>
          ) : (
            <div className="relative h-[420px] overflow-hidden mask-vertical">
              <style>{`
                .mask-vertical {
                  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
                  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
                }
                @keyframes scroll-up {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
                .marquee-vertical {
                  animation: scroll-up ${Math.max(rows.length * 4, 16)}s linear infinite;
                }
                .marquee-vertical:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div
                ref={marqueeRef}
                className={`flex flex-col gap-4 ${animReady ? "marquee-vertical" : ""}`}
              >
                {/* Duplicate for seamless loop */}
                {[...rows, ...rows].map((row, ri) => (
                  <div key={ri} className="grid grid-cols-2 gap-4">
                    {row.map((cert, ci) => (
                      <div
                        key={`${ri}-${ci}`}
                        className="group rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-shadow duration-300 hover:shadow-lg"
                        style={{
                          background: "white",
                          border: "1px solid #E5E7EB",
                          minHeight: "140px",
                        }}
                      >
                        <img
                          src={cert.image_url}
                          alt={cert.name}
                          className="max-h-[80px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {cert.name && (
                          <span
                            className="mt-2.5 text-[11px] sm:text-xs font-medium leading-tight"
                            style={{ color: "#6B7280" }}
                          >
                            {cert.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Credibility;
