/**
 * GradientMesh — subtle color blobs for light sections.
 * Adds depth without animation overhead.
 */
const presets = {
  /** Pink/purple blob top-right — for white (#fff) sections */
  light: {
    blobs: [
      { color: "rgba(190,24,105,0.035)", size: 500, top: "-10%", right: "-8%", blur: 120 },
      { color: "rgba(98,36,190,0.025)", size: 400, top: "20%", right: "15%", blur: 100 },
    ],
  },
  /** Blue/teal blob bottom-left — for #F9FAFB sections */
  muted: {
    blobs: [
      { color: "rgba(7,121,215,0.03)", size: 460, bottom: "-12%", left: "-6%", blur: 110 },
      { color: "rgba(98,36,190,0.02)", size: 380, bottom: "10%", left: "20%", blur: 100 },
    ],
  },
  /** Centered subtle glow — for CTA sections */
  center: {
    blobs: [
      { color: "rgba(190,24,105,0.04)", size: 600, top: "50%", left: "50%", blur: 140, transform: "translate(-50%,-50%)" },
    ],
  },
} as const;

type Preset = keyof typeof presets;

interface GradientMeshProps {
  variant?: Preset;
}

const GradientMesh = ({ variant = "light" }: GradientMeshProps) => {
  const { blobs } = presets[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
            filter: `blur(${blob.blur}px)`,
            top: "top" in blob ? blob.top : undefined,
            bottom: "bottom" in blob ? blob.bottom : undefined,
            left: "left" in blob ? blob.left : undefined,
            right: "right" in blob ? blob.right : undefined,
            transform: "transform" in blob ? blob.transform : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default GradientMesh;
