/**
 * WaveDivider — smooth SVG wave transition between sections.
 * Used instead of SectionDivider at key light→dark or dark→light transitions.
 */
interface WaveDividerProps {
  /** Top section color */
  fromColor?: string;
  /** Bottom section color */
  toColor?: string;
  /** Flip the wave direction */
  flip?: boolean;
  className?: string;
}

const WaveDivider = ({
  fromColor = "#ffffff",
  toColor = "#1A1A2E",
  flip = false,
  className = "",
}: WaveDividerProps) => (
  <div
    className={`relative w-full overflow-hidden leading-[0] ${className}`}
    style={{
      background: toColor,
      marginTop: -1,
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  >
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="relative block w-full"
      style={{ height: "clamp(40px, 5vw, 80px)" }}
    >
      <path
        d="M0,0 C360,80 1080,0 1440,60 L1440,0 L0,0 Z"
        fill={fromColor}
      />
    </svg>
  </div>
);

export default WaveDivider;
