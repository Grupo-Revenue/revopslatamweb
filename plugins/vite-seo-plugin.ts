/**
 * Vite plugin: generates per-route HTML files at build time with correct
 * <title>, <meta>, <link canonical>, hreflang, and JSON-LD structured data.
 * Google sees these tags without executing JS.
 */
import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://revopslatamweb.lovable.app";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed8de748-17bb-4794-bd83-942f221cb1e1/id-preview-a1ce22e9--4814bcb9-c9f2-44d2-8ea5-4ce10dee1e68.lovable.app-1772049755037.png";

const SERVICE_PATHS = new Set([
  "/revops-checkup", "/diagnostico-revops", "/motor-de-ingresos",
  "/diseño-de-procesos", "/onboarding-hubspot", "/implementacion-hubspot",
  "/personalizacion-crm", "/integraciones-desarrollo",
  "/revops-as-a-service", "/marketing-ops", "/soporte-hubspot", "/potencia-con-ia",
]);

export default function seoPlugin(): Plugin {
  return {
    name: "seo-html-generator",
    apply: "build",
    closeBundle: {
      order: "post",
      sequential: true,
      async handler() {
        // Dynamically import seo-config (compiled during build)
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

          let html = template
            .replace(/<title>.*?<\/title>/, "")
            .replace("</head>", `  ${headInsert}\n</head>`);

          const cleanPath = routePath.startsWith("/") ? routePath.slice(1) : routePath;
          const dir = path.join(distDir, cleanPath);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
          generated++;
        }

        // Update root index.html with hreflang
        const rootInsert = [
          `<link rel="canonical" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-CL" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="es-419" href="${BASE_URL}/">`,
          `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`,
        ].join("\n  ");
        const rootHtml = fs.readFileSync(templatePath, "utf-8").replace("</head>", `  ${rootInsert}\n</head>`);
        fs.writeFileSync(templatePath, rootHtml);

        console.log(`[seo-plugin] Generated ${generated} per-route HTML files + updated root index.html`);
      },
    },
  };
}
