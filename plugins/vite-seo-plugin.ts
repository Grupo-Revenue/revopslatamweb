/**
 * Vite plugin: generates per-route HTML files at build time with correct
 * <title>, <meta>, <link canonical>, hreflang, JSON-LD structured data,
 * AND visible text content so crawlers / fetch tools can read the page
 * without executing JavaScript.
 */
import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://revopslatam.com";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed8de748-17bb-4794-bd83-942f221cb1e1/id-preview-a1ce22e9--4814bcb9-c9f2-44d2-8ea5-4ce10dee1e68.lovable.app-1772049755037.png";

const SERVICE_PATHS = new Set([
  "/revops-checkup", "/diagnostico-revops", "/motor-de-ingresos",
  "/diseño-de-procesos", "/onboarding-hubspot", "/implementacion-hubspot",
  "/personalizacion-crm", "/integraciones-desarrollo",
  "/revops-as-a-service", "/marketing-ops", "/soporte-hubspot", "/potencia-con-ia",
]);

/* ------------------------------------------------------------------ */
/*  Static content blocks per route — shown when JS is not available  */
/* ------------------------------------------------------------------ */
const PAGE_CONTENT: Record<string, { heading: string; sections: string[] }> = {
  "/": {
    heading: "Revops LATAM — Arquitectos del Revenue",
    sections: [
      "Tu empresa creció. Tu motor de ingresos, no.",
      "Cuando el crecimiento llega más rápido que los procesos, el caos no es señal de fracaso. Es señal de que necesitas una pista mejor diseñada.",
      "Revenue Operations · LATAM — Consultora de Revenue Operations y HubSpot Platinum Partner en Chile y Latinoamérica.",
      "Diseñamos, implementamos y operamos el motor de ingresos de empresas B2B.",
      "Servicios: Diagnóstico RevOps, Diseño de Procesos, Implementación HubSpot, Personalización CRM, Integraciones y Desarrollo, RevOps as a Service, Marketing Ops, Soporte HubSpot, IA para Revenue.",
      "+14 años de experiencia · +200 proyectos HubSpot · Presencia en Chile, Colombia, México y Perú.",
    ],
  },
  "/nosotros": {
    heading: "Nosotros — Quiénes Somos | Revops LATAM",
    sections: [
      "Somos Arquitectos del Revenue.",
      "Creemos que el orden, el diseño y el crecimiento sano son formas concretas de hacer bien en el mundo.",
      "Más de 14 años operando HubSpot y construyendo sistemas de revenue para empresas B2B en Latinoamérica.",
      "HubSpot Platinum Partner — equipo multidisciplinario en Revenue Operations, CRM, automatización y datos.",
    ],
  },
  "/que-hacemos": {
    heading: "Qué Hacemos — Servicios de Revenue Operations | Revops LATAM",
    sections: [
      "Diagnóstico, diseño, implementación y operación de tu motor de ingresos.",
      "Servicios RevOps end-to-end con HubSpot como plataforma central.",
      "Conoce tu Pista: RevOps Checkup, Diagnóstico RevOps, Motor de Ingresos.",
      "Diseña y Construye: Diseño de Procesos, Onboarding HubSpot, Implementación HubSpot, Personalización CRM, Integraciones y Desarrollo.",
      "Opera tu Pista: RevOps as a Service, Marketing Ops, Soporte HubSpot.",
      "Potencia con IA: Inteligencia Artificial aplicada a tu operación de revenue.",
    ],
  },
  "/hubspot-partner-chile": {
    heading: "Partner HubSpot Chile y LATAM — Consultora Platinum | Revops LATAM",
    sections: [
      "Revops LATAM es HubSpot Platinum Partner en Chile y LATAM.",
      "Convertimos HubSpot en un sistema de revenue: procesos, automatización y datos alineados.",
      "Implementación, personalización, soporte y operación continua de HubSpot para empresas B2B.",
    ],
  },
  "/para-ceos-y-gerentes-generales": {
    heading: "RevOps para CEOs y Gerentes Generales | Revops LATAM",
    sections: [
      "Visibilidad completa de tu pipeline y forecast.",
      "Toma decisiones de revenue con datos confiables, no con intuición.",
    ],
  },
  "/para-directores-comerciales": {
    heading: "RevOps para Directores Comerciales | Revops LATAM",
    sections: [
      "Pipeline claro, forecast confiable y procesos de venta estandarizados.",
      "Convierte tu equipo comercial en una máquina predecible.",
    ],
  },
  "/para-directores-y-gerentes-de-marketing": {
    heading: "RevOps para Directores de Marketing | Revops LATAM",
    sections: [
      "Demuestra el impacto de marketing en pipeline y revenue.",
      "Atribución real, MQLs que se convierten y reportes que hablan de ingresos.",
    ],
  },
  "/para-customer-success-y-servicio-al-cliente": {
    heading: "RevOps para Customer Success y Servicio | Revops LATAM",
    sections: [
      "Retención, NPS y alertas de churn integradas a tu motor de revenue.",
      "Convierte servicio al cliente en un generador de ingresos.",
    ],
  },
  "/para-los-que-operan-el-negocio-sin-el-titulo": {
    heading: "RevOps para Operaciones | Revops LATAM",
    sections: [
      "Si operas el negocio sin el título formal, esta es tu guía.",
      "Procesos, datos y herramientas alineadas para escalar sin caos.",
    ],
  },
  "/conoce-tu-pista": {
    heading: "Conoce tu Pista — Diagnóstico RevOps | Revops LATAM",
    sections: [
      "Evalúa el estado de tu operación de revenue.",
      "Tres niveles de diagnóstico para entender dónde estás y hacia dónde ir.",
    ],
  },
  "/revops-checkup": {
    heading: "RevOps Checkup — Evaluación Rápida | Revops LATAM",
    sections: [
      "Evaluación rápida del estado de tu operación comercial.",
      "Identifica gaps críticos en procesos, datos y tecnología en días.",
    ],
  },
  "/diagnostico-revops": {
    heading: "Diagnóstico RevOps — Análisis Profundo | Revops LATAM",
    sections: [
      "Análisis profundo de procesos, datos y tecnología.",
      "Mapa completo de tu operación de revenue con recomendaciones accionables.",
    ],
  },
  "/motor-de-ingresos": {
    heading: "Motor de Ingresos — Diagnóstico Integral | Revops LATAM",
    sections: [
      "Diagnóstico integral de tu sistema de revenue.",
      "Desde la generación de demanda hasta la retención, todo conectado.",
    ],
  },
  "/diseña-y-construye-tu-pista": {
    heading: "Diseña y Construye tu Pista | Revops LATAM",
    sections: [
      "Diseño de procesos, implementación HubSpot y personalización CRM.",
      "Construimos la infraestructura de tu motor de ingresos.",
    ],
  },
  "/diseño-de-procesos": {
    heading: "Diseño de Procesos Comerciales | Revops LATAM",
    sections: [
      "Flujos comerciales alineados a tu estrategia.",
      "Diseñamos procesos de marketing, ventas y servicio que escalan.",
    ],
  },
  "/onboarding-hubspot": {
    heading: "Onboarding HubSpot — Puesta en Marcha | Revops LATAM",
    sections: [
      "Puesta en marcha guiada de HubSpot.",
      "Configuración inicial correcta para que tu equipo arranque productivo desde el día uno.",
    ],
  },
  "/implementacion-hubspot": {
    heading: "Implementación HubSpot Avanzada | Revops LATAM",
    sections: [
      "Configuración avanzada y personalizada de HubSpot.",
      "Implementación que respeta tus procesos y maximiza el valor de la plataforma.",
    ],
  },
  "/personalizacion-crm": {
    heading: "Personalización CRM — HubSpot a tu Medida | Revops LATAM",
    sections: [
      "Adapta HubSpot a tus procesos únicos.",
      "Objetos personalizados, pipelines a medida y automatizaciones que reflejan tu operación real.",
    ],
  },
  "/integraciones-desarrollo": {
    heading: "Integraciones y Desarrollo | Revops LATAM",
    sections: [
      "Conecta HubSpot con tus herramientas.",
      "APIs, integraciones nativas y desarrollo custom para un ecosistema sincronizado.",
    ],
  },
  "/opera-tu-pista": {
    heading: "Opera tu Pista — Operación RevOps Continua | Revops LATAM",
    sections: [
      "Equipo dedicado de operaciones de revenue.",
      "RevOps as a Service, Marketing Ops y soporte HubSpot continuo.",
    ],
  },
  "/revops-as-a-service": {
    heading: "RevOps as a Service | Revops LATAM",
    sections: [
      "Equipo dedicado de Revenue Operations desde el primer mes.",
      "Sprints quincenales, sin curva de aprendizaje, resultados medibles.",
    ],
  },
  "/marketing-ops": {
    heading: "Marketing Ops | Revops LATAM",
    sections: [
      "Operación técnica de marketing.",
      "Automatización, datos, workflows y reportes que demuestran impacto en pipeline.",
    ],
  },
  "/soporte-hubspot": {
    heading: "Soporte HubSpot | Revops LATAM",
    sections: [
      "Soporte técnico para HubSpot sin fricciones.",
      "Elige, contrata y opera en 24 horas. Sin reuniones previas.",
    ],
  },
  "/potencia-con-ia": {
    heading: "IA para Revenue | Revops LATAM",
    sections: [
      "Automatización inteligente y predicción integrada a HubSpot.",
      "IA que impacta tu operación de revenue, no herramientas aisladas.",
    ],
  },
};

/**
 * Build an HTML block with real text content that lives inside <div id="root">
 * so fetchers / crawlers see it. React will hydrate over it.
 */
function buildStaticContent(routePath: string, seo: { title: string; description: string }): string {
  const content = PAGE_CONTENT[routePath];
  if (!content) {
    // Fallback: use SEO title + description
    return `<h1>${seo.title}</h1><p>${seo.description}</p>`;
  }
  const paragraphs = content.sections.map((s) => `<p>${s}</p>`).join("\n      ");
  return `<h1>${content.heading}</h1>\n      ${paragraphs}`;
}

export default function seoPlugin(): Plugin {
  return {
    name: "seo-html-generator",
    apply: "build",
    closeBundle: {
      order: "post",
      sequential: true,
      async handler() {
        let PAGE_SEO: Record<string, { title: string; description: string }>;
        try {
          const mod = await import("../src/lib/seo-config.ts");
          PAGE_SEO = mod.PAGE_SEO;
        } catch {
          console.warn("[seo-plugin] Could not load seo-config, skipping HTML generation");
          return;
        }

        const distDir = path.resolve(process.cwd(), "dist");
        const templatePath = path.join(distDir, "index.html");
        if (!fs.existsSync(templatePath)) return;

        const template = fs.readFileSync(templatePath, "utf-8");
        let generated = 0;

        for (const [routePath, seo] of Object.entries(PAGE_SEO)) {
          if (routePath === "/") continue;

          const fullTitle = seo.title.includes("Revops LATAM")
            ? seo.title
            : `${seo.title} | Revops LATAM`;
          const canonical = `${BASE_URL}${routePath}`;

          // Breadcrumb
          const crumbs = [
            { name: "Inicio", url: `${BASE_URL}/` },
            { name: fullTitle.split(" | ")[0].split(" — ")[0], url: canonical },
          ];
          const breadcrumbLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((c, i) => ({
              "@type": "ListItem", position: i + 1, name: c.name, item: c.url,
            })),
          });

          // Service schema
          let serviceLd = "";
          if (SERVICE_PATHS.has(routePath)) {
            serviceLd = `\n  <script type="application/ld+json">${JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: fullTitle.split(" | ")[0],
              description: seo.description,
              provider: { "@type": "ProfessionalService", name: "Revops LATAM", url: BASE_URL },
              areaServed: [
                { "@type": "Country", name: "Chile" },
                { "@type": "Country", name: "Colombia" },
                { "@type": "Country", name: "México" },
                { "@type": "Country", name: "Perú" },
              ],
              url: canonical,
            })}</script>`;
          }

          const headInsert = [
            `<title>${fullTitle}</title>`,
            `<meta name="description" content="${seo.description}">`,
            `<link rel="canonical" href="${canonical}">`,
            `<meta property="og:title" content="${fullTitle}">`,
            `<meta property="og:description" content="${seo.description}">`,
            `<meta property="og:url" content="${canonical}">`,
            `<meta property="og:image" content="${DEFAULT_OG_IMAGE}">`,
            `<meta name="twitter:title" content="${fullTitle}">`,
            `<meta name="twitter:description" content="${seo.description}">`,
            `<link rel="alternate" hreflang="es-CL" href="${canonical}">`,
            `<link rel="alternate" hreflang="es-419" href="${canonical}">`,
            `<link rel="alternate" hreflang="x-default" href="${canonical}">`,
            `<script type="application/ld+json">${breadcrumbLd}</script>`,
            serviceLd,
          ].filter(Boolean).join("\n  ");

          // Inject static text content inside <div id="root">
          const staticContent = buildStaticContent(routePath, seo);

          let html = template
            .replace(/<title>.*?<\/title>/, "")
            .replace("</head>", `  ${headInsert}\n</head>`)
            .replace(
              '<div id="root"></div>',
              `<div id="root">\n    <div class="seo-static-content" style="max-width:900px;margin:0 auto;padding:60px 24px;font-family:Lexend,sans-serif;color:#e0e0e0;background:#0D0D1A">\n      ${staticContent}\n    </div>\n  </div>`
            );

          const cleanPath = routePath.startsWith("/") ? routePath.slice(1) : routePath;
          const dir = path.join(distDir, cleanPath);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
          generated++;
        }

        // Update root index.html with hreflang + static content
        const rootSeo = PAGE_SEO["/"];
        const rootStaticContent = rootSeo ? buildStaticContent("/", rootSeo) : "";
        const rootInsert = [
          `<link rel="canonical" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-CL" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-419" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`,
        ].join("\n  ");

        let rootHtml = fs.readFileSync(templatePath, "utf-8")
          .replace("</head>", `  ${rootInsert}\n</head>`);

        if (rootStaticContent) {
          rootHtml = rootHtml.replace(
            '<div id="root"></div>',
            `<div id="root">\n    <div class="seo-static-content" style="max-width:900px;margin:0 auto;padding:60px 24px;font-family:Lexend,sans-serif;color:#e0e0e0;background:#0D0D1A">\n      ${rootStaticContent}\n    </div>\n  </div>`
          );
        }

        fs.writeFileSync(templatePath, rootHtml);
        console.log(`[seo-plugin] Generated ${generated} per-route HTML files with static content + updated root index.html`);
      },
    },
  };
}
