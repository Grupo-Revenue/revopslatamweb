/**
 * NoiseOverlay — SVG feTurbulence texture for premium tactile feel.
 * Very subtle (opacity 0.02-0.03) — adds material quality like Apple.
 */
const NoiseOverlay = ({ opacity = 0.025 }: { opacity?: number }) => (
  <div
    className="absolute inset-0 pointer-events-none z-[1]"
    aria-hidden
    style={{ opacity, mixBlendMode: "overlay" }}
  >
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

export default NoiseOverlay;
