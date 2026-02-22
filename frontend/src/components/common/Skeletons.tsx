import { memo } from "react";
import { cn } from "@/lib/utils";

// Image skeleton with shimmer effect
export const ImageSkeleton = memo(function ImageSkeleton({ 
  className,
  aspectRatio = "aspect-video"
}: { 
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted/30 rounded-lg", aspectRatio, className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
    </div>
  );
});

// Product card skeleton
export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 bg-muted/20 border border-border/50">
      {/* Icon skeleton */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-muted/40 animate-pulse mb-3 sm:mb-4" />
      
      {/* Title skeleton */}
      <div className="h-5 sm:h-6 w-3/4 bg-muted/40 rounded animate-pulse mb-2" />
      
      {/* Description skeleton - hidden on mobile */}
      <div className="hidden sm:block space-y-2 mb-4 md:mb-6">
        <div className="h-3 sm:h-4 w-full bg-muted/30 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-2/3 bg-muted/30 rounded animate-pulse" />
      </div>
      
      {/* Price & Timeline skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-5">
        <div className="h-5 w-24 bg-muted/40 rounded animate-pulse" />
        <div className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
      </div>
      
      {/* Button skeleton */}
      <div className="w-full h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl bg-muted/30 animate-pulse" />
    </div>
  );
});

// Case card skeleton
export const CaseCardSkeleton = memo(function CaseCardSkeleton() {
  return (
    <div className="rounded-2xl md:rounded-[20px] overflow-hidden bg-muted/20 border border-border/50 aspect-[4/3] relative">
      {/* Image area */}
      <div className="absolute inset-0 bg-muted/30 animate-pulse" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        {/* Badge skeleton */}
        <div className="h-5 w-16 bg-muted/40 rounded-full animate-pulse mb-2 md:mb-3" />
        
        {/* Title skeleton */}
        <div className="h-5 md:h-6 w-3/4 bg-muted/40 rounded animate-pulse mb-2" />
        
        {/* Result skeleton */}
        <div className="h-4 md:h-5 w-1/2 bg-muted/30 rounded animate-pulse mb-3 md:mb-4" />
        
        {/* Button skeleton */}
        <div className="h-8 w-28 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    </div>
  );
});

// FAQ item skeleton
export const FAQSkeleton = memo(function FAQSkeleton() {
  return (
    <div className="border border-border/50 rounded-xl p-4 md:p-6 bg-muted/10">
      <div className="flex items-center justify-between">
        <div className="h-5 w-3/4 bg-muted/40 rounded animate-pulse" />
        <div className="h-5 w-5 bg-muted/30 rounded animate-pulse" />
      </div>
    </div>
  );
});

// Section header skeleton
export const SectionHeaderSkeleton = memo(function SectionHeaderSkeleton() {
  return (
    <div className="text-center mb-10 md:mb-16">
      <div className="h-10 md:h-12 w-64 mx-auto bg-muted/40 rounded-lg animate-pulse mb-3 md:mb-4" />
      <div className="h-5 md:h-6 w-80 mx-auto bg-muted/30 rounded animate-pulse" />
    </div>
  );
});

// Products section skeleton
export const ProductsSectionSkeleton = memo(function ProductsSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-[1440px] mx-auto container-mobile px-5 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

// Cases section skeleton
export const CasesSectionSkeleton = memo(function CasesSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-[1440px] mx-auto container-mobile px-5 sm:px-6 lg:px-8">
        <SectionHeaderSkeleton />
        
        {/* Filter buttons skeleton */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="h-11 w-20 bg-muted/30 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CaseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

// Generic content skeleton
export const ContentSkeleton = memo(function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            "h-4 bg-muted/40 rounded animate-pulse",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
});

// Hero skeleton
export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-4">
        {/* Title skeleton */}
        <div className="h-12 md:h-16 lg:h-20 w-full max-w-3xl mx-auto bg-muted/30 rounded-xl animate-pulse mb-6" />
        
        {/* Subtitle skeleton */}
        <div className="h-6 w-full max-w-xl mx-auto bg-muted/20 rounded animate-pulse mb-4" />
        <div className="h-6 w-2/3 max-w-md mx-auto bg-muted/20 rounded animate-pulse mb-8" />
        
        {/* CTA skeleton */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-12 w-40 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-12 w-32 bg-muted/30 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
});
