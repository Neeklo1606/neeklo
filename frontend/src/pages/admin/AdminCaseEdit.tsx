import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getCaseById,
  updateCase,
  uploadCaseMedia,
  deleteCaseMedia,
  reorderCaseMedia,
} from "@/lib/api";
import { ArrowLeft, Image, Film, Trash2, ChevronUp, ChevronDown, Upload, Loader2 } from "lucide-react";

export default function AdminCaseEdit() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // 'image'|'video'

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    getCaseById(Number(id)).then((r) => {
      setLoading(false);
      if (r.success && r.data) {
        const d = r.data;
        setData(d);
        setSlug(d.slug || "");
        setTitle(d.title || "");
        setCategory(d.category || "");
        setYear(d.year ?? "");
        setFeatured(!!d.featured);
        setDescription(d.description || "");
        setMedia(d.media || []);
      } else setError(r.message || "Ошибка");
    });
  }, [id]);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const r = await updateCase(data.id, {
      slug,
      title,
      category: category || undefined,
      year: year === "" ? undefined : Number(year),
      featured,
      description: description || undefined,
    });
    setSaving(false);
    if (r.success && r.data) setData(r.data);
    else setError(r.message || "Ошибка сохранения");
  };

  const images = media.filter((m) => m.type === "image").sort((a, b) => a.order - b.order);
  const video = media.filter((m) => m.type === "video")[0];

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !data) return;
    e.target.value = "";
    setUploading("image");
    const r = await uploadCaseMedia(data.id, f, "image");
    setUploading(null);
    if (r.success && r.data) setMedia((p) => [...p, r.data]);
    else setError(r.message || "Ошибка загрузки");
  };

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !data) return;
    e.target.value = "";
    setUploading("video");
    const r = await uploadCaseMedia(data.id, f, "video");
    setUploading(null);
    if (r.success && r.data) setMedia((p) => [...p, r.data]);
    else setError(r.message || "Ошибка загрузки");
  };

  const handleDelete = async (m: any) => {
    const r = await deleteCaseMedia(m.id);
    if (r.success) setMedia((p) => p.filter((x) => x.id !== m.id));
    else setError(r.message || "Ошибка удаления");
  };

  const move = async (arr: any[], from: number, delta: number) => {
    const to = from + delta;
    if (to < 0 || to >= arr.length) return;
    const next = [...arr];
    [next[from], next[to]] = [next[to], next[from]];
    const order = next.map((x) => x.id);
    const r = await reorderCaseMedia(data.id, order);
    if (r.success) setMedia((p) => p.map((x) => (x.type === "image" ? (next.find((n) => n.id === x.id) || x) : x)));
    else setError(r.message || "Ошибка сортировки");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }
  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        <p className="text-red-400">{error}</p>
        <Link to="/admin/cases" className="text-cyan-400 mt-4 inline-block">← К списку</Link>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/admin/cases" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> К списку
        </Link>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Основные поля */}
        <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Основное</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-1">slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">Название</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/60 block mb-1">Категория</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div>
                <label className="text-sm text-white/60 block mb-1">Год</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10" />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span>В избранном</span>
            </label>
            <div>
              <label className="text-sm text-white/60 block mb-1">Описание</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 resize-none" />
            </div>
            <button onClick={save} disabled={saving} className="px-6 py-2 rounded-xl bg-cyan-500 text-black font-medium disabled:opacity-50">
              {saving ? "Сохранение…" : "Сохранить"}
            </button>
          </div>
        </section>

        {/* Медиа */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl shadow-black/50">
          <h2 className="text-lg font-semibold mb-4">Медиа</h2>

          {/* Изображения (1–5) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Изображения (до 5)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {images.map((m, i) => (
                <div key={m.id} className="relative group w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img
                    src={m.url}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    <button onClick={() => move(images, i, -1)} disabled={i === 0} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30" title="Выше"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => move(images, i, 1)} disabled={i === images.length - 1} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30" title="Ниже"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m)} className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-cyan-400/50 hover:bg-white/5 transition-colors">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUploadImage} className="hidden" disabled={!!uploading} />
                  {uploading === "image" ? <Loader2 className="w-6 h-6 animate-spin text-white/60" /> : <Upload className="w-6 h-6 text-white/50" />}
                </label>
              )}
            </div>
          </div>

          {/* Видео (1) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium">Видео (1, mp4/webm, до 50 MB)</span>
            </div>
            {video ? (
              <div className="relative group max-w-xs">
                <video src={video.url} controls className="w-full rounded-xl bg-black/50" />
                <button onClick={() => handleDelete(video)} className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500" title="Удалить"><Trash2 className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-violet-400/50 hover:bg-white/5 transition-colors">
                <input type="file" accept="video/mp4,video/webm" onChange={handleUploadVideo} className="hidden" disabled={!!uploading} />
                {uploading === "video" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-white/50" />}
                <span className="text-sm text-white/70">Загрузить видео</span>
              </label>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
