import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const }
});

interface CertItem {
  name: string;
  image_url: string;
}

const defaultCerts: CertItem[] = [];

const Credibility = ({ section }: {section?: HomeSection;}) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const eyebrow = section?.subtitle ?? "CERTIFICACIONES";
  const title = section?.title ?? "Somos expertos";
  const body =
    section?.body ??
    "No llegamos a RevOps por tendencia. Llegamos porque vimos el mismo patrón repetirse empresa tras empresa.";
  const bodyAsList = meta.body_as_list === true;
  const certs: CertItem[] = Array.isArray(meta.certifications)
    ? meta.certifications.filter((item): item is CertItem => {
        if (!item || typeof item !== "object") return false;
        const cert = item as Record<string, unknown>;
        return typeof cert.name === "string" && typeof cert.image_url === "string";
      })
    : defaultCerts;

  // Split certs into two columns
  const colA: CertItem[] = [];
  const colB: CertItem[] = [];
  certs.forEach((c, i) => (i % 2 === 0 ? colA : colB).push(c));

  const speed = Math.max(certs.length * 3, 14);

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{ background: "#F5F5F8", ...getBgStyle() }}>
      
      {hasBg && <div style={bgLayerStyle} />}

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left — Text (2/3) */}
          <div className="flex-1 lg:basis-2/3 lg:sticky lg:top-32 py-10 lg:py-16">
            <motion.p
              {...fadeUp(0)}
              className="text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "#0779D7", ...getStyle("subtitle") }}>
              {eyebrow}
            </motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              className="mt-3 text-[32px] md:text-[44px] font-bold leading-[1.15] tracking-tight"
              style={{ color: "#1A1A2E", ...getStyle("title") }}>
              {title}
            </motion.h2>
            {bodyAsList ? (
              <motion.ul
                {...fadeUp(0.16)}
                className="mt-5 text-[16px] sm:text-[17px] leading-relaxed space-y-2 list-disc list-inside"
                style={{ color: "#6B7280", ...getStyle("body") }}>
                {body.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
              </motion.ul>
            ) : (
              <motion.p
                {...fadeUp(0.16)}
                className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
                style={{ color: "#6B7280", ...getStyle("body") }}>
                {body}
              </motion.p>
            )}
          </div>

          {/* Right — Dual-column marquee (1/3) */}
          <div className="lg:basis-1/3 flex-shrink-0 w-full relative">
            {certs.length === 0 ?
            <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed" style={{ borderColor: "#D1D5DB" }}>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Sube certificaciones desde el admin
                </p>
              </div> :

            <div className="relative h-[540px] overflow-hidden cert-mask">
                <style>{`
                  .cert-mask {
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%);
                    mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%);
                  }
                  @keyframes cert-scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                  }
                  @keyframes cert-scroll-down {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                  }
                  .cert-col-up {
                    animation: cert-scroll-up ${speed}s linear infinite;
                  }
                  .cert-col-down {
                    animation: cert-scroll-down ${speed}s linear infinite;
                  }
                  .cert-col-up:hover, .cert-col-down:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="flex gap-4 h-full">
                  {/* Column A — scrolls UP */}
                  <div className="flex-1 overflow-hidden">
                    <div className="cert-col-up flex flex-col gap-4">
                      {[...colA, ...colA].map((cert, i) =>
                    <CertCard key={`a-${i}`} cert={cert} />
                    )}
                    </div>
                  </div>
                  {/* Column B — scrolls DOWN */}
                  <div className="flex-1 overflow-hidden">
                    <div className="cert-col-down flex flex-col gap-4">
                      {[...colB, ...colB].map((cert, i) =>
                    <CertCard key={`b-${i}`} cert={cert} />
                    )}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>);

};

function CertCard({ cert }: {cert: CertItem;}) {
  return (
    <div className="flex items-center justify-center px-2 py-2">
      <div className="bg-white rounded-xl shadow-md p-3 inline-flex items-center justify-center">
        <img
          src={cert.image_url}
          alt={cert.name || "Certificación"}
          className="w-full max-w-[140px] h-auto object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy" />
      </div>
    </div>);
}

export default Credibility;