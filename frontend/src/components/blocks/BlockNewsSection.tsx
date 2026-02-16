import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsSection } from "@/components/sections/NewsSection";
import { getPublicPosts } from "@/lib/api";
import type { CmsBlock } from "./BlockRenderer";

interface NewsSectionData {
  title?: string;
  subtitle?: string;
  blog_link?: string;
  article_slugs?: string[];
}

export function BlockNewsSection({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as NewsSectionData;
  const { data: postsData } = useQuery({
    queryKey: ["public", "posts", "news"],
    queryFn: async () => {
      const r = await getPublicPosts({ per_page: 50 });
      return r.success ? r.data : [];
    },
    enabled: !!d.article_slugs?.length,
  });

  const articles = useMemo(() => {
    const posts = (postsData ?? []) as Array<{
      slug: string;
      title: string;
      excerpt?: string;
      published_at?: string;
      taxonomies?: Array<{ title: string }>;
    }>;
    const slugs = d.article_slugs ?? [];
    if (slugs.length === 0) return undefined;
    const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
    return slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .map((p) => ({
        id: p!.slug,
        slug: p!.slug,
        title: p!.title,
        excerpt: p!.excerpt ?? "",
        date: p!.published_at ?? "",
        category: p!.taxonomies?.[0]?.title ?? "",
      }));
  }, [postsData, d.article_slugs]);

  return (
    <NewsSection
      title={d.title}
      subtitle={d.subtitle}
      blogLink={d.blog_link}
      articles={articles}
    />
  );
}
