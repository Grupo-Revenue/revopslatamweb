import { motion } from "framer-motion";
import { useState } from "react";
import { Play, ChevronRight } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

interface TestimonialVideo {
  youtube_id: string;
  title: string;
  client: string;
  role?: string;
  thumbnail?: string;
}

const getYouTubeThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const defaultTestimonials: TestimonialVideo[] = [
  {
    youtube_id: "dQw4w9WgXcQ",
    title: "Cómo triplicamos el pipeline en 6 meses",
    client: "María López",
    role: "VP Comercial, TechCorp",
  },
  {
    youtube_id: "dQw4w9WgXcQ",
    title: "De Excel a HubSpot: nuestra transformación",
    client: "Carlos Ruiz",
    role: "CEO, DataFlow",
  },
  {
    youtube_id: "dQw4w9WgXcQ",
    title: "RevOps nos dio previsibilidad real",
    client: "Ana García",
    role: "Directora de Operaciones, ScaleMX",
  },
];

const Testimonials = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const videos = (meta.videos as TestimonialVideo[]) ?? defaultTestimonials;
  const eyebrow = section?.subtitle ?? "Casos de éxito";
  const headline = section?.title ?? "Quienes ya transformaron su revenue";

  const [activeIndex, setActiveIndex] = useState(0);
  const featured = videos[activeIndex] ?? videos[0];

  if (!videos.length) return null;

  return (
    <section
      className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))", ...getBgStyle() }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      {/* Subtle glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle, hsl(var(--pink) / 0.06) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.p
          {...fadeUp(0)}
          className="text-center text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-4 text-center text-[26px] md:text-[38px] font-bold leading-[1.2] tracking-tight max-w-[700px] mx-auto"
          style={{ color: "hsl(0 0% 100% / 0.95)", ...getStyle("title") }}
        >
          {headline}
        </motion.h2>

        {/* Video layout: featured + sidebar */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-5"
        >
          {/* Featured video */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40" style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${featured.youtube_id}?rel=0&modestbranding=1`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-5">
              <p
                className="text-[17px] sm:text-lg font-semibold leading-snug"
                style={{ color: "hsl(0 0% 100% / 0.9)" }}
              >
                {featured.title}
              </p>
              <p
                className="mt-1.5 text-[13px] sm:text-sm"
                style={{ color: "hsl(0 0% 100% / 0.45)" }}
              >
                {featured.client}
                {featured.role && ` · ${featured.role}`}
              </p>
            </div>
          </div>

          {/* Sidebar: other videos */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[480px] scrollbar-thin">
            {videos.map((v, i) => {
              const isActive = i === activeIndex;
              const thumb = v.thumbnail || getYouTubeThumbnail(v.youtube_id);
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 w-[240px] lg:w-full flex gap-3 rounded-xl p-2.5 text-left transition-all duration-300"
                  style={{
                    background: isActive
                      ? "hsl(0 0% 100% / 0.06)"
                      : "transparent",
                    border: `1px solid ${isActive ? "hsl(var(--pink) / 0.3)" : "hsl(0 0% 100% / 0.06)"}`,
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-[90px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
                    <img
                      src={thumb}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play
                          size={18}
                          className="text-white/80"
                          fill="currentColor"
                        />
                      </div>
                    )}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: "hsl(var(--pink))" }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium leading-snug line-clamp-2"
                      style={{
                        color: isActive
                          ? "hsl(0 0% 100% / 0.9)"
                          : "hsl(0 0% 100% / 0.6)",
                      }}
                    >
                      {v.title}
                    </p>
                    <p
                      className="mt-1 text-[11px] truncate"
                      style={{ color: "hsl(0 0% 100% / 0.35)" }}
                    >
                      {v.client}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
