"use client";

import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  image?: string;
}

// Статьи для блока «Полезно для бизнеса» (ведут в /blog/:slug)
const ARTICLES: NewsArticle[] = [
  {
    id: "ai-agents-for-business",
    title: "AI-агенты для бизнеса: как автоматизировать рутину и увеличить продажи",
    excerpt: "Разбираем, что такое AI-агенты, где они дают быстрый ROI и как внедрить первого агента за 2–4 недели. Кейсы и метрики.",
    date: "2024-11-18",
    category: "AI",
    slug: "ai-agents-for-business",
  },
  {
    id: "telegram-mini-app-roi",
    title: "Telegram Mini App: когда окупается и как измерить ROI",
    excerpt: "Разбираем, в каких задачах Mini App выигрывает у лендингов и мобильных приложений, как считать окупаемость и какие интеграции важны.",
    date: "2024-11-12",
    category: "Mini App",
    slug: "telegram-mini-app-roi",
  },
  {
    id: "chat-bots-leads-sales",
    title: "Чат-боты для заявок и продаж: 5 сценариев, которые реально конвертируют",
    excerpt: "Квалификация лидов, запись на услугу, продажа простых товаров, сбор пожеланий и реанимация — как настроить бота под воронку.",
    date: "2024-11-05",
    category: "Боты",
    slug: "chat-bots-leads-sales",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
};

const categoryColors: Record<string, string> = {
  "Сайты": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Боты": "bg-green-500/15 text-green-400 border-green-500/25",
  "Видео": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Mini App": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "AI": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Автоматизация": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Маркетинг": "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

interface NewsSectionProps {
  title?: string;
  subtitle?: string;
  blogLink?: string;
  articles?: NewsArticle[];
}

/** Загрузить статьи из API. Fallback — статические ARTICLES. */
function useBlogPosts(enabled: boolean): { articles: NewsArticle[]; loading: boolean } {
  const [articles, setArticles] = useState<NewsArticle[]>(ARTICLES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetch("/api/blog-posts")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Array<{id:number|string;slug:string;title:string;excerpt?:string;seo_description?:string;published_at?:string;created_at?:string}>) => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(
            data.slice(0, 3).map((p) => ({
              id: String(p.id),
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || p.seo_description || "",
              date: p.published_at || p.created_at || new Date().toISOString(),
              category: "Блог",
            }))
          );
        }
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, [enabled]);

  return { articles, loading };
}

export function NewsSection({ title, subtitle, blogLink, articles: articlesProp }: NewsSectionProps = {}) {
  const shouldReduceMotion = usePrefersReducedMotion();
  // Если статьи переданы снаружи (CMS-блок) — используем их; иначе пробуем API
  const { articles: apiArticles, loading } = useBlogPosts(!articlesProp);
  const articles = articlesProp ?? apiArticles;
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-12 md:py-16 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className={`io-animate io-slide-right flex flex-col items-center gap-4 mb-6 md:mb-8 ${isVisible ? "io-visible" : ""}`}>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              {title ?? "Полезно для бизнеса"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {subtitle ?? "Разборы, кейсы и практические советы"}
            </p>
          </div>
          <Link
            to={blogLink ?? "/blog"}
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Все статьи →
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {loading && articles === ARTICLES && [0,1,2].map((i) => (
            <div key={i} className="rounded-[20px] p-5 bg-foreground/[0.02] border border-foreground/[0.06] animate-pulse min-h-[200px]">
              <div className="h-3 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-5 bg-muted rounded w-full mb-2"></div>
              <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
          {(!loading || articles !== ARTICLES) && articles.map((article, index) => (
            <article
              key={article.id ?? article.slug}
              className={`io-animate io-slide-right ${isVisible ? "io-visible" : ""}`}
              style={{ transitionDelay: `${100 + index * 100}ms` }}
            >
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
                <div className="flex flex-col h-full min-h-[160px] transition-transform duration-300 md:group-hover:-translate-y-1">
                  {/* Meta: Category + Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg",
                      "text-xs font-medium",
                      "border",
                      categoryColors[article.category] || "bg-muted text-muted-foreground border-border"
                    )}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                  
                  {/* Read more */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    Читать
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
