import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getBlogArticle } from "@/data/blogArticles";

const BLOG_URL = "https://neeklo.ru/blog";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = useMemo(() => (slug ? getBlogArticle(slug) : undefined), [slug]);

  useEffect(() => {
    if (article) window.scrollTo(0, 0);
  }, [article, slug]);

  const canonical = article ? `${BLOG_URL}/${article.slug}` : BLOG_URL;
  useMetaTags(
    article?.metaTitle ?? "Блог | Neeklo Studio",
    article?.metaDescription ?? "Статьи о сайтах, ботах, AI и автоматизации для бизнеса.",
    "https://neeklo.ru/og-blog.jpg",
    canonical,
    article?.tags?.join(", ") ?? ""
  );

  if (!slug || !article) {
    return <Navigate to="/" replace />;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.dateModified || article.date,
    author: {
      "@type": "Organization",
      name: "Neeklo Studio",
      url: "https://neeklo.ru",
    },
    publisher: {
      "@type": "Organization",
      name: "Neeklo Studio",
      url: "https://neeklo.ru",
      logo: {
        "@type": "ImageObject",
        url: "https://neeklo.ru/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={articleSchema} />

      <main className="pt-20 md:pt-24 lg:pt-28 pb-[max(5rem,env(safe-area-inset-bottom)+3.5rem)] lg:pb-16">
        <Container className="py-3 md:py-4">
          <Breadcrumbs
            items={[
              { label: "Блог", url: "/blog" },
              { label: article.h1, url: `/blog/${article.slug}` },
            ]}
          />
        </Container>

        <Container className="pt-0 max-w-3xl">
          {/* Header */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="text-primary border-primary/30">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 leading-tight">
              {article.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>

            {/* Body: H2 + paragraphs */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {article.sections.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2 className="text-xl md:text-2xl font-heading font-semibold mb-4 mt-8 first:mt-0">
                    {section.h2}
                  </h2>
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-muted-foreground mb-4 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-foreground font-medium mb-4">
                Хотите обсудить похожую задачу для вашего бизнеса?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Обсудить проект
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.article>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
