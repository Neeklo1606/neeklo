import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { ArrowLeft, MessageCircle, CreditCard } from "lucide-react";
import { getPublicService } from "@/lib/api";
import { setMetaTags } from "@/lib/seo";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function ServiceBySlug() {
  const { slug } = useParams<{ slug: string }>();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["public", "service", slug],
    queryFn: () => getPublicService(slug!),
    enabled: !!slug,
  });

  const service = response?.success ? response.data : null;

  useEffect(() => {
    if (service) {
      const s = service as { seo_title?: string; title?: string; seo_description?: string; short?: string; media_collections?: { cover?: Array<{ url: string }> } };
      setMetaTags(
        {
          title: s.seo_title || s.title,
          seo_description: s.seo_description || s.short,
          media_collections: s.media_collections,
        },
        {}
      );
    }
  }, [service]);

  if (!slug) return <Navigate to="/services" replace />;
  if (isLoading) return <PageSkeleton />;
  if (isError || !service) return <Navigate to="/services" replace />;

  const s = service as {
    title: string;
    short?: string;
    body?: string;
    price_from?: number;
    media_collections?: {
      cover?: Array<{ url: string }>;
      gallery?: Array<{ url: string }>;
    };
  };

  const coverUrl = s.media_collections?.cover?.[0]?.url;
  const gallery = s.media_collections?.gallery ?? [];

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
            <Link
              to="/services"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все услуги
            </Link>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              {s.title}
            </h1>
            {s.short && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                {s.short}
              </p>
            )}
          </motion.header>

          {coverUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 rounded-2xl overflow-hidden bg-muted aspect-video max-w-4xl"
            >
              <img
                src={coverUrl}
                alt=""
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              {s.body && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-p:text-muted-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              )}

              {gallery.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {gallery.map((m: { url: string }, i: number) => (
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
                  ))}
                </motion.section>
              )}
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 p-6 md:p-8 rounded-2xl bg-card border border-border/50 space-y-6">
                {s.price_from != null && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Стоимость</h3>
                      <p className="text-2xl font-bold text-primary">
                        от {s.price_from.toLocaleString("ru-RU")} ₽
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Точная цена после консультации
                      </p>
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold text-foreground">
                  Обсудим проект?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Опишите задачу — подготовим предложение и сроки.
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
