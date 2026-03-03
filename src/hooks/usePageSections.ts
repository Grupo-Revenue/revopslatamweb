import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeSection } from "@/hooks/useHomeSections";

type SectionsMap = Record<string, HomeSection>;

/**
 * Generic hook to load page_sections for any page by slug.
 */
export function usePageSections(slug: string) {
  const [sections, setSections] = useState<SectionsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
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

      const { data: rows } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", page.id)
        .eq("is_visible", true)
        .order("sort_order");

      if (rows) {
        const map: SectionsMap = {};
        for (const row of rows) {
          map[row.section_key] = {
            ...row,
            metadata: (row.metadata as Record<string, unknown>) ?? null,
          };
        }
        setSections(map);
      }
      setLoading(false);
    };

    fetch();
  }, [slug]);

  const getSection = (key: string): HomeSection | undefined => sections[key];
  const getMeta = (key: string): Record<string, unknown> =>
    (sections[key]?.metadata as Record<string, unknown>) ?? {};

  return { sections, loading, getSection, getMeta };
}
