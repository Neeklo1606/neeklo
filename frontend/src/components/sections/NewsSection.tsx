"use client";

import { useMemo } from "react";
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

export function NewsSection({ title, subtitle, blogLink, articles: articlesProp }: NewsSectionProps = {}) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const articles = articlesProp ?? ARTICLES;
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-6 sm:py-12 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className={`io-animate io-slide-right flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10 ${isVisible ? "io-visible" : ""}`}>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              {title ?? "Полезно для бизнеса"}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {subtitle ?? "Разборы, кейсы и практические советы"}
            </p>
          </div>
          <Link
            to={blogLink ?? "/blog"}
            className="text-sm font-medium text-primary hover:underline shrink-0"
          >
            Все статьи →
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {articles.map((article, index) => (
            <article
              key={article.id}
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
                <div className="flex flex-col h-full min-h-[160px] transition-transform duration-300 group-hover:-translate-y-1">
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
