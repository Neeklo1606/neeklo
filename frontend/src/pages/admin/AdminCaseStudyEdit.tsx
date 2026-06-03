import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { adminGetCaseStudy, adminUpdateCaseStudy, adminDeleteCaseStudy } from "@/lib/api";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликован" },
  { value: "archived", label: "Архив" },
];

export default function AdminCaseStudyEdit() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");
  const [body, setBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  useEffect(() => {
    if (!id) return;
    adminGetCaseStudy(Number(id)).then((r) => {
      setLoading(false);
      if (r.success && r.data) {
        const d = r.data;
        setData(d);
        setSlug(d.slug ?? "");
        setTitle(d.title ?? "");
        setShortDesc(d.short_description ?? "");
        setClient(d.client ?? "");
        setIndustry(d.industry ?? "");
        setProblem(d.problem ?? "");
        setSolution(d.solution ?? "");
        setResult(d.result ?? "");
        setBody(d.body ?? "");
        setVideoUrl(d.video_url ?? "");
        setStatus(d.status ?? "draft");
        setPublishedAt(d.published_at ? d.published_at.slice(0, 16) : "");
        setSeoTitle(d.seo_title ?? "");
        setSeoDesc(d.seo_description ?? "");
      } else {
        setError(r.message || "Ошибка загрузки");
      }
    });
  }, [id]);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setError(null);
    const r = await adminUpdateCaseStudy(data.id, {
      slug, title,
      short_description: shortDesc || null,
      client: client || null,
      industry: industry || null,
      problem: problem || null,
      solution: solution || null,
      result: result || null,
      body: body || null,
      video_url: videoUrl || null,
      status,
      published_at: publishedAt || null,
      seo_title: seoTitle || null,
      seo_description: seoDesc || null,
    });
    setSaving(false);
    if (r.success && r.data) {
      setData(r.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(r.message || "Ошибка сохранения");
    }
  };

  const destroy = async () => {
    if (!data || !confirm(`Удалить кейс «${data.title}»? Это действие необратимо.`)) return;
    setDeleting(true);
    const r = await adminDeleteCaseStudy(data.id);
    if (r.success) {
      window.location.href = "/admin/case-studies";
    } else {
      setDeleting(false);
      setError(r.message || "Ошибка удаления");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">
      Загрузка…
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 text-white">
      <p className="text-red-400">{error || "Кейс не найден"}</p>
      <Link to="/admin/case-studies" className="text-cyan-400 underline">← Все кейсы</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin/case-studies" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Все кейсы
          </Link>
          <div className="flex items-center gap-2">
            {data.slug && (
              <a
                href={`/cases/${data.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Просмотр
              </a>
            )}
            <button
              onClick={destroy}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Сохранение…" : saved ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">{error}</p>}

        <div className="space-y-5">
          <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide">Основное</h2>
            <Field label="Slug">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
            </Field>
            <Field label="Заголовок *">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
            </Field>
            <Field label="Краткое описание">
              <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} className={input} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Клиент">
                <input value={client} onChange={(e) => setClient(e.target.value)} className={input} />
              </Field>
              <Field label="Индустрия">
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} className={input} />
              </Field>
            </div>
          </section>

          <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide">Контент</h2>
            <Field label="Задача / Проблема">
              <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} className={input} />
            </Field>
            <Field label="Решение">
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} className={input} />
            </Field>
            <Field label="Результат">
              <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={3} className={input} />
            </Field>
            <Field label="Тело (HTML / Markdown)">
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className={`${input} font-mono text-sm`} />
            </Field>
            <Field label="URL видео">
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" className={input} />
            </Field>
          </section>

          <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide">Публикация</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Статус">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Дата публикации">
                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={input} />
              </Field>
            </div>
          </section>

          <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide">SEO</h2>
            <Field label="SEO заголовок">
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={input} />
            </Field>
            <Field label="SEO описание">
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} className={input} />
            </Field>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Сохранение…" : saved ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

const input = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
