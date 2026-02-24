import { Linkedin } from "lucide-react";
import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

const footerLinks = {
  servicios: [
    "Diagnóstico del Motor de Ingresos",
    "Implementación HubSpot",
    "RevOps as a Service",
    "Marketing Ops",
    "IA para Revenue",
    "Soporte",
  ],
  roles: [
    "CEO / Gerente General",
    "Equipo Comercial",
    "Marketing",
    "Operaciones",
  ],
  empresa: [
    "Nosotros",
    "Recursos",
    "Pulso Comercial",
    "Agenda una llamada",
  ],
};

const Footer = () => {
  return (
    <footer style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logoBlanco} alt="Revops LATAM" className="h-8" />
            <p className="mt-4 text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Arquitectos del Revenue
            </p>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ordenamos para crecer. Diseñamos, construimos y operamos sistemas de revenue para empresas latinoamericanas.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:!bg-[#0779D7] hover:!border-[#0779D7]"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Linkedin size={18} color="#FFFFFF" />
            </a>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-[14px] font-semibold mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>Servicios</h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-[14px] font-semibold mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>Para tu rol</h4>
            <ul className="space-y-2.5">
              {footerLinks.roles.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-[14px] font-semibold mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>Revops LATAM</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Revops LATAM. Todos los derechos reservados.
          </p>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Construido con RevOps · Santiago, Chile
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
