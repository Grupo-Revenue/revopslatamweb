import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useLeadForm } from "@/hooks/useLeadForm";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// ── Options ──────────────────────────────────────────────────
const CARGOS = [
  "Dueño / Socio / Founder",
  "CEO / Gerente General",
  "Gerente Comercial / Ventas",
  "Gerente Marketing / Growth / RevOps",
  "Jefe de Ventas / Supervisor Comercial",
  "Vendedor / Ejecutivo Comercial",
  "Otro",
];

const RUBROS = [
  "SaaS B2B", "Servicios B2C", "Servicios B2B", "Venta de productos B2B",
  "Educación Superior", "Inmobiliaria", "Broker Inmobiliario",
  "Retail", "E-commerce", "Salud", "Colegios", "Otros",
];

const EQUIPO = [
  "Solo el dueño vende",
  "1 vendedor",
  "2–3 vendedores",
  "4–10 vendedores",
  "10+ vendedores",
];

const CRM_OPTIONS = [
  "No, usamos Excel / WhatsApp / herramientas básicas",
  "Sí, usamos HubSpot",
  "Sí, usamos otro CRM",
];

// ── Pain options per CRM type ────────────────────────────────
const PAIN_NO_CRM = [
  "Llevamos clientes en Excel/WhatsApp y está desordenado",
  "Queremos comenzar con HubSpot como nuestro CRM",
  "Queremos profesionalizar el proceso comercial",
  "No tenemos visibilidad del funnel",
  "Perdemos oportunidades por falta de seguimiento",
  "Solo estoy explorando, no es prioridad",
];

const PAIN_HUBSPOT = [
  "Automatizaciones mal diseñadas",
  "Reporting / pipelines desordenados",
  "No estamos aprovechando la herramienta",
  "Necesitamos mejores prácticas de RevOps",
  "HubSpot no está bien configurado",
  "Problemas de integraciones",
  "Solo estoy explorando, no es prioridad",
];

const PAIN_OTHER_CRM = [
  "No se integra con nuestras herramientas",
  "No tenemos reporting ni visibilidad",
  "Queremos migrarnos a HubSpot",
  "El CRM no se adapta al proceso comercial",
  "El CRM actual es limitado o difícil de usar",
  "Solo estoy explorando, no es prioridad",
];

// ── Scoring tables ───────────────────────────────────────────
const CARGO_SCORE: Record<string, number> = {
  "Dueño / Socio / Founder": 5,
  "CEO / Gerente General": 10,
  "Gerente Comercial / Ventas": 10,
  "Gerente Marketing / Growth / RevOps": 10,
  "Jefe de Ventas / Supervisor Comercial": 5,
  "Vendedor / Ejecutivo Comercial": 0,
  "Otro": 0,
};

const RUBRO_SCORE: Record<string, number> = {
  "SaaS B2B": 20,
  "Servicios B2C": 20,
  "Servicios B2B": 20,
  "Venta de productos B2B": 20,
  "Educación Superior": 20,
  "Inmobiliaria": 20,
  "Broker Inmobiliario": -20,
  "Retail": -10,
  "E-commerce": -10,
  "Salud": 10,
  "Colegios": -10,
  "Otros": 15,
};

const EQUIPO_SCORE: Record<string, number> = {
  "Solo el dueño vende": -20,
  "1 vendedor": -10,
  "2–3 vendedores": 10,
  "4–10 vendedores": 20,
  "10+ vendedores": 25,
};

function getPainOptions(crm: string): string[] {
  if (crm.includes("HubSpot")) return PAIN_HUBSPOT;
  if (crm.includes("otro CRM")) return PAIN_OTHER_CRM;
  return PAIN_NO_CRM;
}

function calculateScore(data: FormData): number {
  let score = 0;
  score += CARGO_SCORE[data.job_title] ?? 0;
  score += RUBRO_SCORE[data.industry] ?? 0;
  score += EQUIPO_SCORE[data.team_size] ?? 0;
  // Pain scoring
  if (data.main_pain === "Solo estoy explorando, no es prioridad") {
    score -= 10;
  } else if (data.main_pain) {
    score += 10;
  }
  return score;
}

// ── Validation ───────────────────────────────────────────────
const step1Schema = z.object({
  first_name: z.string().trim().min(1, "Requerido").max(80),
  last_name: z.string().trim().min(1, "Requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(200),
  phone: z.string().trim().min(1, "Requerido").max(30),
  consent: z.literal(true, { errorMap: () => ({ message: "Debes aceptar para continuar" }) }),
});

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  consent: boolean;
  job_title: string;
  company_name: string;
  industry: string;
  team_size: string;
  has_crm: string;
  main_pain: string;
}

const initial: FormData = {
  first_name: "", last_name: "", email: "", phone: "", consent: false,
  job_title: "", company_name: "", industry: "", team_size: "",
  has_crm: "", main_pain: "",
};

// ── HubSpot Meetings embed URL ──
const HUBSPOT_MEETINGS_URL = "https://meetings.hubspot.com/febe-moena/reuniones-landing-revops-usan-hubspot";

// ── Component ────────────────────────────────────────────────
export default function LeadFormModal() {
  const { isOpen, closeLeadForm, sourcePage } = useLeadForm();
  const [step, setStep] = useState(0); // 0-3 = form, 4 = result
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const set = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const reset = () => { setStep(0); setForm(initial); setErrors({}); setScore(0); };
  const handleClose = () => { closeLeadForm(); setTimeout(reset, 300); };

  const validateStep = (): boolean => {
    if (step === 0) {
      const result = step1Schema.safeParse(form);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach(e => { errs[e.path[0] as string] = e.message; });
        setErrors(errs);
        return false;
      }
    }
    if (step === 1) {
      const errs: Record<string, string> = {};
      if (!form.job_title) errs.job_title = "Selecciona tu cargo";
      if (!form.company_name.trim()) errs.company_name = "Requerido";
      if (!form.industry) errs.industry = "Selecciona un rubro";
      if (!form.team_size) errs.team_size = "Selecciona el tamaño";
      if (Object.keys(errs).length) { setErrors(errs); return false; }
    }
    if (step === 2) {
      if (!form.has_crm) { setErrors({ has_crm: "Selecciona una opción" }); return false; }
    }
    if (step === 3) {
      if (!form.main_pain) { setErrors({ main_pain: "Selecciona tu principal desafío" }); return false; }
    }
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step < 3) { setStep(step + 1); return; }

    // Submit on step 3
    setSubmitting(true);
    const finalScore = calculateScore(form);
    setScore(finalScore);
    const qualified = finalScore >= 40;

    try {
      const leadData = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        job_title: form.job_title,
        company_name: form.company_name.trim(),
        industry: form.industry,
        team_size: form.team_size,
        has_crm: form.has_crm,
        main_pain: form.main_pain,
        lead_score: finalScore,
        is_qualified: qualified,
        source_page: sourcePage,
      };

      await Promise.allSettled([
        (supabase as any).from("leads").insert(leadData),
        supabase.functions.invoke("submit-lead-hubspot", { body: leadData }),
      ]);
    } catch (_) { /* best effort */ }

    setSubmitting(false);
    setStep(4);
  };

  if (!isOpen) return null;

  const stepLabels = ["Tus datos", "Tu empresa", "Tu CRM", "Tu desafío"];
  const qualified = score >= 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lead-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
          onClick={handleClose}
        >
          <motion.div
            key="lead-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{
              maxWidth: step === 4 && qualified ? "720px" : "520px",
              maxHeight: "90vh",
              transition: "max-width 0.3s ease",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>

            {/* Progress bar */}
            {step < 4 && (
              <div className="px-6 pt-6">
                <div className="flex gap-2 mb-1">
                  {stepLabels.map((label, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-1.5 rounded-full overflow-hidden bg-muted">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "var(--gradient-brand)" }}
                          initial={{ width: "0%" }}
                          animate={{ width: i <= step ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className={`text-[11px] mt-1.5 text-center font-medium ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-6 pb-6 pt-4 overflow-y-auto" style={{ maxHeight: step === 4 && qualified ? "80vh" : undefined }}>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <StepWrapper key="s0">
                    <h3 className="text-2xl font-bold text-foreground mb-1">Conversemos 👋</h3>
                    <p className="text-sm text-muted-foreground mb-6">Cuéntanos un poco sobre ti</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nombre" value={form.first_name} onChange={v => set("first_name", v)} error={errors.first_name} autoFocus />
                      <Field label="Apellido" value={form.last_name} onChange={v => set("last_name", v)} error={errors.last_name} />
                    </div>
                    <Field label="Correo corporativo" value={form.email} onChange={v => set("email", v)} error={errors.email} type="email" />
                    <Field label="Teléfono (opcional)" value={form.phone} onChange={v => set("phone", v)} error={errors.phone} type="tel" />
                  </StepWrapper>
                )}

                {step === 1 && (
                  <StepWrapper key="s1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">Tu empresa 🏢</h3>
                    <p className="text-sm text-muted-foreground mb-6">Para entender mejor tu contexto</p>
                    <SelectField label="¿Cuál es tu cargo?" value={form.job_title} options={CARGOS} onChange={v => set("job_title", v)} error={errors.job_title} />
                    <Field label="¿En qué empresa trabajas?" value={form.company_name} onChange={v => set("company_name", v)} error={errors.company_name} />
                    <SelectField label="¿A qué rubro pertenecen?" value={form.industry} options={RUBROS} onChange={v => set("industry", v)} error={errors.industry} />
                    <SelectField label="¿Qué tamaño tiene tu equipo comercial?" value={form.team_size} options={EQUIPO} onChange={v => set("team_size", v)} error={errors.team_size} />
                  </StepWrapper>
                )}

                {step === 2 && (
                  <StepWrapper key="s2">
                    <h3 className="text-2xl font-bold text-foreground mb-1">Tu CRM 💻</h3>
                    <p className="text-sm text-muted-foreground mb-6">¿Cuentas con un CRM actualmente?</p>
                    <div className="flex flex-col gap-2.5">
                      {CRM_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => { set("has_crm", opt); set("main_pain", ""); }}
                          className="text-left px-5 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 border-2"
                          style={{
                            background: form.has_crm === opt ? "hsl(337 74% 44% / 0.08)" : "hsl(var(--muted) / 0.4)",
                            borderColor: form.has_crm === opt ? "hsl(337 74% 44%)" : "transparent",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.has_crm && <p className="text-xs mt-1.5 text-destructive font-medium">{errors.has_crm}</p>}
                  </StepWrapper>
                )}

                {step === 3 && (
                  <StepWrapper key="s3">
                    <h3 className="text-2xl font-bold text-foreground mb-1">Tu principal desafío 🎯</h3>
                    <p className="text-sm text-muted-foreground mb-6">¿Cuál es el problema que más te resuena?</p>
                    <div className="flex flex-col gap-2.5">
                      {getPainOptions(form.has_crm).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => set("main_pain", opt)}
                          className="text-left px-5 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 border-2"
                          style={{
                            background: form.main_pain === opt ? "hsl(337 74% 44% / 0.08)" : "hsl(var(--muted) / 0.4)",
                            borderColor: form.main_pain === opt ? "hsl(337 74% 44%)" : "transparent",
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.main_pain && <p className="text-xs mt-1.5 text-destructive font-medium">{errors.main_pain}</p>}
                  </StepWrapper>
                )}

                {step === 4 && qualified && (
                  <StepWrapper key="qualified">
                    <div className="text-center py-2">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                        <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: "hsl(175 73% 37%)" }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-foreground mb-1">¡Genial, {form.first_name}! 🎉</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tu perfil encaja perfecto con lo que hacemos. Elige un horario para conversar:
                      </p>
                      <div className="rounded-xl overflow-hidden border border-border">
                        <iframe
                          src={`${HUBSPOT_MEETINGS_URL}?embed=true&firstname=${encodeURIComponent(form.first_name)}&lastname=${encodeURIComponent(form.last_name)}&email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone || "")}&company=${encodeURIComponent(form.company_name)}`}
                          width="100%"
                          height="580"
                          frameBorder="0"
                          title="Agendar reunión"
                          className="w-full"
                          style={{ border: "none", minHeight: "580px" }}
                        />
                      </div>
                    </div>
                  </StepWrapper>
                )}

                {step === 4 && !qualified && (
                  <StepWrapper key="not-qualified">
                    <div className="text-center py-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                        <XCircle size={56} className="mx-auto mb-4" style={{ color: "hsl(42 93% 54%)" }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-foreground mb-2">¡Gracias, {form.first_name}! 🙌</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Recibimos tu información. En este momento, nuestras soluciones están enfocadas en equipos comerciales con más de 2 personas.<br /><br />
                        Pero no te vayas con las manos vacías — te recomendamos hacer nuestro <strong className="text-foreground">Pulso Comercial</strong> gratuito para entender el estado de tu motor de ingresos.
                      </p>
                      <a
                        href="https://pulso.revopslatam.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-[1.03]"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        Hacer el Pulso Comercial
                        <ArrowRight size={18} />
                      </a>
                      <button onClick={handleClose} className="block mx-auto mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Cerrar
                      </button>
                    </div>
                  </StepWrapper>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex items-center justify-between mt-8">
                  {step > 0 ? (
                    <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                      <ArrowLeft size={16} /> Atrás
                    </button>
                  ) : <div />}
                  <button
                    onClick={next}
                    disabled={submitting}
                    className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white transition-all hover:scale-[1.03] disabled:opacity-50 text-[15px]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : step === 3 ? "Enviar" : "Siguiente"}
                    {!submitting && <ArrowRight size={16} />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Reusable sub-components ──────────────────────────────────
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Field({ label, value, onChange, error, type = "text", autoFocus }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; autoFocus?: boolean;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all border-2 bg-muted/40 focus:border-pink focus:ring-1 focus:ring-pink/30"
        style={{
          borderColor: error ? "hsl(0 84% 60%)" : "transparent",
        }}
      />
      {error && <p className="text-xs mt-1 text-destructive font-medium">{error}</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-[15px] text-foreground outline-none transition-all appearance-none cursor-pointer border-2 bg-muted/40 focus:border-pink focus:ring-1 focus:ring-pink/30"
        style={{
          borderColor: error ? "hsl(0 84% 60%)" : "transparent",
        }}
      >
        <option value="" disabled className="text-muted-foreground">Seleccionar...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-xs mt-1 text-destructive font-medium">{error}</p>}
    </div>
  );
}
