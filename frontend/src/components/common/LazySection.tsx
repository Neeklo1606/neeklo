import { ReactNode, memo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  fallback?: ReactNode;
}

export const LazySection = memo(function LazySection({
  children,
  className,
  rootMargin = '0px',
  fallback
}: LazySectionProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={cn('min-h-[100px]', className)}>
      {isVisible ? children : (fallback || <div className="animate-pulse bg-muted/20 h-[300px] rounded-xl" />)}
    </div>
  );
});
