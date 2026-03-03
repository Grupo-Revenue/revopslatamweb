import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Video } from "lucide-react";

interface TestimonialVideo {
  youtube_id: string;
  title: string;
  client: string;
  role?: string;
  thumbnail?: string;
}

export default function TestimonialsEditor({
  metadata,
  onChange,
}: {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const videos: TestimonialVideo[] = Array.isArray(metadata.videos)
    ? metadata.videos
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          youtube_id: typeof item.youtube_id === "string" ? item.youtube_id : "",
          title: typeof item.title === "string" ? item.title : "",
          client: typeof item.client === "string" ? item.client : "",
          role: typeof item.role === "string" ? item.role : "",
          thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : "",
        }))
    : [];

  const updateVideos = (updated: TestimonialVideo[]) => {
    onChange({ ...metadata, videos: updated });
  };

  const addVideo = () => {
    updateVideos([...videos, { youtube_id: "", title: "", client: "", role: "" }]);
  };

  const removeVideo = (index: number) => {
    updateVideos(videos.filter((_, i) => i !== index));
  };

  const updateVideo = (index: number, field: keyof TestimonialVideo, value: string) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    updateVideos(updated);
  };

  const getThumb = (id: string) =>
    id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5" />
          Videos de testimonios
        </Label>
        <button
          onClick={addVideo}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Agregar video
        </button>
      </div>

      {videos.length === 0 && (
        <div
          onClick={addVideo}
          className="border border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <Video className="h-6 w-6 mx-auto text-zinc-600 mb-2" />
          <p className="text-zinc-500 text-xs">Agrega videos de YouTube de tus casos de éxito</p>
          <p className="text-zinc-600 text-[10px] mt-1">Solo necesitas el ID del video de YouTube</p>
        </div>
      )}

      <div className="space-y-2">
        {videos.map((video, i) => (
          <div
            key={i}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail preview */}
              <div className="flex-shrink-0 w-24 h-14 rounded overflow-hidden bg-zinc-900 border border-zinc-700">
                {video.youtube_id ? (
                  <img
                    src={getThumb(video.youtube_id)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Video className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">ID de YouTube</Label>
                    <Input
                      value={video.youtube_id}
                      onChange={(e) => updateVideo(i, "youtube_id", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="ej: dQw4w9WgXcQ"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Título</Label>
                    <Input
                      value={video.title}
                      onChange={(e) => updateVideo(i, "title", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="Título del caso"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Cliente</Label>
                    <Input
                      value={video.client}
                      onChange={(e) => updateVideo(i, "client", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Rol / Empresa</Label>
                    <Input
                      value={video.role ?? ""}
                      onChange={(e) => updateVideo(i, "role", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="VP Comercial, TechCorp"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeVideo(i)}
                className="text-zinc-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                title="Eliminar video"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
