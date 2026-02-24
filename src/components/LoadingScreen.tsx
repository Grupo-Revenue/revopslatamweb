import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#0D0D1A" }}
        >
          {/* Logo */}
          <motion.img
            src={logoBlanco}
            alt="Revops LATAM"
            className="h-10 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />

          {/* Mini track with ball */}
          <svg viewBox="0 0 200 40" width={200} height={40} className="overflow-visible">
            <defs>
              <linearGradient id="load-track" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#BE1869" />
                <stop offset="50%" stopColor="#6224BE" />
                <stop offset="100%" stopColor="#1CA398" />
              </linearGradient>
              <radialGradient id="load-ball">
                <stop offset="0%" stopColor="#F7BE1A" />
                <stop offset="100%" stopColor="#BE1869" />
              </radialGradient>
              <filter id="load-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line x1="20" y1="20" x2="180" y2="20" stroke="url(#load-track)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <motion.circle
              r="5"
              cy="20"
              fill="url(#load-ball)"
              filter="url(#load-glow)"
              initial={{ cx: 20 }}
              animate={{ cx: [20, 180, 20] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
