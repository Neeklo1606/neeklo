import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";
import { useAnimationVariants, staggerContainer, cardReveal } from "@/hooks/useScrollAnimation";
import { CaseCardSkeleton } from "@/components/common/Skeletons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import casesData from "@/data/cases.json";

// Import case cover images
import povuzamCover from "@/assets/cases/povuzam-cover.jpg";
import batnortonCover from "@/assets/cases/batnorton-cover.jpg";
import mnkaCover from "@/assets/cases/mnka-cover.jpg";
import glampingCover from "@/assets/cases/glamping-cover.jpg";
import aiAgentCover from "@/assets/cases/ai-agent-cover.jpg";
import aiVideoCover from "@/assets/cases/ai-video-cover.jpg";

type CaseCategory = "Все" | "AI" | "Web" | "Telegram" | "Video" | "Branding";

const categories: CaseCategory[] = ["Все", "AI", "Web", "Telegram", "Video", "Branding"];

const categoryColors: Record<string, string> = {
  "Web": "#00d4ff",
  "AI": "#8b5cf6",
  "AI-Video": "#ff6bff",
  "TG-Bot": "#4f8fff",
  "Mini-App": "#4f8fff",
  "Video": "#ff6bff",
  "Branding": "#00ff88",
  "Consulting": "#fbbf24",
};

// Map case slugs to cover images
const coverImages: Record<string, string> = {
  "povuzam": povuzamCover,
  "batnorton": batnortonCover,
  "mnka": mnkaCover,
  "glamping": glampingCover,
  "ai-agent": aiAgentCover,
  "ai-video": aiVideoCover,
};

type ApiCase = { id: number | string; slug: string; title: string; category: string; featured?: boolean; description?: string };

function mapApiCase(c: ApiCase) {
  const cat = c.category === "TG-Bot" || c.category === "Mini-App" ? "Telegram" :
              c.category === "AI-Video" ? "Video" :
              (c.category as CaseCategory);
  return {
    id: c.id,
    slug: c.slug,
    client: c.title,
    category: cat,
    result: c.description || "Успешный проект",
    color: categoryColors[c.category] || "#00d4ff",
    coverImage: coverImages[c.slug] || null,
  };
}

export const FeaturedWork = () => {
  const [activeCategory, setActiveCategory] = useState<CaseCategory>("Все");
  const { shouldReduceMotion, variants } = useAnimationVariants();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // Static fallback cases
  const staticFeatured = casesData
    .filter(c => c.featured)
    .slice(0, 6)
    .map(c => ({
      id: c.id,
      slug: c.slug,
      client: c.title,
      category: (c.category === "TG-Bot" || c.category === "Mini-App" ? "Telegram" :
                 c.category === "AI-Video" ? "Video" :
                 c.category) as CaseCategory,
      result: c.results[0] || "Успешный проект",
      color: categoryColors[c.category] || "#00d4ff",
      coverImage: coverImages[c.slug] || null,
    }));

  const [featuredCases, setFeaturedCases] = useState(staticFeatured);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Попытка загрузки из API; fallback — статические данные
  useEffect(() => {
    fetch("/api/cases")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: ApiCase[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiMapped = data.filter(c => c.featured !== false).slice(0, 6).map(mapApiCase);
          if (apiMapped.length > 0) setFeaturedCases(apiMapped as typeof staticFeatured);
        }
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  const filteredCases = activeCategory === "Все" 
    ? featuredCases 
    : featuredCases.filter(c => c.category === activeCategory);

  return (
    <section id="cases" className="py-12 md:py-16 bg-background relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto container-mobile px-5 sm:px-6 lg:px-8">
        {/* Header - minimal */}
        <motion.div 
          className="text-center mb-10 md:mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-foreground">
            Кейсы
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Реальные результаты для реальных клиентов
          </p>
        </motion.div>

        {/* Simplified filter - just show all cases without filters on main */}

        {/* Cases Grid - cleaner */}

        {/* Cases Grid with stagger animation */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CaseCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={shouldReduceMotion ? {} : staggerContainer}
          >
            <AnimatePresence mode="popLayout">
              {filteredCases.map((caseItem) => (
                <motion.div
                  key={caseItem.id}
                  layout
                  variants={shouldReduceMotion ? {} : cardReveal}
                  whileHover={shouldReduceMotion ? {} : { 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className="group"
                >
                  <Link to={`/work/${caseItem.slug}`}>
                    <div className="cursor-pointer rounded-2xl md:rounded-[20px] overflow-hidden glass-card relative aspect-[4/3] hover:border-primary/50 transition-all duration-500">
                      {/* Case Cover Image or Abstract Pattern Placeholder */}
                      {caseItem.coverImage ? (
                        <img 
                          src={caseItem.coverImage} 
                          alt={caseItem.client}
                          width={800}
                          height={600}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 overflow-hidden">
                          {/* Abstract geometric pattern placeholder */}
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/80 via-muted/40 to-background" />
                          <div 
                            className="absolute inset-0 opacity-30"
                            style={{
                              backgroundImage: `
                                linear-gradient(135deg, ${caseItem.color}20 25%, transparent 25%),
                                linear-gradient(225deg, ${caseItem.color}20 25%, transparent 25%),
                                linear-gradient(45deg, ${caseItem.color}15 25%, transparent 25%),
                                linear-gradient(315deg, ${caseItem.color}15 25%, transparent 25%)
                              `,
                              backgroundSize: '40px 40px',
                              backgroundPosition: '0 0, 20px 0, 20px -20px, 0 20px',
                            }}
                          />
                          {/* Gradient border effect */}
                          <div 
                            className="absolute inset-0 rounded-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${caseItem.color}30, transparent 50%, ${caseItem.color}20)`,
                              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                              maskComposite: 'xor',
                              padding: '2px',
                            }}
                          />
                          {/* Floating geometric shapes */}
                          <div 
                            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full opacity-20 blur-sm"
                            style={{ backgroundColor: caseItem.color }}
                          />
                          <div 
                            className="absolute bottom-1/3 right-1/4 w-24 h-24 rotate-45 opacity-15 blur-sm"
                            style={{ backgroundColor: caseItem.color }}
                          />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent group-hover:from-background/95 transition-all duration-500" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                        {/* Category Badge - Enhanced contrast */}
                        <span 
                          className="inline-block mb-2 md:mb-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border transition-all duration-300 md:group-hover:scale-105"
                          style={{
                            backgroundColor: `${caseItem.color}25`,
                            borderColor: `${caseItem.color}50`,
                            color: caseItem.color,
                            textShadow: `0 0 10px ${caseItem.color}40`,
                          }}
                        >
                          {caseItem.category}
                        </span>

                        {/* Client Name */}
                        <h3 className="text-base md:text-xl font-semibold text-foreground mb-1.5 md:mb-2 line-clamp-2">
                          {caseItem.client}
                        </h3>

                        {/* Result Metric */}
                        <p className="text-sm md:text-base font-semibold text-primary mb-3 md:mb-4">
                          {caseItem.result}
                        </p>

                        {/* View Button - Appears on Hover */}
                        <div className="opacity-0 md:group-hover:opacity-100 translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
                          Смотреть кейс
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3 }}
          className="text-center mt-10 md:mt-12"
        >
          <Link 
            to="/work"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Все проекты
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
