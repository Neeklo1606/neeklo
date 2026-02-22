import { motion } from "framer-motion";
import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Container } from "@/components/common/Container";

interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface CaseGalleryProps {
  items: GalleryItem[];
}

interface LazyGalleryItemProps {
  item: GalleryItem;
  index: number;
}

const LazyGalleryItem = memo(function LazyGalleryItem({ item, index }: LazyGalleryItemProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 aspect-video"
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse flex items-center justify-center">
          <div className="text-6xl font-heading font-bold text-white/10">
            {item.type === "image" ? index + 1 : `Video ${index + 1}`}
          </div>
        </div>
      )}

      {isInView && (
        item.type === "image" ? (
          <img
            src={item.src}
            alt={item.alt || `Gallery image ${index + 1}`}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <video
            src={item.src}
            controls
            preload="metadata"
            playsInline
            onLoadedData={handleLoad}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      )}
    </motion.div>
  );
});

export const CaseGallery = memo(function CaseGallery({ items }: CaseGalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="space-y-12">
          {items.map((item, index) => (
            <LazyGalleryItem key={index} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
});
