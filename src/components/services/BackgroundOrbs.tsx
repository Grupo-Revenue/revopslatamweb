import { motion } from "framer-motion";

interface BackgroundOrbsProps {
  variant?: "hero" | "section";
}

const BackgroundOrbs = ({ variant = "hero" }: BackgroundOrbsProps) => {
  if (variant === "section") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #BE1869, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #6224BE, transparent 70%)" }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "-15%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(190,24,105,0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, rgba(98,36,190,0.12), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: "40%",
          left: "30%",
          background: "radial-gradient(circle, rgba(7,121,215,0.08), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
};

export default BackgroundOrbs;
