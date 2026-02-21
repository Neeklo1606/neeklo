import { useMemo } from "react";
import { NewsSection } from "@/components/sections/NewsSection";
import { getBlogArticle } from "@/data/blogArticles";
import type { CmsBlock } from "./BlockRenderer";

interface NewsSectionData {
  title?: string;
  subtitle?: string;
  blog_link?: string;
  article_slugs?: string[];
}

export function BlockNewsSection({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as NewsSectionData;

  const articles = useMemo(() => {
    const slugs = d.article_slugs ?? [];
    if (slugs.length === 0) return undefined;
    return slugs
      .map((slug) => getBlogArticle(slug))
      .filter(Boolean)
      .map((a) => ({
        id: a!.slug,
        slug: a!.slug,
        title: a!.h1,
        excerpt: a!.excerpt ?? "",
        date: a!.date ?? "",
        category: a!.category ?? "",
      }));
  }, [d.article_slugs]);

  return (
    <NewsSection
      title={d.title}
      subtitle={d.subtitle}
      blogLink={d.blog_link}
      articles={articles}
    />
  );
}
