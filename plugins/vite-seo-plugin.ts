/**
 * Custom Vite plugin that generates per-route HTML files at build time.
 * Each file contains the correct <title>, <meta>, <link canonical>, OG tags,
 * and JSON-LD structured data so search engines see them without executing JS.
 *
 * This is a lightweight alternative to full pre-rendering (no headless browser needed).
 */
import type { Plugin } from "vite";
import { PAGE_SEO } from "../src/lib/seo-config";

const BASE_URL = "https://revopslatamweb.lovable.app";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed8de748-17bb-4794-bd83-942f221cb1e1/id-preview-a1ce22e9--4814bcb9-c9f2-44d2-8ea5-4ce10dee1e68.lovable.app-1772049755037.png";

interface BreadcrumbItem {
  name: string;
  url: string;
}

function getBreadcrumbs(path: string, title: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ name: "Inicio", url: `${BASE_URL}/` }];
  if (path !== "/") {
    crumbs.push({ name: title.split(" | ")[0].split(" — ")[0], url: `${BASE_URL}${path}` });
  }
  return crumbs;
}

function breadcrumbJsonLd(crumbs: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  });
}

function serviceJsonLd(title: string, description: string, path: string): string | null {
  // Only add Service schema for service pages
  const servicePaths = [
    "/revops-checkup", "/diagnostico-revops", "/motor-de-ingresos",
    "/diseño-de-procesos", "/onboarding-hubspot", "/implementacion-hubspot",
    "/personalizacion-crm", "/integraciones-desarrollo",
    "/revops-as-a-service", "/marketing-ops", "/soporte-hubspot",
    "/potencia-con-ia",
  ];
  if (!servicePaths.includes(path)) return null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title.split(" | ")[0].split(" — ")[0],
    description,
    provider: {
      "@type": "ProfessionalService",
      name: "Revops LATAM",
      url: BASE_URL,
    },
    areaServed: [
      { "@type": "Country", "name": "Chile" },
      { "@type": "Country", "name": "Colombia" },
      { "@type": "Country", "name": "México" },
      { "@type": "Country", "name": "Perú" },
    ],
    serviceType: "Revenue Operations Consulting",
    url: `${BASE_URL}${path}`,
  });
}

export default function seoPlugin(): Plugin {
  return {
    name: "seo-html-generator",
    apply: "build",
    async generateBundle(_, bundle) {
      // Find the main index.html in the bundle
      const indexHtml = bundle["index.html"];
      if (!indexHtml || indexHtml.type !== "asset") return;

      const template = (indexHtml as any).source as string;

      for (const [routePath, seo] of Object.entries(PAGE_SEO)) {
        if (routePath === "/") continue; // index.html handles /

        const fullTitle = seo.title.includes("Revops LATAM")
          ? seo.title
          : `${seo.title} | Revops LATAM`;
        const canonical = `${BASE_URL}${routePath}`;
        const crumbs = getBreadcrumbs(routePath, fullTitle);
        const serviceLd = serviceJsonLd(fullTitle, seo.description, routePath);

        // Build additional head content
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
          // Hreflang
          `<link rel="alternate" hreflang="es-CL" href="${canonical}">`,
          `<link rel="alternate" hreflang="es-419" href="${canonical}">`,
          `<link rel="alternate" hreflang="x-default" href="${canonical}">`,
          // Breadcrumb JSON-LD
          `<script type="application/ld+json">${breadcrumbJsonLd(crumbs)}</script>`,
          serviceLd ? `<script type="application/ld+json">${serviceLd}</script>` : "",
        ]
          .filter(Boolean)
          .join("\n  ");

        // Replace existing title and insert our SEO tags before </head>
        let html = template
          .replace(/<title>.*?<\/title>/, "") // remove original title
          .replace("</head>", `  ${headInsert}\n</head>`);

        // Determine file path — e.g. /nosotros → nosotros/index.html
        const cleanPath = routePath.startsWith("/") ? routePath.slice(1) : routePath;
        const fileName = `${cleanPath}/index.html`;

        this.emitFile({
          type: "asset",
          fileName,
          source: html,
        });
      }

      // Also update the root index.html with hreflang + breadcrumb
      const rootSeo = PAGE_SEO["/"];
      if (rootSeo) {
        const rootInsert = [
          `<link rel="canonical" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-CL" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-419" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`,
        ].join("\n  ");

        (indexHtml as any).source = template.replace(
          "</head>",
          `  ${rootInsert}\n</head>`
        );
      }
    },
  };
}
