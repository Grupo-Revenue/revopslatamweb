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
  const textColumnRef = useRef<HTMLDivElement | null>(null);
  const [desktopCarouselHeight, setDesktopCarouselHeight] = useState(480);

  useEffect(() => {
    const element = textColumnRef.current;
    if (!element || typeof window === "undefined") return;

    const topOffset = 16; // mt-4
    const updateHeight = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        setDesktopCarouselHeight(480);
        return;
      }

      setDesktopCarouselHeight(Math.max(element.offsetHeight - topOffset, 420));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [body, bodyAsList, certs.length, eyebrow, title]);

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{ background: "#F5F5F8", ...getBgStyle() }}>
      
      {hasBg && <div style={bgLayerStyle} />}

      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left — Text (50%) aligned to main container */}
          <div ref={textColumnRef} className="lg:w-1/2 lg:sticky lg:top-32 py-10 lg:py-16 px-6 sm:px-10 lg:pr-12 lg:pl-[calc((100vw-1100px)/2)] xl:pl-[calc((100vw-1100px)/2)]">
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

          {/* Right — Dual-column marquee (50%) full-width */}
          <div className="lg:w-1/2 flex-shrink-0 w-full relative">
            {certs.length === 0 ?
            <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed" style={{ borderColor: "#D1D5DB" }}>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Sube certificaciones desde el admin
                </p>
              </div> :

            <div
              className="relative h-[480px] lg:h-[var(--credibility-height)] overflow-hidden cert-mask mt-4 mr-6 sm:mr-10 lg:mr-12"
              style={{ "--credibility-height": `${desktopCarouselHeight}px` } as React.CSSProperties}
            >
                <style>{`
                  .cert-mask {
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 4%, black 100%);
                    mask-image: linear-gradient(to bottom, transparent 0%, black 4%, black 100%);
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
                    <div className="cert-col-up flex flex-col gap-3">
                      {[...colA, ...colA].map((cert, i) =>
                    <CertCard key={`a-${i}`} cert={cert} />
                    )}
                    </div>
                  </div>
                  {/* Column B — scrolls DOWN */}
                  <div className="flex-1 overflow-hidden">
                    <div className="cert-col-down flex flex-col gap-3">
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
    <div className="flex items-center justify-center px-1 py-1 h-[calc((480px-16px)/3)] lg:h-[calc((var(--credibility-height)-16px)/3)]">
      <div className="bg-white rounded-xl shadow-md p-3 w-full h-full flex items-center justify-center">
        <img
          src={cert.image_url}
          alt={cert.name || "Certificación"}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy" />
      </div>
    </div>);
}

export default Credibility;