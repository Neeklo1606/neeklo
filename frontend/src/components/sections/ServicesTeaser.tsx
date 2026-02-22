import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ArrowRight, Globe, Palette, Video, Sparkles, Bot, Database, Smartphone, Settings, Layers, FileText, ShoppingCart, Cpu, Clapperboard, Presentation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import servicesData from "@/data/services.json";

const iconMap: Record<string, any> = {
  globe: Globe,
  palette: Palette,
  video: Video,
  sparkles: Sparkles,
  bot: Bot,
  database: Database,
  smartphone: Smartphone,
  settings: Settings,
  layers: Layers,
  "file-text": FileText,
  "shopping-cart": ShoppingCart,
  cpu: Cpu,
  clapperboard: Clapperboard,
  presentation: Presentation,
};

type CategoryId = "development" | "ai" | "design";

const categoryTabs = servicesData.categories.sort((a, b) => a.order - b.order);

export const ServicesTeaser = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("development");
  const shouldReduceMotion = usePrefersReducedMotion();

  const filteredServices = servicesData.services
    .filter(s => s.category === activeCategory)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 sm:py-16 md:py-16 bg-card/30">
      <Container>
        <SectionTitle
          title="Наши услуги"
          subtitle="Полный спектр digital-решений для вашего бизнеса"
          align="center"
        />

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="mb-8 md:mb-12"
        >
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {categoryTabs.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as CategoryId)}
                  className={`
                    h-10 px-5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-glow-primary"
                      : "bg-secondary/50 border border-border text-foreground"
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Centered tabs */}
          <div className="hidden md:flex items-center justify-center gap-2">
            {categoryTabs.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: shouldReduceMotion ? 0 : 0.3, 
                  delay: shouldReduceMotion ? 0 : index * 0.08 
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => setActiveCategory(category.id as CategoryId)}
                className={`
                  h-12 px-8 rounded-full text-[15px] font-medium transition-all duration-300
                  ${activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-glow-primary"
                    : "bg-transparent border border-border text-foreground hover:border-primary"
                  }
                `}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Globe;
              
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0 : 0.3,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                    layout: { duration: 0.25 }
                  }}
                >
                  <Link to={`/services/${service.slug}`}>
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { 
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group p-5 md:p-6 rounded-2xl bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,212,255,0.15)] cursor-pointer h-full min-h-[140px]"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon with glow */}
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                          style={{ 
                            backgroundColor: `${service.accentColor}15`,
                          }}
                        >
                          <Icon 
                            className="w-6 h-6 transition-colors duration-300" 
                            style={{ color: service.accentColor }}
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {service.title}
                            </h3>
                            <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {service.excerpt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 px-8 rounded-xl font-medium text-[15px] bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              Все услуги
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};
