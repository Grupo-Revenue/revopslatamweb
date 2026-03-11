import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const Services = () => {
  const [sprintTab, setSprintTab] = useState<"15" | "30">("30");

  return (
    <section className="relative">
      {/* Wave transition from light to dark */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20">
          <path d="M0,0 L1440,0 L1440,40 Q1080,80 720,60 Q360,40 0,80 Z" fill="#F5F5F8" />
        </svg>
      </div>

      <div className="py-24 px-6" style={{ background: "#0D0D1A" }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <motion.p
            {...fadeUp(0)}
            className="text-center text-[13px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "hsl(337 74% 44%)" }}
          >
            Nuestros servicios
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-4 text-center text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-tight"
            style={{ color: "white" }}
          >
            ¿En qué punto está tu pista hoy?
          </motion.h2>
          <motion.p
            {...fadeUp(0.15)}
            className="mt-4 text-center text-[18px] max-w-[500px] mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Trabajamos en cuatro momentos. Cada empresa entra donde lo necesita.
          </motion.p>

          {/* Cards grid */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PHASE 1 */}
            <motion.div
              {...fadeUp(0.2)}
              className="group rounded-[20px] p-10 transition-all duration-[400ms] hover:-translate-y-1.5"
              style={{
                background: "#13132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                borderColor: "hsl(337 74% 44%)",
                boxShadow: "0 8px 40px rgba(190,24,105,0.15)",
              }}
            >
              <span className="text-[64px] font-bold leading-none" style={{ color: "rgba(190,24,105,0.2)" }}>01</span>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
                  style={{ background: "rgba(190,24,105,0.15)", color: "hsl(337 74% 44%)" }}>
                  Diseña tu pista
                </span>
              </div>
              <h3 className="mt-5 text-[22px] font-bold" style={{ color: "white" }}>
                Diagnóstico del Motor de Ingresos
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Antes de construir, entendemos. Analizamos cómo fluye tu revenue hoy, dónde se pierde, y qué necesita cambiar.
              </p>
              {/* Quote box */}
              <div className="mt-5 rounded-lg p-4" style={{ background: "rgba(190,24,105,0.08)", borderLeft: "3px solid hsl(337 74% 44%)" }}>
                <p className="italic text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  "Porque una pista mal diseñada implementada perfectamente sigue siendo una pista mal diseñada."
                </p>
              </div>
              {/* Prices */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Starter: $3.000.000 CLP", "Growth: $5.700.000 CLP", "Enterprise: $9.500.000 CLP"].map((p) => (
                  <span key={p} className="px-4 py-1.5 rounded-full text-[13px] font-medium"
                    style={{ background: "rgba(255,255,255,0.05)", color: "white" }}>
                    {p}
                  </span>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "hsl(337 74% 44%)" }}>
                Conocer el Diagnóstico <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* PHASE 2 */}
            <motion.div
              {...fadeUp(0.3)}
              className="group rounded-[20px] p-10 transition-all duration-[400ms] hover:-translate-y-1.5"
              style={{
                background: "#13132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                borderColor: "hsl(263 70% 44%)",
                boxShadow: "0 8px 40px rgba(98,36,190,0.15)",
              }}
            >
              <span className="text-[64px] font-bold leading-none" style={{ color: "rgba(98,36,190,0.2)" }}>02</span>
              <div className="mt-4">
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
                  style={{ background: "rgba(98,36,190,0.15)", color: "hsl(263 70% 44%)" }}>
                  Construye tu pista
                </span>
              </div>
              <h3 className="mt-5 text-[22px] font-bold" style={{ color: "white" }}>
                Implementación · Marketing Ops · Integraciones
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Construimos las piezas que tu sistema necesita. Implementamos HubSpot CRM con metodología, no con atajos.
              </p>
              {/* Check items */}
              <div className="mt-5 space-y-3">
                {[
                  "Levantamiento y diagramación de procesos",
                  "Implementación y configuración",
                  "Capacitación y documentación",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 shrink-0" style={{ color: "hsl(263 70% 44%)" }} />
                    <span className="text-[15px]" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "hsl(263 70% 44%)" }}>
                Ver servicios de construcción <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* PHASE 3 */}
            <motion.div
              {...fadeUp(0.35)}
              className="group rounded-[20px] p-10 transition-all duration-[400ms] hover:-translate-y-1.5"
              style={{
                background: "#13132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                borderColor: "hsl(175 73% 37%)",
                boxShadow: "0 8px 40px rgba(28,163,152,0.15)",
              }}
            >
              <span className="text-[64px] font-bold leading-none" style={{ color: "rgba(28,163,152,0.2)" }}>03</span>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
                  style={{ background: "rgba(28,163,152,0.15)", color: "hsl(175 73% 37%)" }}>
                  Opera tu pista
                </span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
                  style={{ background: "rgba(247,190,26,0.15)", color: "hsl(42 93% 54%)" }}>
                  ⭐ Servicio estrella
                </span>
              </div>
              <h3 className="mt-5 text-[22px] font-bold" style={{ color: "white" }}>
                RevOps as a Service
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Tu equipo externo de RevOps que funciona como si fuera interno. Trabajamos en sprints, mejorando continuamente tu sistema de revenue.
              </p>
              {/* Highlight box */}
              <div className="mt-5 rounded-lg p-5 flex items-center gap-4" style={{ background: "rgba(28,163,152,0.08)", border: "1px solid rgba(28,163,152,0.2)" }}>
                <div>
                  <p className="text-[20px] font-bold" style={{ color: "hsl(175 73% 37%)" }}>Desde 35 UF / sprint de 30 días</p>
                  <div className="mt-1 flex items-center gap-2">
                    <RotateCcw size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Servicio recurrente</span>
                  </div>
                </div>
              </div>
              {/* Sprint tabs */}
              <div className="mt-5 flex gap-2">
                {(["15", "30"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSprintTab(t)}
                    className="px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200"
                    style={{
                      background: sprintTab === t ? "rgba(28,163,152,0.2)" : "rgba(255,255,255,0.05)",
                      color: sprintTab === t ? "hsl(175 73% 37%)" : "rgba(255,255,255,0.5)",
                      border: sprintTab === t ? "1px solid rgba(28,163,152,0.4)" : "1px solid transparent",
                    }}
                  >
                    Sprint {t} días
                  </button>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "hsl(175 73% 37%)" }}>
                Conocer RevOps as a Service <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* PHASE 4 */}
            <motion.div
              {...fadeUp(0.4)}
              className="group rounded-[20px] p-10 transition-all duration-[400ms] hover:-translate-y-1.5"
              style={{
                background: "#13132A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                borderColor: "hsl(208 95% 44%)",
                boxShadow: "0 8px 40px rgba(7,121,215,0.15)",
              }}
            >
              <span className="text-[64px] font-bold leading-none" style={{ color: "rgba(7,121,215,0.2)" }}>04</span>
              <div className="mt-4">
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
                  style={{ background: "rgba(7,121,215,0.15)", color: "hsl(208 95% 44%)" }}>
                  Potencia con IA
                </span>
              </div>
              <h3 className="mt-5 text-[22px] font-bold" style={{ color: "white" }}>
                Estrategia IA para tu Motor de Ingresos
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Cuando tu pista está bien armada, la IA deja de ser un experimento y se convierte en ventaja competitiva.
              </p>
              {/* Special note */}
              <div className="mt-5 rounded-lg p-4 flex items-start gap-3" style={{ background: "rgba(7,121,215,0.08)", border: "1px solid rgba(7,121,215,0.2)" }}>
                <Zap size={18} className="mt-0.5 shrink-0" style={{ color: "hsl(208 95% 44%)" }} />
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Aplicable en cualquier fase. La IA sobre una pista rota solo automatiza el caos.
                </p>
              </div>
              <button className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "hsl(208 95% 44%)" }}>
                Explorar IA para revenue <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>

          {/* Final CTA */}
          <motion.div {...fadeUp(0.5)} className="mt-16 text-center">
            <p className="text-[15px] mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              ¿No sabes en qué fase estás?
            </p>
            <Button size="lg" className="gap-2" onClick={() => window.open("https://pulso.revopslatam.com/", "_blank")}>
              Haz el Pulso Comercial gratis
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
