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

  // Split certs into three columns
  const colA: CertItem[] = [];
  const colB: CertItem[] = [];
  const colC: CertItem[] = [];
  certs.forEach((c, i) => [colA, colB, colC][i % 3].push(c));

  const speed = Math.max(certs.length * 3, 14);

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{ background: "#F5F5F8", ...getBgStyle() }}>
      
      {hasBg && <div style={bgLayerStyle} />}

      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left — Text (50%) aligned to main container */}
          <div className="lg:w-1/2 lg:sticky lg:top-32 py-10 lg:py-16 px-6 sm:px-10 lg:pr-12 lg:pl-[calc((100vw-1100px)/2)] xl:pl-[calc((100vw-1100px)/2)]">
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
              <motion.div
                {...fadeUp(0.16)}
                className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
                style={{ color: "#6B7280", ...getStyle("body") }}>
                {(() => {
                  const lines = body.split("\n").filter(Boolean);
                  const elements: React.ReactNode[] = [];
                  let bulletBuffer: string[] = [];
                  let plainBuffer: string[] = [];

                  const flushBullets = () => {
                    if (bulletBuffer.length > 0) {
                      elements.push(
                        <ul key={`ul-${elements.length}`} className="my-2 space-y-1 list-disc list-inside">
                          {bulletBuffer.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      );
                      bulletBuffer = [];
                    }
                  };

              const flushPlain = () => {
                    if (plainBuffer.length > 0) {
                      plainBuffer.forEach((text) => {
                        elements.push(
                          <p key={`p-${elements.length}`} className="my-1">{text.trim()}</p>
                        );
                      });
                      plainBuffer = [];
                    }
                  };

                  lines.forEach((line) => {
                    if (line.trimStart().startsWith("- ")) {
                      flushPlain();
                      bulletBuffer.push(line.trimStart().slice(2));
                    } else {
                      flushBullets();
                      plainBuffer.push(line.trim());
                    }
                  });
                  flushBullets();
                  flushPlain();
                  return elements;
                })()}
              </motion.div>
            ) : (
              <motion.p
                {...fadeUp(0.16)}
                className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
                style={{ color: "#6B7280", ...getStyle("body") }}>
                {body}
              </motion.p>
            )}
          </div>

          {/* Right — Dual-column marquee (50%) with margin & fade */}
          <div className="lg:w-1/2 flex-shrink-0 w-full relative px-4 sm:px-6 lg:px-8 xl:pr-16">
            {certs.length === 0 ?
            <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed" style={{ borderColor: "#D1D5DB" }}>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Sube certificaciones desde el admin
                </p>
              </div> :

            <div className="relative h-[420px] overflow-hidden cert-mask">
                <style>{`
                  .cert-mask {
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
                    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
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
                <div className="flex gap-3 h-full" style={{ columns: 3 }}>
                  {/* 3 columns */}
                  {[colA, colB, colC].map((col, colIdx) => (
                    <div key={colIdx} className="flex-1 overflow-hidden">
                      <div className={colIdx % 2 === 0 ? "cert-col-up flex flex-col gap-3" : "cert-col-down flex flex-col gap-3"}>
                        {[...col, ...col].map((cert, i) =>
                          <CertCard key={`col${colIdx}-${i}`} cert={cert} />
                        )}
                      </div>
                    </div>
                  ))}
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
    <div className="flex items-center justify-center px-1 py-1">
      <div className="bg-white rounded-xl shadow-md p-3 w-full flex items-center justify-center">
        <img
          src={cert.image_url}
          alt={cert.name || "Certificación"}
          className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy" />
      </div>
    </div>);
}

export default Credibility;