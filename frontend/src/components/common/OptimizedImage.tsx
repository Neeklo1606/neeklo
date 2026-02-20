import { useState, useRef, useEffect, ImgHTMLAttributes, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  priority?: boolean;
  fallback?: string;
  aspectRatio?: string;
  sizes?: string;
  blur?: boolean;
}

// Check WebP support once
const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/webp');
    return dataUrl && typeof dataUrl === 'string' && dataUrl.indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
})();

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  priority = false,
  fallback,
  aspectRatio,
  sizes = '100vw',
  blur = true,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading with optimized margin
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Reset state on src change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallback && imgRef.current) {
      imgRef.current.src = fallback;
    }
  };

  // Generate WebP source if browser supports it
  const getWebPSrc = (originalSrc: string) => {
    if (!supportsWebP) return null;
    // For external URLs or data URLs, return original
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
      return null;
    }
    // For local assets, Vite handles WebP conversion via plugins
    return originalSrc;
  };

  const webpSrc = getWebPSrc(src);
  const intrinsicWidth = Number(props.width ?? 1600);
  const intrinsicHeight = Number(props.height ?? 900);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur Placeholder */}
      {blur && !isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/50 to-muted"
          style={{
            backdropFilter: 'blur(20px)',
          }}
        />
      )}

      {/* Image with picture element for WebP support */}
      {isInView && (
        <picture>
          {webpSrc && (
            <source 
              srcSet={webpSrc} 
              type="image/webp"
            />
          )}
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
              'h-full w-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        </picture>
      )}
    </div>
  );
});
