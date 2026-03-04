import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const PorQueDeEstaForma = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Por qué lo hacemos de esta forma";
  const imageUrl = section?.image_url;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let raf: number;

    const renderFrame = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness < 30) {
          data[i + 3] = 0;
        } else if (brightness < 80) {
          data[i + 3] = Math.round((brightness - 30) * (255 / 50));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(renderFrame);
    };

    const onPlay = () => { raf = requestAnimationFrame(renderFrame); };
    video.addEventListener("play", onPlay);
    if (!video.paused) onPlay();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("play", onPlay);
    };
  }, [imageUrl]);

  const paragraphs = [
    (meta.p1 as string) ?? "Somos una empresa fundada sobre principios cristianos. Y eso no es un detalle biográfico — es la razón por la que hacemos lo que hacemos de la forma en que lo hacemos.",
    (meta.p2 as string) ?? "Entendemos nuestro trabajo como parte de algo más grande: el mandato de llenar el mundo de orden, bien y propósito. Cada sistema que diseñamos, cada proceso que conectamos, cada empresa que acompañamos es una oportunidad concreta de hacer bien al mundo y a las personas.",
    (meta.p3 as string) ?? "Por eso no ejecutamos tareas por cumplir. Por eso no vendemos soluciones que no funcionan. Por eso decimos la verdad aunque no sea lo que el cliente quiere oír. No es estrategia comercial — es carácter. Y el carácter define la calidad del trabajo.",
    (meta.p4 as string) ?? "Somos excelentes con nuestros clientes porque en primer lugar nuestro compromiso es con el talento que Dios nos ha dado para hacerle bien al mundo y a las personas.",
  ];

  const quote = (meta.quote as string) ?? "Crecemos de forma correcta, honrando a Dios y sirviendo a las personas.";

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "#F5F5F8" };

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10" style={sectionBg}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[820px] mx-auto">
        {imageUrl && (
          <motion.div {...fadeUp(0)} className="mb-10 relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full max-w-[600px] mx-auto h-auto object-contain relative z-[1]"
            />
            <video
              ref={videoRef}
              src="/videos/cross-flare.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ display: "none" }}
            />
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="pointer-events-none"
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                top: "5%",
                left: "50%",
                transform: "translateX(-20%)",
                zIndex: 2,
              }}
            />
          </motion.div>
        )}
        <motion.h2 {...fadeUp(imageUrl ? 0.1 : 0)} className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[1.12] tracking-tight" style={{ color: "#1A1A2E", ...getStyle("title") }}>
          {title}
        </motion.h2>

        <div className="mt-10 space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p key={i} {...fadeUp(0.08 + i * 0.06)} className="text-[17px] sm:text-[18px] leading-[1.8]" style={{ color: "#4B5563", ...getStyle("body") }}>
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-16 sm:mt-20 py-12 sm:py-16 px-6 text-center relative">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[120px] sm:text-[160px] leading-none font-serif select-none pointer-events-none" style={{ color: "hsl(var(--pink) / 0.08)" }}>"</span>
          <p className="relative z-10 text-[24px] sm:text-[30px] md:text-[36px] font-bold leading-[1.2] tracking-tight" style={{ color: "#1A1A2E", ...getStyle("subtitle") }}>
            {quote}
          </p>
          <div className="mt-6 mx-auto h-1 w-16 rounded-full" style={{ background: "var(--gradient-brand)" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueDeEstaForma;
