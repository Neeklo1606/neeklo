import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CaseCard } from "@/components/common/CaseCard";
import { ArrowLeft, MessageCircle, CheckCircle, Target, Zap } from "lucide-react";
import { getPublicCaseStudy, getPublicCaseStudyRelated } from "@/lib/api";
import { setMetaTags } from "@/lib/seo";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";

const PORTFOLIO_BASE = "/portfolio";

export default function WorkBySlug() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/portfolio") ? PORTFOLIO_BASE : "/work";

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["public", "case-study", slug],
    queryFn: () => getPublicCaseStudy(slug!),
    enabled: !!slug,
  });

  const { data: relatedList } = useQuery({
    queryKey: ["public", "case-study-related", slug],
    queryFn: async () => {
      const r = await getPublicCaseStudyRelated(slug!, 4);
      return r.success ? (r.data ?? []) : [];
    },
    enabled: !!slug && !!response?.success,
  });

  const data = response?.success ? response.data : null;

  useEffect(() => {
    if (data) {
      const s = data as {
        seo_title?: string;
        title?: string;
        seo_description?: string;
        short_description?: string;
        result?: string;
        media_collections?: { cover?: Array<{ url: string }> };
        cover_image?: { url: string };
      };
      setMetaTags(
        {
          title: s.seo_title || s.title,
          seo_description: s.seo_description || s.short_description || s.result,
          media_collections: s.media_collections,
          cover_image: s.cover_image,
        },
        {}
      );
    }
  }, [data]);

  if (!slug) return <Navigate to={PORTFOLIO_BASE} replace />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !data) return <Navigate to={PORTFOLIO_BASE} replace />;

  const c = data as {
    title: string;
    short_description?: string;
    client?: string;
    industry?: string;
    problem?: string;
    solution?: string;
    result?: string;
    body?: string;
    video_url?: string;
    cover_image?: { url: string };
    media_collections?: {
      cover?: Array<{ url: string }>;
      gallery?: Array<{ url: string; type?: string }>;
    };
    taxonomies?: Array<{ title: string }>;
    category?: string;
  };

  const coverUrl = c.cover_image?.url ?? c.media_collections?.cover?.[0]?.url;
  const gallery = c.media_collections?.gallery ?? [];
  const category = c.category ?? c.taxonomies?.[0]?.title ?? c.industry ?? "";

  const breadcrumbItems = [
    { label: "Портфолио", href: basePath },
    ...(category ? [{ label: category, href: `${basePath}?category=${encodeURIComponent(category)}` }] : []),
    { label: c.title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-28 pb-16 md:pb-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 md:mb-8"
          >
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            <Link
              to={basePath}
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все кейсы
            </Link>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            {category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                {category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
              {c.title}
            </h1>
            {c.client && (
              <p className="text-lg text-muted-foreground">Клиент: {c.client}</p>
            )}
          </motion.header>

          {(coverUrl || c.video_url) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 rounded-2xl overflow-hidden bg-muted aspect-video max-w-4xl"
            >
              {c.video_url ? (
                <video
                  src={c.video_url}
                  poster={coverUrl}
                  controls
                  className="w-full h-full object-cover"
                  width={1280}
                  height={720}
                >
                  Ваш браузер не поддерживает видео.
                </video>
              ) : coverUrl ? (
                <img
                  src={coverUrl}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-10">
              {c.problem && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="p-6 md:p-8 rounded-2xl bg-destructive/5 border border-destructive/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold mb-2 text-foreground">
                        Задача
                      </h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {c.problem}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}

              {c.solution && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold mb-2 text-foreground">
                        Решение
                      </h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {c.solution}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}

              {c.result && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="p-6 md:p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold mb-2 text-foreground">
                        Результат
                      </h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {c.result}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}

              {c.body && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-p:text-muted-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: c.body }}
                />
              )}

              {gallery.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {gallery.map((m, i) =>
                    m.type === "video" ? (
                      <div key={i} className="rounded-xl overflow-hidden bg-muted aspect-video">
                        <video src={m.url} controls className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div key={i} className="rounded-xl overflow-hidden bg-muted aspect-square">
                        <img
                          src={m.url}
                          alt=""
                          width={800}
                          height={800}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </motion.section>
              )}

              {relatedList && (relatedList as unknown[]).length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-14 pt-10 border-t border-border"
                >
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                    Похожие проекты
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(relatedList as Array<{
                      id: number;
                      slug: string;
                      title: string;
                      short_description?: string;
                      category?: string;
                      cover_image?: { url: string };
                      media_collections?: { cover?: Array<{ url: string }> };
                      taxonomies?: Array<{ title: string }>;
                      industry?: string;
                    }>).map((item) => {
                      const img =
                        item.cover_image?.url ??
                        item.media_collections?.cover?.[0]?.url ??
                        "";
                      const cat =
                        item.category ??
                        item.taxonomies?.[0]?.title ??
                        item.industry ??
                        "";
                      return (
                        <CaseCard
                          key={item.id}
                          slug={item.slug}
                          title={item.title}
                          category={cat}
                          image={img}
                          description={
                            item.short_description ?? "Кейс из портфолио Neeklo"
                          }
                        />
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 p-6 md:p-8 rounded-2xl bg-card border border-border/50 space-y-6">
                <h3 className="text-xl font-heading font-bold text-foreground">
                  Обсудим ваш проект?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Расскажите о задаче — подготовим кейс под ваши цели.
                </p>
                <div className="space-y-3">
                  <Button
                    size="lg"
                    variant="default"
                    className="w-full"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Оставить заявку
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full group"
                    onClick={() => window.open("https://t.me/neeekn", "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Написать в Telegram
                  </Button>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
