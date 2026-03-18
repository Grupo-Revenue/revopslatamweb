import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, UserCheck, Trash2, FileText, Mail } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const sections = [
  {
    icon: FileText,
    title: "1. Información que Recopilamos",
    content: `Recopilamos datos personales que nos proporcionas voluntariamente a través de nuestros formularios de contacto y diagnóstico, incluyendo:

• **Nombre completo** y apellidos
• **Correo electrónico** corporativo
• **Número de teléfono** (opcional)
• **Nombre de tu empresa**, cargo e industria
• **Tamaño de equipo** y uso de CRM
• **Página de origen** desde donde completaste el formulario

No recopilamos datos sensibles como información financiera, datos biométricos ni datos de menores de edad.`,
  },
  {
    icon: Eye,
    title: "2. Finalidad del Tratamiento",
    content: `Tus datos personales son tratados con las siguientes finalidades específicas, conforme al artículo 3 de la Ley 21.719:

• **Contactarte** para responder consultas y ofrecer información sobre nuestros servicios
• **Evaluar** la pertinencia de nuestras soluciones para tu empresa
• **Enviar comunicaciones comerciales** relacionadas con RevOps, CRM y HubSpot (solo con tu consentimiento)
• **Mejorar nuestros servicios** mediante análisis agregados y anónimos
• **Cumplir obligaciones legales** y regulatorias aplicables`,
  },
  {
    icon: Shield,
    title: "3. Base Legal del Tratamiento",
    content: `El tratamiento de tus datos se fundamenta en las bases legales establecidas por la Ley 21.719:

• **Consentimiento expreso** (art. 12): Otorgado al completar nuestros formularios con aceptación explícita
• **Interés legítimo** (art. 13): Para el envío de comunicaciones relevantes a tu actividad profesional
• **Ejecución contractual**: Cuando el tratamiento es necesario para la prestación de nuestros servicios

Puedes revocar tu consentimiento en cualquier momento sin que esto afecte la licitud del tratamiento previo.`,
  },
  {
    icon: UserCheck,
    title: "4. Tus Derechos ARCO-POL",
    content: `La Ley 21.719 te garantiza los siguientes derechos sobre tus datos personales:

• **Acceso**: Solicitar confirmación de si tratamos tus datos y obtener una copia
• **Rectificación**: Corregir datos inexactos o incompletos
• **Cancelación / Supresión**: Solicitar la eliminación de tus datos cuando ya no sean necesarios
• **Oposición**: Oponerte al tratamiento en determinadas circunstancias
• **Portabilidad**: Recibir tus datos en un formato estructurado y de uso común
• **Limitación**: Solicitar la restricción del tratamiento en casos específicos

Para ejercer estos derechos, escríbenos a **contacto@revopslatam.com** indicando tu solicitud. Responderemos en un plazo máximo de **30 días hábiles**.`,
  },
  {
    icon: Lock,
    title: "5. Seguridad y Almacenamiento",
    content: `Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos, incluyendo:

• **Cifrado en tránsito** (TLS/SSL) para todas las comunicaciones
• **Cifrado en reposo** en nuestras bases de datos
• **Control de acceso** basado en roles para nuestro equipo
• **Auditorías periódicas** de seguridad

Tus datos se almacenan en infraestructura cloud con centros de datos que cumplen estándares internacionales de seguridad (SOC 2, ISO 27001). Conservamos tus datos durante el tiempo necesario para cumplir las finalidades descritas o según lo exija la ley.`,
  },
  {
    icon: Trash2,
    title: "6. Transferencia Internacional de Datos",
    content: `Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Chile. En estos casos, garantizamos que las transferencias internacionales cumplen con los requisitos del Título V de la Ley 21.719, asegurando un nivel adecuado de protección mediante:

• Cláusulas contractuales estándar
• Certificaciones de privacidad reconocidas
• Evaluaciones de impacto cuando corresponda

Nuestros principales procesadores incluyen servicios de CRM (HubSpot), infraestructura cloud y herramientas de analítica.`,
  },
  {
    icon: Mail,
    title: "7. Cookies y Tecnologías de Seguimiento",
    content: `Nuestro sitio web utiliza cookies y tecnologías similares para:

• **Cookies esenciales**: Necesarias para el funcionamiento del sitio
• **Cookies analíticas**: Para entender cómo interactúas con nuestro contenido (Google Analytics)
• **Cookies de marketing**: Para personalizar comunicaciones (HubSpot tracking)

Puedes configurar tu navegador para rechazar cookies no esenciales. La desactivación de cookies esenciales puede afectar la funcionalidad del sitio.`,
  },
];

const PoliticaPrivacidad = () => {
  usePageMeta({
    title: "Política de Privacidad | Revops LATAM",
    description: "Política de privacidad y protección de datos personales de Revops LATAM, conforme a la Ley 21.719 de Chile.",
    path: "/politica-de-privacidad",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0D0D1A" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(190,24,105,0.12)", border: "1px solid rgba(190,24,105,0.25)" }}
          >
            <Shield size={16} style={{ color: "#BE1869" }} />
            <span className="text-[13px] font-medium" style={{ color: "#BE1869" }}>
              Ley 21.719 · Chile
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            En Revops LATAM nos comprometemos con la protección de tus datos personales.
            Esta política describe cómo recopilamos, usamos y protegemos tu información,
            en cumplimiento de la Ley 21.719 sobre Protección de Datos Personales de Chile.
          </p>
          <p className="mt-4 text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Última actualización: Marzo 2026
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-24 px-6">
        <div className="max-w-[800px] mx-auto space-y-8">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={i}
                className="rounded-2xl p-6 md:p-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(190,24,105,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#BE1869" }} />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-white pt-1.5">
                    {s.title}
                  </h2>
                </div>
                <div
                  className="text-[14px] leading-relaxed whitespace-pre-line pl-14"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  dangerouslySetInnerHTML={{
                    __html: s.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:rgba(255,255,255,0.85)">$1</strong>'),
                  }}
                />
              </article>
            );
          })}

          {/* Contact / DPO */}
          <article
            className="rounded-2xl p-6 md:p-8 text-center"
            style={{
              background: "rgba(190,24,105,0.06)",
              border: "1px solid rgba(190,24,105,0.15)",
            }}
          >
            <h2 className="text-lg font-semibold text-white mb-3">
              Contacto del Responsable de Datos
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Si tienes preguntas sobre esta política o deseas ejercer tus derechos, contáctanos:
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-[14px] text-white font-medium">Revops LATAM SpA</p>
              <a
                href="mailto:contacto@revopslatam.com"
                className="text-[14px] underline transition-colors hover:text-white"
                style={{ color: "#BE1869" }}
              >
                contacto@revopslatam.com
              </a>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Santiago, Chile
              </p>
            </div>
          </article>

          {/* Disclaimer */}
          <p className="text-[12px] text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            Esta política puede ser actualizada periódicamente. Te notificaremos de cambios
            significativos a través de nuestro sitio web. La versión vigente siempre estará
            disponible en esta página.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidad;
