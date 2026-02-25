import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";
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
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

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

  const sideVideos = videos.filter((_, i) => i !== activeIndex);

  return (
    <section
      className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))", ...getBgStyle() }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: "20%",
          left: "30%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, hsl(var(--pink) / 0.05) 0%, transparent 70%)",
          filter: "blur(120px)",
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

        {/* Video layout */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4"
          style={{ minHeight: 0 }}
        >
          {/* Featured video */}
          <div className="relative rounded-2xl overflow-hidden flex flex-col" style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.youtube_id + activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full flex-1"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${featured.youtube_id}?rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&color=white&playsinline=1`}
                  title={featured.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </motion.div>
            </AnimatePresence>
            {/* Info bar */}
            <div className="px-5 py-4" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <p className="text-[16px] sm:text-[17px] font-semibold leading-snug" style={{ color: "hsl(0 0% 100% / 0.9)" }}>
                {featured.title}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: "hsl(0 0% 100% / 0.4)" }}>
                {featured.client}{featured.role && ` · ${featured.role}`}
              </p>
            </div>
          </div>

          {/* Sidebar — fills same height as featured */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0">
            {sideVideos.map((v, sideIdx) => {
              const originalIndex = videos.findIndex((vid) => vid === v);
              const thumb = v.thumbnail || getYouTubeThumbnail(v.youtube_id);
              return (
                <motion.button
                  key={originalIndex}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveIndex(originalIndex)}
                  className="flex-shrink-0 w-[260px] lg:w-full rounded-xl overflow-hidden text-left transition-all duration-300 group"
                  style={{
                    flex: "1 1 0",
                    background: "hsl(0 0% 100% / 0.03)",
                    border: "1px solid hsl(0 0% 100% / 0.06)",
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                    <img
                      src={thumb}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 group-hover:bg-black/20">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: "hsl(var(--pink) / 0.85)",
                          boxShadow: "0 4px 20px hsl(var(--pink) / 0.3)",
                        }}
                      >
                        <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-3.5 py-3">
                    <p
                      className="text-[13px] font-medium leading-snug line-clamp-2 transition-colors duration-300"
                      style={{ color: "hsl(0 0% 100% / 0.7)" }}
                    >
                      {v.title}
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "hsl(0 0% 100% / 0.3)" }}>
                      {v.client}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
