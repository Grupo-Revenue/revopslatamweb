const DotPattern = ({ opacity = 0.4 }: { opacity?: number }) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
      opacity,
    }}
  />
);

export default DotPattern;
