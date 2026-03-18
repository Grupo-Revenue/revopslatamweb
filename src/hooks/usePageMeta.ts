import { useEffect } from "react";

const BASE_URL = "https://revopslatamweb.lovable.app";
const DEFAULT_OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed8de748-17bb-4794-bd83-942f221cb1e1/id-preview-a1ce22e9--4814bcb9-c9f2-44d2-8ea5-4ce10dee1e68.lovable.app-1772049755037.png";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

function setMeta(name: string, content: string, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (el) {
    el.content = content;
  } else {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    el.content = content;
    document.head.appendChild(el);
  }
}

function setLink(rel: string, href: string, attrs?: Record<string, string>) {
  const selector = attrs
    ? `link[rel="${rel}"][hreflang="${attrs.hreflang ?? ""}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement("link");
    el.rel = rel;
    el.href = href;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  const json = JSON.stringify(data);
  if (el) {
    el.textContent = json;
  } else {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = json;
    document.head.appendChild(el);
  }
}

export function usePageMeta({ title, description, path, ogImage, noindex }: PageMeta) {
  useEffect(() => {
    const fullTitle = title.includes("Revops LATAM") ? title : `${title} | Revops LATAM`;
    const canonical = `${BASE_URL}${path}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    // Standard meta
    setMeta("description", description);

    // Canonical
    setLink("canonical", canonical);

    // Hreflang
    setLink("alternate", canonical, { hreflang: "es-CL" });
    setLink("alternate", canonical, { hreflang: "es-419" });
    setLink("alternate", canonical, { hreflang: "x-default" });

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:image", image, "property");
    setMeta("og:type", "website", "property");

    // Twitter
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", image, "name");

    // BreadcrumbList JSON-LD
    const crumbs = [{ name: "Inicio", url: `${BASE_URL}/` }];
    if (path !== "/") {
      crumbs.push({ name: fullTitle.split(" | ")[0].split(" — ")[0], url: canonical });
    }
    setJsonLd("seo-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    });

    // Robots
    if (noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }
  }, [title, description, path, ogImage, noindex]);
}
