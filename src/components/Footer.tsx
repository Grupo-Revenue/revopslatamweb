import { Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

const footerLinks = {
  servicios: [
    { label: "Conoce tu Pista", to: "/conoce-tu-pista" },
    { label: "Diseña y Construye", to: "/diseña-y-construye-tu-pista" },
    { label: "Opera tu Pista", to: "/opera-tu-pista" },
    { label: "Potencia con IA", to: "/potencia-con-ia" },
    { label: "Implementación HubSpot", to: "/implementacion-hubspot" },
    { label: "RevOps as a Service", to: "/revops-as-a-service" },
  ],
  empresa: [
    { label: "Nosotros", to: "/nosotros", external: false },
    { label: "Partner HubSpot", to: "/hubspot-partner-chile", external: false },
    { label: "Pulso Comercial", to: "https://pulso.revopslatam.com/", external: true },
  ],
};

const Footer = () => {
  return (
    <footer style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src={logoBlanco} alt="Revops LATAM" className="h-8" />
            </Link>
            <p className="mt-4 text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Arquitectos del Revenue
            </p>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ordenamos para crecer. Diseñamos, construimos y operamos sistemas de revenue para empresas latinoamericanas.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/revops-latam/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:!bg-[#0779D7] hover:!border-[#0779D7]"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Linkedin size={18} color="#FFFFFF" />
              </a>
              <a
                href="https://www.instagram.com/revopslatam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:!bg-[#E1306C] hover:!border-[#E1306C]"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Instagram size={18} color="#FFFFFF" />
              </a>
            </div>
          </div>

          {/* Servicios — solo hubs + top services */}
          <div>
            <h4 className="text-[14px] font-semibold mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>Servicios</h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Empresa */}
          <div>
            <h4 className="text-[14px] font-semibold mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>Revops LATAM</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((l) =>
                l.external ? (
                  <li key={l.label}>
                    <a href={l.to} target="_blank" rel="noopener noreferrer" className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Revops LATAM. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/politica-de-privacidad" className="text-[12px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>
              Política de Privacidad
            </Link>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Santiago, Chile
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
