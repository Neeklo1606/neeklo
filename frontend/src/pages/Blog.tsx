import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogArticles, type BlogArticleData } from "@/data/blogArticles";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const tagColors = [
  "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25",
  "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
  "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/25",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25",
  "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
];

function getTagStyle(tag: string, index: number) {
  return tagColors[index % tagColors.length];
}

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateOrder, setDateOrder] = useState<"newest" | "oldest">("newest");
  const [yearFilter, setYearFilter] = useState<string | "">("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    blogArticles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const years = useMemo(() => {
    const set = new Set(blogArticles.map((a) => a.date.slice(0, 4)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, []);

  const filtered = useMemo(() => {
    let list: BlogArticleData[] = blogArticles;

    if (selectedTag) {
      list = list.filter((a) => a.tags.includes(selectedTag));
    }
    if (yearFilter) {
      list = list.filter((a) => a.date.startsWith(yearFilter));
    }

    list = [...list].sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return dateOrder === "newest" ? dB - dA : dA - dB;
    });

    return list;
  }, [selectedTag, yearFilter, dateOrder]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-[max(6rem,env(safe-area-inset-bottom)+4rem)] lg:pb-0 pt-24 md:pt-28">
        <Container>
          <header className="mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Блог
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Полезно для бизнеса: разборы, кейсы и практические советы
            </p>
          </header>

          {/* Фильтры: темы (теги) и дата */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground mr-1">Тема:</span>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  !selectedTag
                    ? "bg-foreground text-background border-foreground"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                )}
              >
                Все
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    selectedTag === tag
                      ? "bg-foreground text-background border-foreground"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">Дата:</span>
              <select
                value={dateOrder}
                onChange={(e) => setDateOrder(e.target.value as "newest" | "oldest")}
                className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
              </select>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Все годы</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Сетка карточек по 3 в ряд */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((article) => (
              <article key={article.slug}>
                <Link
                  to={`/blog/${article.slug}`}
                  className={cn(
                    "group block h-full",
                    "rounded-[20px] lg:rounded-[24px]",
                    "p-5 md:p-6",
                    "bg-foreground/[0.02] dark:bg-white/[0.025]",
                    "border border-foreground/[0.06] dark:border-white/[0.06]",
                    "hover:bg-foreground/[0.05] dark:hover:bg-white/[0.05]",
                    "hover:border-foreground/[0.12] dark:hover:border-white/[0.12]",
                    "transition-all duration-300"
                  )}
                >
                  <div className="flex flex-col h-full min-h-[200px]">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.date)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {article.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={tag}
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[11px] font-medium border",
                            getTagStyle(tag, i)
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.h1}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Читать
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>По выбранным фильтрам статей не найдено</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTag(null);
                  setYearFilter("");
                }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
