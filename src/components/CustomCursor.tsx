import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -50, y: -50 });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Don't render on touch devices
    const checkTouch = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkTouch();

    if (isMobile) return;

    let raf: number;
    let targetX = -50;
    let targetY = -50;
    let currentX = -50;
    let currentY = -50;

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    const tick = () => {
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
      setPos({ x: currentX, y: currentY });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, visible]);

  if (isMobile) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9998] pointer-events-none"
      style={{
        transform: `translate3d(${pos.x - 10}px, ${pos.y - 10}px, 0)`,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #BE1869, #6224BE)",
        boxShadow: "0 0 16px rgba(190,24,105,0.6), 0 0 6px rgba(98,36,190,0.4)",
        opacity: visible ? 0.9 : 0,
        transition: "opacity 0.2s ease",
        willChange: "transform",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default CustomCursor;
