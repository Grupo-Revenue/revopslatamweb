import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Palette, Image } from "lucide-react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ pages: 0, sections: 0, styles: 0, media: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [pages, sections, styles, media] = await Promise.all([
        supabase.from("site_pages").select("id", { count: "exact", head: true }),
        supabase.from("page_sections").select("id", { count: "exact", head: true }),
        supabase.from("site_styles").select("id", { count: "exact", head: true }),
        supabase.from("media_library").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        pages: pages.count ?? 0,
        sections: sections.count ?? 0,
        styles: styles.count ?? 0,
        media: media.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Páginas", value: counts.pages, icon: FileText, color: "text-blue-400" },
    { label: "Secciones", value: counts.sections, icon: FileText, color: "text-emerald-400" },
    { label: "Estilos", value: counts.styles, icon: Palette, color: "text-purple-400" },
    { label: "Archivos", value: counts.media, icon: Image, color: "text-orange-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <span className="text-zinc-400 text-sm">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-2">Bienvenido al CMS</h2>
        <p className="text-zinc-400 text-sm">
          Desde aquí puedes administrar las páginas, secciones de contenido, estilos visuales
          y la biblioteca de medios de tu sitio web.
        </p>
      </div>
    </div>
  );
}
