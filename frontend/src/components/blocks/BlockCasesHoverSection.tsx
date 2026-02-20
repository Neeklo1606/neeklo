import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { HoverDetailCard } from "@/components/ui/hover-detail-card";
import { getPublicCaseStudies, resolveStorageUrl } from "@/lib/api";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { CmsBlock } from "./BlockRenderer";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
];

interface BlockCasesHoverData {
  title?: string;
  subtitle?: string;
  section_id?: string;
}

export function BlockCasesHoverSection({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as BlockCasesHoverData;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  const { data: casesData } = useQuery({
    queryKey: ["public", "case-studies"],
    queryFn: async () => {
      const r = await getPublicCaseStudies({ per_page: 24 });
      return r.success ? r.data : [];
    },
  });

  const list = (casesData ?? []) as Array<{
    id: number;
    slug: string;
    title: string;
    short_description?: string | null;
    category?: string;
    cover?: string;
    coverPoster?: string;
    media_collections?: {
      cover?: Array<{ url?: string }>;
      card_gallery?: Array<{ url?: string }>;
      video?: Array<{ url?: string }>;
    };
    taxonomies?: Array<{ title?: string }>;
  }>;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id={d.section_id ?? "cases"} className="py-10 md:py-14">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className={`io-animate io-fade-up text-2xl md:text-3xl font-heading font-bold text-foreground ${isVisible ? "io-visible" : ""}`}>
              {d.title ?? "Кейсы"}
            </h2>
            {(d.subtitle ?? (d.title ? "Смотрите результаты наших проектов" : null)) && (
              <p className={`io-animate io-fade-up text-muted-foreground mt-1 ${isVisible ? "io-visible" : ""}`} style={{ transitionDelay: "100ms" }}>
                {d.subtitle ?? "Смотрите результаты наших проектов"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label="Предыдущие кейсы"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label="Следующие кейсы"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
            <Link
              to="/work"
              className="text-primary font-medium hover:underline ml-2"
            >
              Все кейсы →
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.length === 0 && (
            <p className="text-muted-foreground py-12">Пока нет опубликованных кейсов.</p>
          )}
          {list.map((project, index) => {
            const coverUrl = project.cover
              ? resolveStorageUrl(project.cover)
              : project.coverPoster ?? project.media_collections?.cover?.[0]?.url ?? null;
            const cardGallery = project.media_collections?.card_gallery ?? [];
            const cardUrls = cardGallery.slice(0, 5).map((m) => m?.url).filter(Boolean) as string[];
            const fillUrl = coverUrl ?? DEFAULT_IMAGES[0];
            const images =
              cardUrls.length > 0
                ? [...cardUrls, ...Array(Math.max(0, 10 - cardUrls.length)).fill(fillUrl)].slice(0, 10) as string[]
                : fillUrl
                  ? (Array(10).fill(fillUrl) as string[])
                  : DEFAULT_IMAGES;
            const videoUrl = project.media_collections?.video?.[0]?.url ?? null;
            const category = project.category ?? project.taxonomies?.[0]?.title ?? "Кейс";

            return (
              <div
                key={project.id}
                className={`io-animate io-scale-in snap-start min-w-[280px] max-w-md w-full ${isVisible ? "io-visible" : ""}`}
                style={{ transitionDelay: `${120 + index * 100}ms` }}
              >
                <HoverDetailCard
                  title={project.title}
                  subtitle={project.short_description ?? ""}
                  images={images}
                  videoUrl={videoUrl ?? undefined}
                  primaryButton={{
                    text: "Смотреть кейс",
                    href: `/portfolio/${project.slug}`,
                    color: "bg-white/90",
                    hoverColor: "hover:bg-white",
                    textColor: "text-gray-900",
                  }}
                  secondaryButton={{
                    text: "Заказать такой",
                    href: "/contact",
                    color: "bg-primary",
                    hoverColor: "hover:bg-primary/90",
                    textColor: "text-primary-foreground",
                  }}
                  pills={{
                    left: {
                      text: category,
                      color: "bg-primary/10",
                      textColor: "text-primary",
                    },
                    sparkle: { show: false },
                    right: {
                      text: "Кейс",
                      color: "bg-muted",
                      textColor: "text-muted-foreground",
                    },
                  }}
                  enableAnimations={true}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
