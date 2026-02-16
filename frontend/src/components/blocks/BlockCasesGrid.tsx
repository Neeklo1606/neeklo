import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { CaseCard } from "@/components/common/CaseCard";
import { Button } from "@/components/common/Button";
import { getPublicCaseStudies, resolveStorageUrl } from "@/lib/api";
import type { CmsBlock } from "./BlockRenderer";

interface CasesGridData {
  categories?: string[];
}

const ITEMS_PER_PAGE = 12;

export function BlockCasesGrid({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as CasesGridData;
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const { data: casesData } = useQuery({
    queryKey: ["public", "case-studies"],
    queryFn: async () => {
      const r = await getPublicCaseStudies({ per_page: 100 });
      return r.success ? r.data : [];
    },
  });

  const list = (casesData ?? []) as Array<{
    id: number;
    slug: string;
    title: string;
    category?: string;
    cover?: string;
    coverPoster?: string;
    video?: string;
    coverVideo?: string;
    gallery?: Array<{ type?: string }>;
  }>;

  const categories = useMemo(() => {
    const cats = d.categories ?? ["all"];
    if (cats.includes("all")) return cats;
    return ["all", ...cats];
  }, [d.categories]);

  const filteredCases = useMemo(() => {
    if (categoryParam === "all") return list;
    return list.filter((c) => c.category === categoryParam);
  }, [categoryParam, list]);

  const displayedCases = filteredCases.slice(0, visibleItems);
  const hasMore = visibleItems < filteredCases.length;

  const handleCategoryChange = (category: string) => {
    setSearchParams(category === "all" ? {} : { category });
    setVisibleItems(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-8 md:py-12">
      <Container>
        {categories.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  categoryParam === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {cat === "all" ? "Все" : cat}
              </button>
            ))}
          </motion.div>
        )}

        <motion.div key={categoryParam} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedCases.map((project, index) => {
            const coverUrl = project.cover
              ? resolveStorageUrl(project.cover)
              : project.coverPoster ?? project.media_collections?.cover?.[0]?.url;
            const videoUrl = project.video
              ? resolveStorageUrl(project.video)
              : project.coverVideo ?? project.media_collections?.gallery?.find((m) => m.type === "video")?.url;
            const category =
              project.category ?? project.taxonomies?.[0]?.title ?? "";
            return (
              <CaseCard
                key={project.id}
                id={project.id}
                slug={project.slug}
                title={project.title}
                category={category}
                coverPoster={coverUrl}
                coverVideo={videoUrl}
                delay={index * 0.05}
                priority={index < 3}
                hasVideo={!!(project.video || project.coverVideo || videoUrl || project.gallery?.some((g) => g.type === "video"))}
              />
            );
          })}
        </motion.div>

        {hasMore && (
          <div className="text-center">
            <Button variant="secondary" size="lg" onClick={() => setVisibleItems((p) => p + ITEMS_PER_PAGE)}>
              Загрузить ещё
            </Button>
          </div>
        )}

        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Проектов в этой категории пока нет</p>
          </div>
        )}
      </Container>
    </section>
  );
}
