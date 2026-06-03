import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetCaseStudies, adminCreateCaseStudy } from "@/lib/api";
import { Plus, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminCaseStudiesList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    adminGetCaseStudies({ per_page: 100 }).then((r) => {
      setLoading(false);
      if (r.success && r.data) setList(r.data);
      else setError(r.message || "Ошибка загрузки");
    });
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newSlug.trim() || !newTitle.trim()) return;
    setCreating(true);
    const r = await adminCreateCaseStudy({ slug: newSlug.trim(), title: newTitle.trim(), status: "draft" });
    setCreating(false);
    if (r.success && r.data) {
      setShowAdd(false);
      setNewSlug("");
      setNewTitle("");
      window.location.href = `/admin/case-studies/${r.data.id}`;
    } else {
      setError(r.message || "Ошибка создания");
    }
  };

  const filtered = list.filter((c) =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.slug?.includes(search)
  );

  const statusColor = (s: string) =>
    s === "published" ? "text-green-400" : s === "archived" ? "text-yellow-400" : "text-white/40";
  const statusLabel = (s: string) =>
    s === "published" ? "Опубликован" : s === "archived" ? "Архив" : "Черновик";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Кейсы</h1>
            <p className="text-sm text-white/50 mt-1">CMS — case_studies</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Новый кейс
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/70 mb-3">Создать кейс</p>
            <div className="flex flex-wrap gap-3">
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="slug (латиница, дефисы)"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white w-48"
              />
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Название"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white flex-1 min-w-[200px]"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <button
                onClick={handleCreate}
                disabled={creating || !newSlug.trim() || !newTitle.trim()}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium disabled:opacity-50"
              >
                {creating ? "…" : "Создать"}
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewSlug(""); setNewTitle(""); }}
                className="px-4 py-2 rounded-lg border border-white/20"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или slug…"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-white/60">Загрузка…</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-white/60">Нет кейсов. Создайте первый или загрузите через import.</p>
        )}

        <div className="space-y-2">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/admin/case-studies/${c.id}`}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-white/50 font-mono text-sm shrink-0">{c.slug}</span>
                <span className="font-medium truncate">{c.title}</span>
                {c.client && (
                  <span className="text-white/40 text-sm shrink-0">— {c.client}</span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className={`text-xs ${statusColor(c.status)}`}>
                  {statusLabel(c.status)}
                </span>
                {c.status === "published" ? (
                  <Eye className="w-4 h-4 text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/30" />
                )}
                <ArrowRight className="w-4 h-4 text-white/40" />
              </div>
            </Link>
          ))}
        </div>

        {!loading && list.length > 0 && (
          <p className="text-white/30 text-sm mt-4 text-right">{list.length} кейс(ов) всего</p>
        )}
      </div>
    </div>
  );
}
