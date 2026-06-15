import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import casesData from "@/data/cases.json";
import { useSlider } from "@/hooks/useSlider";
import { VideoCaseCard } from "./VideoCaseCard";

import povuzamCover from "@/assets/cases/povuzam-cover.jpg";
import batnortonCover from "@/assets/cases/batnorton-cover.jpg";
import mnkaCover from "@/assets/cases/mnka-cover.jpg";
import glampingCover from "@/assets/cases/glamping-cover.jpg";
import aiAgentCover from "@/assets/cases/ai-agent-cover.jpg";
import aiVideoCover from "@/assets/cases/ai-video-cover.jpg";

const coverImages: Record<string, string> = {
  povuzam: povuzamCover,
  batnorton: batnortonCover,
  mnka: mnkaCover,
  glamping: glampingCover,
  "ai-agent": aiAgentCover,
  "ai-video": aiVideoCover,
};

const categoryConfig: Record<string, { label: string; color: string; productSlug?: string }> = {
  Web:      { label: "Сайт",     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",     productSlug: "website" },
  AI:       { label: "AI",       color: "bg-purple-500/20 text-purple-300 border-purple-500/30", productSlug: "ai-agent" },
  "AI-Video": { label: "AI Видео", color: "bg-pink-500/20 text-pink-300 border-pink-500/30",   productSlug: "ai-video" },
  "TG-Bot": { label: "Бот",     color: "bg-green-500/20 text-green-300 border-green-500/30",   productSlug: "telegram-bot" },
  "Mini-App": { label: "Mini App", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", productSlug: "mini-app" },
  Video:    { label: "Видео",    color: "bg-pink-500/20 text-pink-300 border-pink-500/30",      productSlug: "ai-video" },
  Branding: { label: "Бренд",   color: "bg-amber-500/20 text-amber-300 border-amber-500/30",   productSlug: "branding" },
};

interface VideoCasesSliderProps {
  title?: string;
  sectionId?: string;
}

export function VideoCasesSlider({ title, sectionId }: VideoCasesSliderProps = {}) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();

  // DOM refs created here, passed into useSlider — hook always sees the attached node
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const featuredCases = casesData
    .filter((c) => c.featured)
    .slice(0, 8)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category,
      tag: categoryConfig[c.category] || {
        label: c.category,
        color: "bg-muted text-muted-foreground border-border",
      },
      result: c.results[0] || "Успешный проект",
      coverImage: coverImages[c.slug] || null,
      coverVideo: c.coverVideo || null,
    }));

  const {
    springX,
    maxDrag,
    canScrollLeft,
    canScrollRight,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleCardClick,
    scrollLeft,
    scrollRight,
  } = useSlider({
    containerRef,
    sliderRef,
    isMobile,
    itemCount: featuredCases.length,
    onDragStart: () => setPlayingVideo(null),
  });

  const handlePlayClick = useCallback((slug: string) => {
    setPlayingVideo((prev) => (prev === slug ? null : slug));
  }, []);

  const handleProductClick = useCallback(
    (productSlug: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/products/${productSlug}`);
    },
    [navigate]
  );

  return (
    <section id={sectionId ?? "cases"} className="py-12 md:py-16 relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              {title ?? "Видео-кейсы"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 hidden md:block">
              Смотрите результаты наших проектов
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200",
                  canScrollLeft
                    ? "bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10"
                    : "bg-muted/30 border-transparent text-muted-foreground/50 cursor-not-allowed"
                )}
                aria-label="Прокрутить влево"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200",
                  canScrollRight
                    ? "bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10"
                    : "bg-muted/30 border-transparent text-muted-foreground/50 cursor-not-allowed"
                )}
                aria-label="Прокрутить вправо"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/work"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium",
                "text-muted-foreground hover:text-foreground transition-colors duration-200"
              )}
            >
              Все кейсы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </Container>

      {/* Slider */}
      <div ref={containerRef} className="relative overflow-hidden touch-pan-y">
        <motion.div
          ref={sliderRef}
          drag="x"
          dragConstraints={{ left: maxDrag, right: 0 }}
          dragElastic={isMobile ? 0.15 : 0.08}
          dragTransition={{
            bounceStiffness: 300,
            bounceDamping: 25,
            power: 0.3,
            timeConstant: 200,
          }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ x: springX }}
          className={cn(
            "flex gap-4 cursor-grab active:cursor-grabbing select-none",
            "pl-4 md:pl-6 lg:pl-[max(1.5rem,calc((100vw-1440px)/2+2rem))]",
            "pr-[20%] md:pr-[15%] lg:pr-[10%]"
          )}
        >
          {featuredCases.map((caseItem, index) => (
            <VideoCaseCard
              key={caseItem.id}
              caseItem={caseItem}
              index={index}
              isMobile={isMobile}
              shouldReduceMotion={shouldReduceMotion}
              onCardClick={handleCardClick}
              isPlaying={playingVideo === caseItem.slug}
              onPlayClick={handlePlayClick}
              onProductClick={handleProductClick}
            />
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-24 h-full bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex gap-1.5">
          {featuredCases.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                i === 0 ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
