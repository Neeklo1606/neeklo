import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { Container } from "@/components/common/Container";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import casesData from "@/data/cases.json";

// Import case cover images
import povuzamCover from "@/assets/cases/povuzam-cover.jpg";
import batnortonCover from "@/assets/cases/batnorton-cover.jpg";
import mnkaCover from "@/assets/cases/mnka-cover.jpg";
import glampingCover from "@/assets/cases/glamping-cover.jpg";
import aiAgentCover from "@/assets/cases/ai-agent-cover.jpg";
import aiVideoCover from "@/assets/cases/ai-video-cover.jpg";

// Map case slugs to cover images
const coverImages: Record<string, string> = {
  "povuzam": povuzamCover,
  "batnorton": batnortonCover,
  "mnka": mnkaCover,
  "glamping": glampingCover,
  "ai-agent": aiAgentCover,
  "ai-video": aiVideoCover,
};

// Category tags mapping with product links
const categoryConfig: Record<string, { 
  label: string; 
  color: string;
  productSlug?: string;
}> = {
  "Web": { 
    label: "Сайт", 
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    productSlug: "website"
  },
  "AI": { 
    label: "AI", 
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    productSlug: "ai-agent"
  },
  "AI-Video": { 
    label: "AI Видео", 
    color: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    productSlug: "ai-video"
  },
  "TG-Bot": { 
    label: "Бот", 
    color: "bg-green-500/20 text-green-300 border-green-500/30",
    productSlug: "telegram-bot"
  },
  "Mini-App": { 
    label: "Mini App", 
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    productSlug: "mini-app"
  },
  "Video": { 
    label: "Видео", 
    color: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    productSlug: "ai-video"
  },
  "Branding": { 
    label: "Бренд", 
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    productSlug: "branding"
  },
};

// Card dimensions: 2.5 / 2 / 1 visible on desktop / tablet / mobile
const CARD_WIDTH_MOBILE = 240;
const CARD_WIDTH_TABLET = 280;
const CARD_WIDTH_DESKTOP = 300;
const CARD_GAP = 16;

// Case card component
const CaseCard = memo(function CaseCard({
  caseItem,
  index,
  isMobile,
  shouldReduceMotion,
  onCardClick,
  isPlaying,
  onPlayClick,
  onProductClick,
}: {
  caseItem: {
    id: number;
    slug: string;
    title: string;
    category: string;
    tag: { label: string; color: string; productSlug?: string };
    result: string;
    coverImage: string | null;
    coverVideo: string | null;
  };
  index: number;
  isMobile: boolean;
  shouldReduceMotion: boolean;
  onCardClick: (e: React.MouseEvent) => void;
  isPlaying: boolean;
  onPlayClick: (slug: string) => void;
  onProductClick: (productSlug: string, e: React.MouseEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayClick(caseItem.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        delay: index * 0.05,
      }}
      className="flex-shrink-0"
    >
      <Link
        to={`/work/${caseItem.slug}`}
        onClick={onCardClick}
        className={cn(
          "group block relative",
          "w-[240px] md:w-[280px] lg:w-[300px]",
          "aspect-[9/16]",
          "rounded-2xl",
          "overflow-hidden",
          "bg-neutral-900",
          "hover:ring-2 hover:ring-cyan-500/40",
          "transition-all duration-300 ease-out",
          !shouldReduceMotion && "md:hover:-translate-y-2 md:hover:scale-[1.02] md:hover:shadow-lg"
        )}
      >
        {/* Video/Image Background */}
        <div className="absolute inset-0">
          {caseItem.coverImage ? (
            <img
              src={caseItem.coverImage}
              alt={caseItem.title}
              width={900}
              height={1600}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500",
                !isMobile && "group-hover:scale-105"
              )}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted/60 to-muted/20" />
          )}

          {/* Video overlay when playing */}
          {caseItem.coverVideo && isPlaying && (
            <video
              ref={videoRef}
              src={caseItem.coverVideo}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Play Button - Center */}
        {caseItem.coverVideo && !isPlaying && (
          <button
            onClick={handlePlayClick}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-14 h-14 md:w-16 md:h-16",
              "rounded-full",
              "bg-white/20 backdrop-blur-md",
              "border border-white/30",
              "flex items-center justify-center",
              "transition-all duration-300",
              "hover:bg-white/30 hover:scale-110",
              "active:scale-95",
              "z-20"
            )}
            aria-label="Воспроизвести видео"
          >
            <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white ml-1" />
          </button>
        )}

        {/* Stop button when playing */}
        {isPlaying && (
          <button
            onClick={handlePlayClick}
            className={cn(
              "absolute top-4 right-4",
              "w-10 h-10",
              "rounded-full",
              "bg-black/50 backdrop-blur-sm",
              "border border-white/20",
              "flex items-center justify-center",
              "transition-all duration-200",
              "hover:bg-black/70",
              "z-20"
            )}
            aria-label="Остановить видео"
          >
            <div className="w-3 h-3 bg-white rounded-sm" />
          </button>
        )}

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
          {/* Category Badge */}
          <span
            className={cn(
              "inline-block mb-2",
              "px-2.5 py-1 rounded-lg",
              "text-xs font-medium",
              "border",
              caseItem.tag.color
            )}
          >
            {caseItem.tag.label}
          </span>

          {/* Title */}
          <h3 className="text-sm md:text-base font-bold text-white/90 mb-1 line-clamp-2">
            {caseItem.title}
          </h3>

          {/* Result */}
          <p className="text-xs md:text-sm text-white/80 font-medium line-clamp-1 mb-2">
            {caseItem.result}
          </p>

          {/* CTA: Смотреть кейс — карточка целиком Link, визуально выделяем */}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
            Смотреть кейс →
          </span>

          {/* Заказать такой (if product) — button to avoid nested <a> */}
          {caseItem.tag.productSlug && (
            <button
              onClick={(e) => onProductClick(caseItem.tag.productSlug!, e)}
              className={cn(
                "mt-2 block text-xs font-medium text-cyan-400 hover:text-cyan-300",
                "transition-colors hover:underline",
                "bg-transparent border-none cursor-pointer p-0 text-left"
              )}
            >
              Заказать такой →
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

interface VideoCasesSliderProps {
  title?: string;
  sectionId?: string;
}

export function VideoCasesSlider({ title, sectionId }: VideoCasesSliderProps = {}) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [sliderWidth, setSliderWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Track drag state with refs for immediate access
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  // Smoother spring config
  const x = useMotionValue(0);
  const springConfig = isMobile
    ? { stiffness: 200, damping: 30, mass: 0.8 }
    : { stiffness: 300, damping: 35, mass: 0.5 };
  const springX = useSpring(x, springConfig);

  // Get featured cases with video preview support
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

  // Calculate dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && sliderRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setSliderWidth(sliderRef.current.scrollWidth);
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [featuredCases.length]);

  const maxDrag = Math.min(0, containerWidth - sliderWidth - 32);

  // Update scroll indicators
  useEffect(() => {
    const updateScrollIndicators = () => {
      const currentX = x.get();
      setCanScrollLeft(currentX < -10);
      setCanScrollRight(currentX > maxDrag + 10);
    };

    const unsubscribe = x.on("change", updateScrollIndicators);
    updateScrollIndicators();

    return () => unsubscribe();
  }, [x, maxDrag]);

  const handleDragStart = useCallback((_: unknown, info: PanInfo) => {
    isDraggingRef.current = true;
    hasDragged.current = false;
    dragStartPos.current = { x: info.point.x, y: info.point.y };
    setPlayingVideo(null); // Stop video on drag
  }, []);

  const handleDrag = useCallback((_: unknown, info: PanInfo) => {
    const dx = Math.abs(info.point.x - dragStartPos.current.x);
    const dy = Math.abs(info.point.y - dragStartPos.current.y);
    if (dx > 5 || dy > 5) {
      hasDragged.current = true;
    }
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      isDraggingRef.current = false;

      const currentX = x.get();
      const velocity = info.velocity.x;

      const inertiaMultiplier = isMobile ? 0.5 : 0.35;
      let targetX = currentX + velocity * inertiaMultiplier;

      targetX = Math.max(maxDrag, Math.min(0, targetX));
      x.set(targetX);

      setTimeout(() => {
        hasDragged.current = false;
      }, 50);
    },
    [x, maxDrag, isMobile]
  );

  // Handle click with drag detection
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Handle play button click
  const handlePlayClick = useCallback((slug: string) => {
    setPlayingVideo((prev) => (prev === slug ? null : slug));
  }, []);

  // Handle product link click - navigate without nested <a>
  const handleProductClick = useCallback((productSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${productSlug}`);
  }, [navigate]);

  // Navigation arrows: mobile 1 col, tablet/desktop use wider cards
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
  const scrollAmount = cardWidth + CARD_GAP;

  const scrollLeft = useCallback(() => {
    const currentX = x.get();
    const newX = Math.min(0, currentX + scrollAmount * 2);
    x.set(newX);
  }, [x, scrollAmount]);

  const scrollRight = useCallback(() => {
    const currentX = x.get();
    const newX = Math.max(maxDrag, currentX - scrollAmount * 2);
    x.set(newX);
  }, [x, maxDrag, scrollAmount]);

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

          {/* Desktop Navigation */}
          <div className="flex items-center gap-3">
            {/* Arrows - Desktop only */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={cn(
                  "w-10 h-10 rounded-full",
                  "flex items-center justify-center",
                  "border transition-all duration-200",
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
                  "w-10 h-10 rounded-full",
                  "flex items-center justify-center",
                  "border transition-all duration-200",
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
                "inline-flex items-center gap-1.5",
                "text-sm font-medium",
                "text-muted-foreground hover:text-foreground",
                "transition-colors duration-200"
              )}
            >
              Все кейсы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </Container>

      {/* Slider Container */}
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
            "flex gap-4",
            "cursor-grab active:cursor-grabbing",
            "pl-4 md:pl-6 lg:pl-[max(1.5rem,calc((100vw-1440px)/2+2rem))]",
            "pr-[20%] md:pr-[15%] lg:pr-[10%]",
            "select-none"
          )}
        >
          {featuredCases.map((caseItem, index) => (
            <CaseCard
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
