const SectionDivider = ({ opacity = 0.1 }: { opacity?: number }) => (
  <div
    className="h-[2px] w-full"
    style={{
      background: `linear-gradient(90deg, transparent, rgba(190,24,105,${opacity}), rgba(98,36,190,${opacity}), transparent)`,
    }}
  />
);

export default SectionDivider;
