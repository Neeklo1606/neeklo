import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Brain, Video, Clock, ArrowRight, Sparkles, Currency, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnimationVariants } from "@/hooks/useScrollAnimation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  icon: any;
  description: string;
  price: string;
  timeline: string;
  slug: string;
  gradient: string;
  glowColor: string;
}

// 3 основных продукта для главной страницы (SEO Яндекс)
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Создание веб сайта",
    icon: Globe,
    description: "Создаём сайты, лендинги и порталы с современной анимацией и высокой конверсией.",
    price: "от 45 000₽",
    timeline: "5 дней",
    slug: "website",
    gradient: "from-cyan-500 via-blue-500 to-blue-600",
    glowColor: "cyan",
  },
  {
    id: 2,
    name: "AI Агенты и Чат-боты",
    icon: Brain,
    description: "Умные ассистенты для поддержки клиентов и автоматизации продаж 24/7.",
    price: "от 65 000₽",
    timeline: "10 дней",
    slug: "ai-agent",
    gradient: "from-purple-500 via-violet-500 to-purple-700",
    glowColor: "purple",
  },
  {
    id: 3,
    name: "Видео Нейросети",
    icon: Video,
    description: "AI-генерация видео, цифровые аватары и нейромонтаж без съёмочной группы.",
    price: "от 5 000₽",
    timeline: "3 дня",
    slug: "ai-video",
    gradient: "from-pink-500 via-rose-500 to-purple-600",
    glowColor: "pink",
  },
];

export const Products = memo(function Products() {
  const { variants } = useAnimationVariants();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={prefersReducedMotion ? {} : { y: y1 }}
          className="absolute top-10 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          style={prefersReducedMotion ? {} : { y: y2 }}
          className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-gradient-to-l from-purple-500/15 to-pink-500/10 rounded-full blur-[120px]"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>
      
      <div className="max-w-[1400px] mx-auto container-mobile px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants.fadeInUp}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Популярные решения</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
            Наши продукты
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Три главных направления для быстрого роста вашего бизнеса
          </p>
        </motion.div>

        {/* Products Grid - Clean Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => {
            const Icon = product.icon;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link 
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="block h-full group"
                >
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { 
                      y: -4,
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative h-full flex flex-col"
                  >
                    {/* Card */}
                    <div className={cn(
                      "relative h-full rounded-xl p-6 md:p-8",
                      "bg-background border border-border/50",
                      "shadow-md",
                      "card-hover",
                      "flex flex-col"
                    )}>
                      {/* Icon */}
                      <div className="mb-6">
                        <div className={cn(
                          "w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center",
                          "bg-primary/10 border border-primary/20",
                          "group-hover:bg-primary/15 transition-colors duration-200"
                        )}>
                          <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                        {product.name}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
                        {product.description}
                      </p>

                      {/* Price + Timeline with icons */}
                      <div className="space-y-4 mb-6">
                        {/* Price with icon */}
                        <div className="flex items-center gap-2.5">
                          <Currency className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            {product.price}
                          </span>
                        </div>
                        
                        {/* Duration with icon */}
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <span className="text-base md:text-lg text-muted-foreground">
                            {product.timeline}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className={cn(
                        "w-full py-3 px-5 rounded-lg font-medium text-sm",
                        "bg-primary text-primary-foreground",
                        "hover:bg-primary/90",
                        "shadow-sm hover:shadow-md",
                        "transition-all duration-200",
                        "flex items-center justify-center gap-2",
                        "min-h-[40px]"
                      )}>
                        <MessageCircle className="w-4 h-4" />
                        Обсудить
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all products link */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium group"
          >
            <span>Смотреть все 12 продуктов</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});