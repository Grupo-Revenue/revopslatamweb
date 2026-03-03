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

const isTestimonialVideo = (value: unknown): value is TestimonialVideo => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.youtube_id === "string" &&
    typeof item.title === "string" &&
    typeof item.client === "string"
  );
};

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
  {
    youtube_id: "dQw4w9WgXcQ",
    title: "Automatización que generó resultados reales",
    client: "Pedro Martínez",
    role: "COO, GrowthLab",
  },
];

const Testimonials = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  const rawVideos = Array.isArray(meta.videos) ? meta.videos : defaultTestimonials;
  const videos = rawVideos.filter(isTestimonialVideo);
  const eyebrow = section?.subtitle ?? "Casos de éxito";
  const headline = section?.title ?? "Quienes ya transformaron su revenue";

  const [activeIndex, setActiveIndex] = useState(0);
  const featured = videos[activeIndex] ?? videos[0];
  const [playing, setPlaying] = useState(false);

  if (!videos.length) return null;

  const sideVideos = videos.filter((_, i) => i !== activeIndex).slice(0, 3);

  return (
    <section
      className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: "hsl(var(--dark-bg))", ...getBgStyle() }}
    >
      {hasBg && <div style={bgLayerStyle} />}

      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700, top: "20%", left: "30%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, hsl(var(--pink) / 0.05) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
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

        <motion.div
          {...fadeUp(0.15)}
          className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4"
        >
          {/* Featured video — click thumbnail to load iframe */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ background: "#000", border: "1px solid hsl(0 0% 100% / 0.08)" }}
          >
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.iframe
                    key={"iframe-" + activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    src={`https://www.youtube-nocookie.com/embed/${featured.youtube_id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&color=white&playsinline=1&fs=1`}
                    title={featured.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                ) : (
                  <motion.div
                    key={"thumb-" + activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 cursor-pointer group"
                    onClick={() => setPlaying(true)}
                  >
                    <img
                      src={featured.thumbnail || getYouTubeThumbnail(featured.youtube_id)}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/15" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: "hsl(var(--pink) / 0.9)",
                          boxShadow: "0 6px 30px hsl(var(--pink) / 0.4)",
                        }}
                      >
                        <Play size={24} className="text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info bar */}
            <div className="px-5 py-4" style={{ background: "hsl(0 0% 100% / 0.03)", borderTop: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <p className="text-[16px] sm:text-[17px] font-semibold leading-snug" style={{ color: "hsl(0 0% 100% / 0.9)" }}>
                {featured.title}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: "hsl(0 0% 100% / 0.4)" }}>
                {featured.client}{featured.role && ` · ${featured.role}`}
              </p>
            </div>
          </div>

          {/* Sidebar — exactly 3 cards filling the height */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sideVideos.map((v) => {
              const originalIndex = videos.indexOf(v);
              const thumb = v.thumbnail || getYouTubeThumbnail(v.youtube_id);
              return (
                <motion.button
                  key={originalIndex}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveIndex(originalIndex); setPlaying(false); }}
                  className="flex-shrink-0 w-[200px] lg:w-full lg:flex-1 rounded-xl overflow-hidden text-left transition-all duration-300 group"
                  style={{
                    background: "hsl(0 0% 100% / 0.03)",
                    border: "1px solid hsl(0 0% 100% / 0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="relative w-full overflow-hidden flex-1 min-h-0">
                    <img
                      src={thumb}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/15" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        style={{
                          background: "hsl(0 0% 100% / 0.15)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid hsl(0 0% 100% / 0.2)",
                        }}
                      >
                        <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-[12px] font-medium leading-snug line-clamp-1" style={{ color: "hsl(0 0% 100% / 0.7)" }}>
                      {v.title}
                    </p>
                    <p className="mt-0.5 text-[10px]" style={{ color: "hsl(0 0% 100% / 0.3)" }}>
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
