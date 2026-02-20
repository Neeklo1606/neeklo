import { memo, useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  /** Load immediately without waiting for intersection */
  priority?: boolean;
  /** Placeholder image or blur data URL */
  placeholder?: string;
  /** Aspect ratio for placeholder (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Additional sizes for responsive loading */
  sizes?: string;
  /** Container className */
  containerClassName?: string;
  /** Callback when image loads */
  onImageLoad?: () => void;
}

/**
 * Optimized lazy loading image component for improved LCP
 * - Uses native loading="lazy" for below-fold images
 * - Supports priority loading for above-fold/LCP images
 * - Includes placeholder with smooth fade transition
 * - Responsive with proper sizes attribute
 */
export const LazyImage = memo(function LazyImage({
  src,
  alt,
  priority = false,
  placeholder,
  aspectRatio,
  sizes = '100vw',
  className,
  containerClassName,
  onImageLoad,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const intrinsicWidth = 1600;
  const intrinsicHeight = 900;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Intersection Observer for non-priority images
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onImageLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Stop showing skeleton on error
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 to-muted/30"
          aria-hidden="true"
        />
      )}

      {/* Blur placeholder if provided */}
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

      {/* Main image - only render when in view */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={intrinsicWidth}
          height={intrinsicHeight}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
});
