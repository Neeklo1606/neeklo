import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { CaseCard } from "@/components/common/CaseCard";
import { Button } from "@/components/common/Button";
import { getPublicCaseStudies, resolveStorageUrl } from "@/lib/api";
import { PageSkeleton } from "@/components/common/PageSkeleton";

const ITEMS_PER_PAGE = 12;

interface CaseItem {
  id: number;
  slug: string;
  title: string;
  industry?: string;
  media_collections?: {
    cover?: Array<{ url: string }>;
    gallery?: Array<{ type?: string; url?: string }>;
  };
  taxonomies?: Array<{ title: string }>;
}

const Work = () => {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [categoryParam, setCategoryParam] = useState<string>("all");

  const { data: list, isLoading, isError } = useQuery({
    queryKey: ["public", "case-studies", "catalog"],
    queryFn: async () => {
      const r = await getPublicCaseStudies({ per_page: 100 });
      if (!r.success) throw new Error(r.message || "Ошибка загрузки");
      return (r.data ?? []) as CaseItem[];
    },
  });

  const cases = list ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    cases.forEach((c) => {
      const cat = c.taxonomies?.[0]?.title ?? c.industry ?? "";
      if (cat) set.add(cat);
    });
    return ["all", ...Array.from(set)];
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (categoryParam === "all") return cases;
    return cases.filter((c) => {
      const cat = c.taxonomies?.[0]?.title ?? c.industry ?? "";
      return cat === categoryParam;
    });
  }, [categoryParam, cases]);

  const displayedCases = filteredCases.slice(0, visibleItems);
  const hasMore = visibleItems < filteredCases.length;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-28 pb-16 md:pb-24">
        <Container>
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 md:mb-14"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Портфолио
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Кейсы и проекты из админ-панели — реализованные работы по категориям.
            </p>
          </motion.header>

          {isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-muted-foreground">
              Не удалось загрузить кейсы. Проверьте подключение или попробуйте позже.
            </div>
          )}

          {!isError && cases.length === 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-10 text-center text-muted-foreground">
              Пока нет опубликованных кейсов. Добавьте их в{" "}
              <a
                href="https://neeklo.ru/admin/case-studies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                админ-панели
              </a>
              .
            </div>
          )}

          {!isError && cases.length > 0 && (
            <>
              {categories.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 mb-10"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryParam(cat);
                        setVisibleItems(ITEMS_PER_PAGE);
                      }}
                      className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                        categoryParam === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      }`}
                    >
                      {cat === "all" ? "Все" : cat}
                    </button>
                  ))}
                </motion.div>
              )}

              <motion.section
                key={categoryParam}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                {displayedCases.map((project, index) => {
                  const coverUrl =
                    (project as { cover_image?: { url?: string } }).cover_image?.url ||
                    resolveStorageUrl((project as { cover?: string }).cover) ||
                    (project as { coverPoster?: string }).coverPoster ||
                    project.media_collections?.cover?.[0]?.url;
                  const category =
                    (project as { category?: string }).category ??
                    project.taxonomies?.[0]?.title ??
                    project.industry ??
                    "";
                  const description =
                    (project as { short_description?: string }).short_description ||
                    (project as { shortDescription?: string }).shortDescription ||
                    (project as { result?: string }).result ||
                    "Кейс из портфолио Neeklo";
                  return (
                    <CaseCard
                      key={project.id}
                      slug={project.slug}
                      title={project.title}
                      category={category}
                      image={coverUrl || ""}
                      description={description}
                      priority={index < 3}
                    />
                  );
                })}
              </motion.section>

              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setVisibleItems((p) => p + ITEMS_PER_PAGE)}
                  >
                    Загрузить ещё
                  </Button>
                </div>
              )}

              {filteredCases.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    В этой категории пока нет проектов
                  </p>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Work;
