"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Globe, Video, Bot, Smartphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Link } from "react-router-dom";

// Direction cards data
const DIRECTIONS = [
  {
    id: "websites",
    title: "Сайты",
    subtitle: "Лендинг, сайт, магазин",
    icon: Globe,
    href: "/products/website",
  },
  {
    id: "video",
    title: "Видео",
    subtitle: "Reels, промо, AI-вставки",
    icon: Video,
    href: "/products/ai-video",
  },
  {
    id: "bots",
    title: "Боты",
    subtitle: "Продажи, заявки, поддержка",
    icon: Bot,
    href: "/products/telegram-bot",
  },
  {
    id: "miniapp",
    title: "Mini App",
    subtitle: "Каталог, заказ, личный кабинет",
    icon: Smartphone,
    href: "/products/mini-app",
  },
] as const;

export function DirectionsSection() {
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="space-y-8 md:space-y-10"
        >
          {/* Section Header - minimal */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Направления
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Выберите формат — покажем примеры и стоимость
            </p>
          </motion.div>

          {/* Directions Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {DIRECTIONS.map((direction, index) => {
              const Icon = direction.icon;
              
              return (
                <motion.div
                  key={direction.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={direction.href}
                    className={cn(
                      "group block h-full",
                      "p-5 md:p-6 lg:p-7",
                      "rounded-[20px] lg:rounded-[24px]",
                      "bg-foreground/[0.02] dark:bg-white/[0.03]",
                      "border border-foreground/[0.06] dark:border-white/[0.06]",
                      "hover:bg-foreground/[0.04] dark:hover:bg-white/[0.05]",
                      "hover:border-foreground/[0.1] dark:hover:border-white/[0.1]",
                      "active:bg-foreground/[0.06] dark:active:bg-white/[0.06]",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    )}
                  >
                    <motion.div
                      whileHover={!isMobile ? { y: -4 } : undefined}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col gap-3 md:gap-4"
                    >
                      {/* Icon */}
                      <div className={cn(
                        "w-12 h-12 md:w-14 md:h-14",
                        "rounded-xl lg:rounded-2xl",
                        "bg-primary/10 dark:bg-primary/15",
                        "border border-primary/15 dark:border-primary/20",
                        "flex items-center justify-center",
                        "group-hover:bg-primary/15 dark:group-hover:bg-primary/20",
                        "group-hover:border-primary/25",
                        "transition-colors duration-200"
                      )}>
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                      </div>

                      {/* Text */}
                      <div className="space-y-0.5">
                        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                          {direction.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground/70 leading-relaxed">
                          {direction.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center pt-2"
          >
            <Link
              to="/products"
              className={cn(
                "inline-flex items-center gap-2",
                "text-sm md:text-base font-medium",
                "text-primary hover:text-primary/80",
                "transition-colors duration-200"
              )}
            >
              Смотреть все продукты
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
