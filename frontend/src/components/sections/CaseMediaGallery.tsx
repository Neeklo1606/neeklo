import { memo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
}

interface CaseMediaGalleryProps {
  items: GalleryItem[];
  title?: string;
}

export const CaseMediaGallery = memo(function CaseMediaGallery({ 
  items, 
  title = 'Галерея' 
}: CaseMediaGalleryProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.h2
          className="text-2xl md:text-3xl font-heading font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="grid gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              {item.type === 'video' ? (
                <VideoPlayer
                  src={item.src}
                  poster={item.poster}
                  title={item.alt}
                  priority={index === 0}
                  className="w-full rounded-2xl shadow-lg"
                />
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface shadow-lg">
                  <img
                    src={item.src}
                    alt={item.alt || `Image ${index + 1}`}
                    width={1280}
                    height={720}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
});
