import { useState, useEffect, useRef } from "react";

/**
 * Returns true when user scrolls down (navbar should hide),
 * false when scrolling up or at top (navbar should show).
 */
export const useScrollDirection = (threshold = 10) => {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y - lastY.current > threshold) {
        setHidden(true);
      } else if (lastY.current - y > threshold) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
};
