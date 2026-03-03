import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeSection } from "@/hooks/useHomeSections";

type SectionsMap = Record<string, HomeSection>;

type RealtimePayload = {
  new?: { page_id?: string; slug?: string };
  old?: { page_id?: string; slug?: string };
};

function mapSections(rows: HomeSection[]): SectionsMap {
  const map: SectionsMap = {};
  for (const row of rows) {
    map[row.section_key] = {
      ...row,
      metadata: (row.metadata as Record<string, unknown>) ?? null,
    };
  }
  return map;
}

/**
 * Generic hook to load page_sections for any page by slug.
 * Includes realtime sync so admin changes are reflected immediately in the front.
 */
export function usePageSections(slug: string) {
  const [sections, setSections] = useState<SectionsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let pageId: string | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchPublishedPage = async () => {
      const { data: page } = await supabase
        .from("site_pages")
        .select("id")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      return page?.id ?? null;
    };

    const fetchSections = async () => {
      if (!pageId) {
        if (active) setSections({});
        return;
      }

      const { data: rows } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", pageId)
        .eq("is_visible", true)
        .order("sort_order");

      if (!active) return;
      setSections(mapSections((rows ?? []) as HomeSection[]));
    };

    const refreshPageState = async () => {
      pageId = await fetchPublishedPage();
      if (!active) return;
      await fetchSections();
    };

    const bootstrap = async () => {
      setLoading(true);
      await refreshPageState();
      if (!active) return;

      channel = supabase
        .channel(`page-sections-${slug}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "page_sections" },
          (payload) => {
            const eventPayload = payload as unknown as RealtimePayload;
            const changedPageId = eventPayload.new?.page_id ?? eventPayload.old?.page_id;
            if (changedPageId && changedPageId === pageId) {
              void fetchSections();
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "site_pages" },
          (payload) => {
            const eventPayload = payload as unknown as RealtimePayload;
            const changedSlug = eventPayload.new?.slug ?? eventPayload.old?.slug;
            if (changedSlug === slug) {
              void refreshPageState();
            }
          }
        )
        .subscribe();

      setLoading(false);
    };

    void bootstrap();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [slug]);

  const getSection = (key: string): HomeSection | undefined => sections[key];
  const getMeta = (key: string): Record<string, unknown> =>
    (sections[key]?.metadata as Record<string, unknown>) ?? {};

  return { sections, loading, getSection, getMeta };
}
