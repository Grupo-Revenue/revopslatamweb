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

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement("link");
    el.rel = rel;
    el.href = href;
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

    // Robots
    if (noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    return () => {
      // Cleanup not needed — next page call will override
    };
  }, [title, description, path, ogImage, noindex]);
}
