import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublicPosts } from "@/lib/api";

const PER_PAGE = 9;
const categoryColors: Record<string, string> = {
  Сайты: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Боты: "bg-green-500/15 text-green-400 border-green-500/25",
  Видео: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Mini App": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  AI: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  Автоматизация: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Маркетинг: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

import type { CmsBlock } from "./BlockRenderer";

export function BlockPostsGrid({ block }: { block: CmsBlock }) {
  const [page, setPage] = useState(1);

  const { data: postsData } = useQuery({
    queryKey: ["public", "posts", "grid"],
    queryFn: async () => {
      const r = await getPublicPosts({ per_page: 100 });
      return r.success ? r.data : [];
    },
  });

  const posts = (postsData ?? []) as Array<{
    slug: string;
    title: string;
    excerpt?: string;
    published_at?: string;
    taxonomies?: Array<{ title: string }>;
  }>;

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const from = (currentPage - 1) * PER_PAGE;
  const items = useMemo(() => posts.slice(from, from + PER_PAGE), [posts, from]);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className={cn(
                  "group block h-full rounded-2xl p-5 md:p-6",
                  "bg-card border border-border",
                  "hover:border-primary/40 hover:bg-card/80",
                  "transition-all duration-200"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border",
                      categoryColors[post.taxonomies?.[0]?.title ?? ""] ?? "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {post.taxonomies?.[0]?.title ?? ""}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.published_at ? formatDate(post.published_at) : ""}
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Читать
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Статей пока нет</p>
          </div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-border"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-muted/80 text-foreground hover:bg-muted",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              Назад
            </button>
            <span className="text-sm text-muted-foreground">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-muted/80 text-foreground hover:bg-muted",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              Вперёд
            </button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
