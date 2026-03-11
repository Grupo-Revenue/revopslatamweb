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

// ── Qualification ────────────────────────────────────────────
const DECISION_MAKERS = new Set([
  "Dueño / Socio / Founder",
  "CEO / Gerente General",
  "Gerente Comercial / Ventas",
  "Gerente Marketing / Growth / RevOps",
  "Jefe de Ventas / Supervisor Comercial",
]);

const GOOD_TEAM_SIZES = new Set(["2–3 vendedores", "4–10 vendedores", "10+ vendedores"]);

function isQualified(data: FormData): boolean {
  return DECISION_MAKERS.has(data.job_title) && GOOD_TEAM_SIZES.has(data.team_size);
}

// ── Validation ───────────────────────────────────────────────
const step1Schema = z.object({
  first_name: z.string().trim().min(1, "Requerido").max(80),
  last_name: z.string().trim().min(1, "Requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(200),
  phone: z.string().trim().max(30).optional(),
});

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  company_name: string;
  industry: string;
  team_size: string;
  has_crm: string;
}

const initial: FormData = {
  first_name: "", last_name: "", email: "", phone: "",
  job_title: "", company_name: "", industry: "", team_size: "", has_crm: "",
};

// ── HubSpot Meetings URL (placeholder – user will provide) ──
const HUBSPOT_MEETINGS_URL = "https://meetings.hubspot.com/revopslatam";

// ── Component ────────────────────────────────────────────────
export default function LeadFormModal() {
  const { isOpen, closeLeadForm, sourcePage } = useLeadForm();
  const [step, setStep] = useState(0); // 0-2 = form steps, 3 = result
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [qualified, setQualified] = useState(false);

  const set = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const reset = () => { setStep(0); setForm(initial); setErrors({}); setQualified(false); };

  const handleClose = () => { closeLeadForm(); setTimeout(reset, 300); };

  // ── Step validation ──
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
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step < 2) { setStep(step + 1); return; }
    // Submit
    setSubmitting(true);
    const q = isQualified(form);
    setQualified(q);
    try {
      await (supabase as any).from("leads").insert({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        job_title: form.job_title,
        company_name: form.company_name.trim(),
        industry: form.industry,
        team_size: form.team_size,
        has_crm: form.has_crm,
        is_qualified: q,
        source_page: sourcePage,
      });
    } catch (_) { /* best effort */ }
    setSubmitting(false);
    setStep(3);
  };

  if (!isOpen) return null;

  const stepLabels = ["Tus datos", "Tu empresa", "Tu CRM"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lead-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={handleClose}
        >
          <motion.div
            key="lead-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: "hsl(240 33% 10%)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>

            {/* Progress bar */}
            {step < 3 && (
              <div className="px-6 pt-6">
                <div className="flex gap-2 mb-1">
                  {stepLabels.map((label, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "var(--gradient-brand)" }}
                          initial={{ width: "0%" }}
                          animate={{ width: i <= step ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p className="text-[11px] mt-1 text-center" style={{ color: i <= step ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-6 pb-6 pt-4">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <StepWrapper key="s0">
                    <h3 className="text-xl font-bold text-white mb-1">Conversemos 👋</h3>
                    <p className="text-sm text-white/50 mb-5">Cuéntanos un poco sobre ti</p>
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
                    <h3 className="text-xl font-bold text-white mb-1">Tu empresa 🏢</h3>
                    <p className="text-sm text-white/50 mb-5">Para entender mejor tu contexto</p>
                    <SelectField label="Cargo" value={form.job_title} options={CARGOS} onChange={v => set("job_title", v)} error={errors.job_title} />
                    <Field label="Nombre de la empresa" value={form.company_name} onChange={v => set("company_name", v)} error={errors.company_name} />
                    <SelectField label="Rubro" value={form.industry} options={RUBROS} onChange={v => set("industry", v)} error={errors.industry} />
                    <SelectField label="Equipo comercial" value={form.team_size} options={EQUIPO} onChange={v => set("team_size", v)} error={errors.team_size} />
                  </StepWrapper>
                )}

                {step === 2 && (
                  <StepWrapper key="s2">
                    <h3 className="text-xl font-bold text-white mb-1">Último paso 🎯</h3>
                    <p className="text-sm text-white/50 mb-5">¿Cuentas con CRM?</p>
                    <div className="flex flex-col gap-2">
                      {CRM_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => set("has_crm", opt)}
                          className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                          style={{
                            background: form.has_crm === opt ? "rgba(190,24,105,0.2)" : "rgba(255,255,255,0.05)",
                            border: `1.5px solid ${form.has_crm === opt ? "hsl(337 74% 44%)" : "rgba(255,255,255,0.1)"}`,
                            color: form.has_crm === opt ? "white" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.has_crm && <p className="text-xs mt-1" style={{ color: "hsl(0 84% 60%)" }}>{errors.has_crm}</p>}
                  </StepWrapper>
                )}

                {step === 3 && qualified && (
                  <StepWrapper key="qualified">
                    <div className="text-center py-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                        <CheckCircle2 size={56} className="mx-auto mb-4" style={{ color: "hsl(175 73% 37%)" }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">¡Genial, {form.first_name}! 🎉</h3>
                      <p className="text-sm text-white/60 mb-6">
                        Tu perfil encaja perfecto con lo que hacemos.<br />
                        Elige un horario para conversar:
                      </p>
                      <a
                        href={HUBSPOT_MEETINGS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-[1.03]"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        Agendar reunión
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </StepWrapper>
                )}

                {step === 3 && !qualified && (
                  <StepWrapper key="not-qualified">
                    <div className="text-center py-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                        <XCircle size={56} className="mx-auto mb-4" style={{ color: "hsl(42 93% 54%)" }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">¡Gracias, {form.first_name}! 🙌</h3>
                      <p className="text-sm text-white/60 mb-4 leading-relaxed">
                        Recibimos tu información. En este momento, nuestras soluciones están enfocadas en equipos comerciales con más de 2 personas.<br /><br />
                        Pero no te vayas con las manos vacías — te recomendamos hacer nuestro <strong className="text-white">Pulso Comercial</strong> gratuito para entender el estado de tu motor de ingresos.
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
                      <button onClick={handleClose} className="block mx-auto mt-3 text-sm text-white/40 hover:text-white/60 transition-colors">
                        Cerrar
                      </button>
                    </div>
                  </StepWrapper>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-6">
                  {step > 0 ? (
                    <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                      <ArrowLeft size={16} /> Atrás
                    </button>
                  ) : <div />}
                  <button
                    onClick={next}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white transition-all hover:scale-[1.03] disabled:opacity-50"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : step === 2 ? "Enviar" : "Siguiente"}
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
    <div className="mt-3">
      <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-all focus:ring-2"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `1.5px solid ${error ? "hsl(0 84% 60%)" : "rgba(255,255,255,0.1)"}`,
        }}
      />
      {error && <p className="text-xs mt-0.5" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="mt-3">
      <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `1.5px solid ${error ? "hsl(0 84% 60%)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <option value="" disabled style={{ background: "hsl(240 33% 10%)" }}>Seleccionar...</option>
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: "hsl(240 33% 10%)" }}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-xs mt-0.5" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>}
    </div>
  );
}
