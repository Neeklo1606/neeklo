import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface CaseItemData {
  id: number;
  slug: string;
  title: string;
  category: string;
  tag: { label: string; color: string; productSlug?: string };
  result: string;
  coverImage: string | null;
  coverVideo: string | null;
}

export interface VideoCaseCardProps {
  caseItem: CaseItemData;
  index: number;
  isMobile: boolean;
  shouldReduceMotion: boolean;
  onCardClick: (e: React.MouseEvent) => void;
  isPlaying: boolean;
  onPlayClick: (slug: string) => void;
  onProductClick: (productSlug: string, e: React.MouseEvent) => void;
}

export const VideoCaseCard = memo(function VideoCaseCard({
  caseItem,
  index,
  isMobile,
  shouldReduceMotion,
  onCardClick,
  isPlaying,
  onPlayClick,
  onProductClick,
}: VideoCaseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
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

        {/* Play Button */}
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

        {/* Stop Button */}
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

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
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

          <h3 className="text-sm md:text-base font-bold text-white/90 mb-1 line-clamp-2">
            {caseItem.title}
          </h3>

          <p className="text-xs md:text-sm text-white/80 font-medium line-clamp-1 mb-2">
            {caseItem.result}
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
            Смотреть кейс →
          </span>

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
