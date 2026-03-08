import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import ChipLink from "./ChipLink";

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

interface NoItem {
  text: string;
  note?: string;
  chip?: string;
  chipTo?: string;
}

interface ForWhomSectionProps {
  yesItems: string[];
  noItems: NoItem[];
  background?: string;
}

const ForWhomSection = ({
  yesItems,
  noItems,
  background = "#F9FAFB",
}: ForWhomSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background, padding: "120px 0" }}>
      <div className="mx-auto max-w-[900px] px-6 grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: "#1A1A2E" }}>
            Es para ti si
          </h3>
          <ul className="space-y-4">
            {yesItems.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: GRADIENT }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: "#1A1A2E" }}>
            No es para ti si
          </h3>
          <ul className="space-y-4">
            {noItems.map((n) => (
              <li key={n.text} className="text-sm" style={{ color: "#6B7280" }}>
                <div className="flex items-start gap-3">
                  <X size={16} className="mt-0.5 shrink-0" style={{ color: "#EF4444" }} />
                  <div>
                    {n.text}
                    {n.note && (
                      <span className="block text-xs mt-1 italic" style={{ color: "#9CA3AF" }}>
                        → {n.note}
                      </span>
                    )}
                    {n.chip && n.chipTo && (
                      <div className="mt-1.5">
                        <ChipLink to={n.chipTo}>{n.chip}</ChipLink>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWhomSection;
