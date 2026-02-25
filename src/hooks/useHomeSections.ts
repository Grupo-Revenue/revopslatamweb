import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface HomeSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  image_url: string | null;
  background_image_url: string | null;
  is_visible: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
}

type SectionsMap = Record<string, HomeSection>;

export function useHomeSections() {
  const [sections, setSections] = useState<SectionsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      // Fetch home page by slug "/"
      const { data: page } = await supabase
        .from("site_pages")
        .select("id")
        .eq("slug", "/")
        .eq("is_published", true)
        .single();

      if (!page) {
        setLoading(false);
        return;
      }

      const { data: sectionRows } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", page.id)
        .eq("is_visible", true)
        .order("sort_order");

      if (sectionRows) {
        const map: SectionsMap = {};
        for (const row of sectionRows) {
          map[row.section_key] = {
            ...row,
            metadata: (row.metadata as Record<string, unknown>) ?? null,
          };
        }
        setSections(map);
      }
      setLoading(false);
    };

    fetchSections();
  }, []);

  const getSection = (key: string): HomeSection | undefined => sections[key];
  const getMeta = (key: string): Record<string, unknown> => 
    (sections[key]?.metadata as Record<string, unknown>) ?? {};

  return { sections, loading, getSection, getMeta };
}
