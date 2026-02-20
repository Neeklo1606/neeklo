import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "auto";
  /** Load immediately for LCP-critical images */
  priority?: boolean;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  srcSet?: string;
  /** Placeholder blur data URL */
  placeholder?: string;
  /** Callback when image loads */
  onLoad?: () => void;
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  auto: "",
};

export const ResponsiveImage = memo(function ResponsiveImage({ 
  src, 
  alt, 
  className, 
  aspectRatio = "video",
  priority = false,
  webpSrc,
  avifSrc,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  srcSet,
  placeholder,
  onLoad
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const intrinsicWidth = 1600;
  const intrinsicHeight = 900;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading with larger margin
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Reset loaded state on src change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Check if image is already cached
  useEffect(() => {
    if (!isInView || !imgRef.current) return;
    
    if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [isInView, onLoad]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted/20", aspectClasses[aspectRatio], className)}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 to-muted/30" 
          aria-hidden="true"
        />
      )}

      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          width={intrinsicWidth}
          height={intrinsicHeight}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-105"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <span className="text-muted-foreground text-sm">Изображение недоступно</span>
        </div>
      )}
      
      {isInView && !hasError && (
        <picture>
          {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={intrinsicWidth}
            height={intrinsicHeight}
            srcSet={srcSet}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </picture>
      )}
    </div>
  );
});