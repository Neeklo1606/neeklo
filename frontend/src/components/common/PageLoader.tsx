import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommitsGrid } from '@/components/ui/commits-grid';

interface PageLoaderProps {
  minDisplayTime?: number;
}

export const PageLoader = memo(function PageLoader({ minDisplayTime = 400 }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const completeLoader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => setIsVisible(false), remaining);
    };

    if (document.readyState === 'complete') {
      completeLoader();
    } else {
      window.addEventListener('load', completeLoader);
      const fallbackTimeout = setTimeout(completeLoader, 2000);

      return () => {
        window.removeEventListener('load', completeLoader);
        clearTimeout(fallbackTimeout);
      };
    }
  }, [minDisplayTime]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 sm:gap-4"
          >
            <CommitsGrid text="neeklo" className="max-w-[280px] sm:max-w-[320px]" />
            <CommitsGrid text="studio" className="max-w-[280px] sm:max-w-[320px]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
