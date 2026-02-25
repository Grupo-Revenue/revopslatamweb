import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { SectionMetadataStyles, ResponsiveElementStyles } from "@/components/admin/SectionStyleEditor";

type PageSection = Tables<"page_sections">;

type SectionsMap = Record<string, PageSection>;

interface PageContentContextType {
  sections: SectionsMap;
  loading: boolean;
}

const PageContentContext = createContext<PageContentContextType>({
  sections: {},
  loading: true,
});

/** Fetches all visible sections for a page by slug and provides them via context */
export function PageContentProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [sections, setSections] = useState<SectionsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get page by slug
      const { data: page } = await supabase
        .from("site_pages")
        .select("id")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (!page) {
        setLoading(false);
        return;
      }

      // Get visible sections
      const { data: secs } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", page.id)
        .eq("is_visible", true)
        .order("sort_order");

      const map: SectionsMap = {};
      (secs ?? []).forEach((s) => {
        map[s.section_key] = s;
      });
      setSections(map);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  return (
    <PageContentContext.Provider value={{ sections, loading }}>
      {children}
    </PageContentContext.Provider>
  );
}

/** Returns a specific section's data by key, with optional fallback values */
export function useSection(key: string) {
  const { sections, loading } = useContext(PageContentContext);
  const section = sections[key] ?? null;

  return {
    loading,
    title: section?.title ?? null,
    subtitle: section?.subtitle ?? null,
    body: section?.body ?? null,
    ctaText: section?.cta_text ?? null,
    ctaUrl: section?.cta_url ?? null,
    imageUrl: section?.image_url ?? null,
    backgroundImageUrl: section?.background_image_url ?? null,
    isVisible: section?.is_visible ?? true,
    metadata: (section?.metadata as Record<string, unknown>) ?? {},
    section,
  };
}

/** Helper to get element styles from metadata for a given element and device */
export function getElementStyle(
  metadata: Record<string, unknown>,
  element: string,
  isMobile: boolean
): React.CSSProperties {
  const styles = (metadata?.styles as SectionMetadataStyles) ?? {};
  const elStyles = styles[element as keyof SectionMetadataStyles];

  if (!elStyles || element === "background") return {};

  const responsive = elStyles as ResponsiveElementStyles;
  const device = isMobile ? responsive.mobile : responsive.desktop;
  const fallback = responsive.desktop; // fallback to desktop if mobile not set

  const active = { ...fallback, ...device };
  const result: React.CSSProperties = {};

  if (active?.fontSize) result.fontSize = active.fontSize;
  if (active?.fontWeight) result.fontWeight = active.fontWeight as any;
  if (active?.color) result.color = active.color;
  if (active?.gradient) {
    result.background = active.gradient;
    result.WebkitBackgroundClip = "text";
    result.WebkitTextFillColor = "transparent";
    result.backgroundClip = "text";
  }

  return result;
}

/** Get background styles from metadata */
export function getBackgroundStyle(
  metadata: Record<string, unknown>
): React.CSSProperties {
  const styles = (metadata?.styles as SectionMetadataStyles) ?? {};
  const bg = styles.background;
  if (!bg) return {};

  const result: React.CSSProperties = {};
  if (bg.gradient) result.background = bg.gradient;
  else if (bg.color) result.backgroundColor = bg.color;
  return result;
}
