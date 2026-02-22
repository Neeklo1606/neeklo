import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Clock, Users, Layers, CheckCircle } from "lucide-react";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { CaseMediaGallery } from "@/components/sections/CaseMediaGallery";
import { getCases, resolveStorageUrl } from "@/lib/api";
import casesData from "@/data/cases.json";

// Import cover images
import povuzamCover from "@/assets/cases/povuzam-cover.jpg";
import batnortonCover from "@/assets/cases/batnorton-cover.jpg";
import mnkaCover from "@/assets/cases/mnka-cover.jpg";
import glampingCover from "@/assets/cases/glamping-cover.jpg";
import aiAgentCover from "@/assets/cases/ai-agent-cover.jpg";
import aiVideoCover from "@/assets/cases/ai-video-cover.jpg";

// Import gallery images for BatNorton
import batnorton1 from "@/assets/cases/batnorton-1.jpg";
import batnorton2 from "@/assets/cases/batnorton-2.jpg";
import batnorton3 from "@/assets/cases/batnorton-3.jpg";
import batnorton4 from "@/assets/cases/batnorton-4.jpg";

// Map slugs to cover images
const coverImages: Record<string, string> = {
  "povuzam": povuzamCover,
  "batnorton": batnortonCover,
  "mnka": mnkaCover,
  "glamping": glampingCover,
  "ai-agent": aiAgentCover,
  "ai-video": aiVideoCover,
};

// Map gallery image filenames to imported images
const galleryImages: Record<string, string> = {
  "batnorton-1.jpg": batnorton1,
  "batnorton-2.jpg": batnorton2,
  "batnorton-3.jpg": batnorton3,
  "batnorton-4.jpg": batnorton4,
};

type CaseRecord = {
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  year?: number;
  cover?: string;
  video?: string;
  gallery?: { type?: string; src?: string; alt?: string }[];
  coverPoster?: string;
  coverVideo?: string;
  client?: string;
  role?: string;
  duration?: string;
  results?: string[];
  metrics?: { value?: string; label?: string }[];
  stack?: string[];
  testimonial?: { text?: string; author?: string; position?: string };
};

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [list, setList] = useState<CaseRecord[]>(casesData);

  useEffect(() => {
    getCases().then((r) => {
      if (r.success && r.data && r.data.length > 0) setList(r.data as CaseRecord[]);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const caseData = list.find((c) => c.slug === slug) ?? null;
  const currentIndex = list.findIndex((c) => c.slug === slug);
  const nextCase = list[currentIndex + 1] || list[0];
  const prevCase = list[currentIndex - 1] || list[list.length - 1];

  const coverImageUrl = caseData?.cover
    ? resolveStorageUrl(caseData.cover)
    : (caseData?.slug && coverImages[caseData.slug]) || null;
  const coverVideoUrl = caseData?.video
    ? resolveStorageUrl(caseData.video)
    : (caseData as { coverVideo?: string })?.coverVideo || null;

  const galleryItems = useMemo(() => {
    if (!caseData) return [];
    const cover = caseData.cover ? resolveStorageUrl(caseData.cover) : (caseData.slug && coverImages[caseData.slug]) || undefined;
    const out: { type: "image" | "video"; src: string; alt?: string; poster?: string }[] = [];
    if (caseData.video || (caseData as { coverVideo?: string }).coverVideo) {
      out.push({
        type: "video",
        src: caseData.video ? resolveStorageUrl(caseData.video) : (caseData as { coverVideo?: string }).coverVideo!,
        poster: cover,
      });
    }
    (caseData.gallery || []).forEach((g) => {
      const src = galleryImages[g.src!] || (g.src && (g.src.startsWith("http") ? g.src : (g.src.startsWith("/") ? resolveStorageUrl(g.src) : `/${g.src}`)));
      if (src) out.push({ type: (g.type as "image" | "video") || "image", src, alt: g.alt, poster: g.type === "video" ? cover : undefined });
    });
    return out;
  }, [caseData]);

  if (!caseData) {
    return <Navigate to="/work" replace />;
  }

  useMetaTags(
    `${caseData.title} | Neeklo Studio`,
    caseData.description || "",
    (coverImageUrl && (coverImageUrl.startsWith("http") ? coverImageUrl : `https://neeklo.ru${coverImageUrl}`)) || "https://neeklo.ru/og-work.jpg",
    `https://neeklo.ru/work/${caseData.slug}`,
    `${caseData.title}, ${caseData.category || ""}, кейс, проект`
  );

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": caseData.title,
    "description": caseData.description,
    "url": `https://neeklo.ru/work/${caseData.slug}`,
    "creator": {
      "@type": "Organization",
      "name": "Neeklo Studio",
      "url": "https://neeklo.ru"
    },
    "datePublished": `${caseData.year || new Date().getFullYear()}-01-01`,
    "keywords": caseData.category
  };

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={creativeWorkSchema} />
      
      <main className="pt-20 md:pt-24 lg:pt-28 pb-[max(5rem,env(safe-area-inset-bottom)+3.5rem)] lg:pb-16">
        <Container className="py-3 md:py-4">
          <Breadcrumbs
            items={[
              { label: "Проекты", url: "/work" },
              { label: caseData.title, url: `/work/${caseData.slug}` },
            ]}
          />
        </Container>
        
        <Container className="pt-0">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 mb-12"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              {caseData.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight">
              {caseData.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              {caseData.description}
            </p>
          </motion.div>

          {/* Project Visual - Cover Image or Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {coverVideoUrl ? (
              <VideoPlayer
                src={coverVideoUrl}
                poster={coverImageUrl || undefined}
                title={caseData.title || ""}
                priority
                className="w-full rounded-2xl shadow-2xl"
              />
            ) : coverImageUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={coverImageUrl}
                  alt={caseData.title || ""}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[120px] md:text-[200px] font-bold text-foreground/5">{(caseData as { id?: number }).id ?? caseData.slug?.[0]?.toUpperCase()}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Info Grid */}
          {(caseData.client || caseData.role || caseData.duration || caseData.year) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            >
              {caseData.client && (
                <div className="glass-effect rounded-xl p-4 md:p-6">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Клиент</p>
                  <p className="font-medium text-sm md:text-base">{caseData.client}</p>
                </div>
              )}
              {caseData.role && (
                <div className="glass-effect rounded-xl p-4 md:p-6">
                  <Layers className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Роль</p>
                  <p className="font-medium text-sm md:text-base line-clamp-2">{caseData.role}</p>
                </div>
              )}
              {caseData.duration && (
                <div className="glass-effect rounded-xl p-4 md:p-6">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Срок</p>
                  <p className="font-medium text-sm md:text-base">{caseData.duration}</p>
                </div>
              )}
              {caseData.year && (
                <div className="glass-effect rounded-xl p-4 md:p-6">
                  <CheckCircle className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Год</p>
                  <p className="font-medium text-sm md:text-base">{caseData.year}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Results Section */}
          {caseData.results && caseData.results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Результаты</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {caseData.results.map((result, index) => (
                  <div key={index} className="glass-effect rounded-xl p-6 border-l-4 border-primary">
                    <p className="text-foreground font-medium">{result}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metrics Section */}
          {caseData.metrics && (caseData.metrics as { value?: string; label?: string }[]).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Метрики</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {caseData.metrics.map((metric, index) => (
                  <div key={index} className="glass-effect rounded-xl p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">Технологии</h2>
            <div className="flex flex-wrap gap-3">
              {caseData.stack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Media Gallery */}
          {galleryItems.length > 0 && (
            <CaseMediaGallery items={galleryItems} title="Галерея проекта" />
          )}

          {/* Testimonial */}
          {caseData.testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-16"
            >
              <div className="glass-effect rounded-2xl p-8 md:p-10">
                <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                  "{caseData.testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold">{caseData.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{caseData.testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-border"
          >
            <Link 
              to={`/work/${prevCase.slug}`}
              className="flex items-center gap-3 group glass-effect rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              <div>
                <p className="text-xs text-muted-foreground">Предыдущий</p>
                <p className="font-medium line-clamp-1">{prevCase.title}</p>
              </div>
            </Link>
            <Link 
              to={`/work/${nextCase.slug}`}
              className="flex items-center justify-end gap-3 group glass-effect rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Следующий</p>
                <p className="font-medium line-clamp-1">{nextCase.title}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default WorkDetail;
