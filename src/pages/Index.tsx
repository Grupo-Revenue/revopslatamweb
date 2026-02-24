import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const colorSwatches = [
  { name: "Pink", var: "bg-pink", hex: "#BE1869" },
  { name: "Purple", var: "bg-purple", hex: "#6224BE" },
  { name: "Teal", var: "bg-teal", hex: "#1CA398" },
  { name: "Yellow", var: "bg-yellow", hex: "#F7BE1A" },
  { name: "Blue", var: "bg-blue", hex: "#0779D7" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero – Dark section */}
      <section className="gradient-hero py-24 px-6">
        <div className="container max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-small text-muted-foreground mb-4 uppercase tracking-widest"
            style={{ color: "hsl(220 9% 65%)" }}
          >
            Design System — Revops LATAM
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ color: "white" }}
          >
            Sistema de <span className="text-gradient-brand">Diseño</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg mt-6 max-w-2xl"
            style={{ color: "hsl(220 9% 65%)" }}
          >
            Tipografía, colores, gradientes, botones y cards listos para construir
            la experiencia Revops LATAM.
          </motion.p>
        </div>
      </section>

      {/* Typography */}
      <section className="py-20 px-6 bg-muted">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12">Tipografía — Lexend</h2>
          <div className="space-y-6">
            <div>
              <p className="text-small text-muted-foreground mb-1">h1 — 56px / 700</p>
              <h1>Revenue Operations</h1>
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">h2 — 40px / 700</p>
              <h2>Transformamos ingresos</h2>
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">h3 — 28px / 600</p>
              <h3>Estrategia integrada</h3>
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">h4 — 20px / 600</p>
              <h4>Métricas que importan</h4>
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">body — 16px / 400</p>
              <p>
                Alineamos ventas, marketing y customer success bajo una sola operación de
                ingresos para acelerar el crecimiento de tu empresa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12">Colores de Marca</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {colorSwatches.map((c, i) => (
              <motion.div
                key={c.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div
                  className={`${c.var} w-full aspect-square rounded-2xl shadow-lg mb-3`}
                />
                <p className="font-semibold">{c.name}</p>
                <p className="text-small text-muted-foreground">{c.hex}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className="py-20 px-6 bg-muted">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12">Gradientes</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { name: "Brand", cls: "gradient-brand" },
              { name: "Accent", cls: "gradient-accent" },
              { name: "Teal", cls: "gradient-teal" },
              { name: "Hero", cls: "gradient-hero" },
            ].map((g) => (
              <div key={g.name} className={`${g.cls} h-32 rounded-2xl flex items-end p-4`}>
                <span className="font-semibold" style={{ color: "white" }}>
                  {g.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="py-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12">Botones</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <Button>Botón Primario</Button>
            <Button variant="secondary">Botón Secundario</Button>
            <Button variant="ghost">
              Ver más →
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 items-center mt-8">
            <Button size="sm">Pequeño</Button>
            <Button size="default">Normal</Button>
            <Button size="lg">Grande</Button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 px-6 gradient-hero">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12" style={{ color: "white" }}>
            Cards
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Dark card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-dark-card border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 transition-colors duration-300 hover:border-[rgba(190,24,105,0.3)]"
            >
              <h3 style={{ color: "white" }}>Card Oscura</h3>
              <p className="mt-3" style={{ color: "hsl(220 9% 65%)" }}>
                Fondo oscuro con borde sutil que resalta al hacer hover con el
                color de marca.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-dark-card border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 transition-colors duration-300 hover:border-[rgba(190,24,105,0.3)]"
            >
              <h3 style={{ color: "white" }}>Integración CRM</h3>
              <p className="mt-3" style={{ color: "hsl(220 9% 65%)" }}>
                Conectamos HubSpot, Salesforce y tus herramientas de ventas en un
                flujo unificado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Light cards */}
      <section className="py-20 px-6 bg-muted">
        <div className="container max-w-5xl mx-auto">
          <h2 className="mb-12">Cards Claras</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-8 shadow-lg"
            >
              <h3>Diagnóstico RevOps</h3>
              <p className="mt-3 text-muted-foreground">
                Evaluamos tu operación de ingresos y encontramos oportunidades de
                mejora inmediata.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-8 shadow-lg"
            >
              <h3>Automatización</h3>
              <p className="mt-3 text-muted-foreground">
                Diseñamos flujos que eliminan tareas manuales y aceleran tu ciclo
                de ventas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer tag */}
      <footer className="py-8 px-6 text-center">
        <p className="text-small text-muted-foreground">
          Design system listo · Revops LATAM © 2026
        </p>
      </footer>
    </div>
  );
};

export default Index;
