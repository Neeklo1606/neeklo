"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { 
  Globe, Video, Bot, Smartphone, ArrowRight, Sparkles, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Link } from "react-router-dom";
import { BriefWizard } from "@/components/hero/BriefWizard";

// Solution types with routing
const SOLUTIONS = [
  { 
    id: "website", 
    label: "Сайт", 
    icon: Globe, 
    href: "/products/website",
    prefill: "Нужен сайт. Хочу заявки и удобный процесс."
  },
  { 
    id: "bot", 
    label: "Бот", 
    icon: Bot, 
    href: "/products/telegram-bot",
    prefill: "Нужен Telegram-бот для автоматизации."
  },
  { 
    id: "content", 
    label: "Контент", 
    icon: Video, 
    href: "/products/ai-video",
    prefill: "Нужен видео-контент для продвижения."
  },
  { 
    id: "miniapp", 
    label: "Mini App", 
    icon: Smartphone, 
    href: "/products/mini-app",
    prefill: "Нужен Mini App в Telegram."
  },
] as const;

type SolutionId = typeof SOLUTIONS[number]["id"];

export function TaskAIWizard() {
  const [selectedNeed, setSelectedNeed] = useState<SolutionId | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleSolutionSelect = useCallback((id: SolutionId) => {
    setSelectedNeed(prev => prev === id ? null : id);
  }, []);

  const handleOpenWizard = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handleCloseWizard = useCallback(() => {
    setIsWizardOpen(false);
  }, []);

  // Get prefill text based on selection
  const getPrefillText = () => {
    if (!selectedNeed) return "";
    const solution = SOLUTIONS.find(s => s.id === selectedNeed);
    return solution?.prefill || "";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <>
      <section className="py-12 md:py-16 relative overflow-hidden">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Main Panel - Glass Card */}
            <motion.div
              variants={itemVariants}
              className={cn(
                "relative p-6 md:p-10 lg:p-12",
                "rounded-[20px] lg:rounded-[28px]",
                "bg-white/[0.04] backdrop-blur-3xl",
                "border border-white/[0.08]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              )}
            >
              {/* Scrootie Helper - Mobile: top, Desktop: right */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                
                {/* Scrootie Avatar Block */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-2 lg:min-w-[100px] lg:pt-2"
                >
                  <div className={cn(
                    "w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl",
                    "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent",
                    "border border-primary/20",
                    "flex items-center justify-center",
                    "shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                  )}>
                    <Sparkles className="w-7 h-7 lg:w-10 lg:h-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground lg:text-center lg:text-xs lg:max-w-[100px] leading-snug">
                    Я подскажу, что лучше под вашу задачу
                  </p>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 space-y-6 lg:space-y-8">
                  {/* Header */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      Скрутик поможет выбрать решение
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                      Выберите, что нужно — подготовим вариант и запустим под ключ за 7–14 дней
                    </p>
                  </motion.div>

                  {/* Quick Select Grid - "Что вам нужно?" */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <p className="text-sm font-medium text-foreground/70">Что вам нужно?</p>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      {SOLUTIONS.map((solution) => {
                        const Icon = solution.icon;
                        const isSelected = selectedNeed === solution.id;
                        
                        return (
                          <motion.button
                            key={solution.id}
                            onClick={() => handleSolutionSelect(solution.id)}
                            whileTap={{ scale: 0.97 }}
                            whileHover={!isMobile ? { y: -2 } : undefined}
                            className={cn(
                              "flex items-center gap-3 p-4 lg:p-5",
                              "min-h-[56px] lg:min-h-[64px]",
                              "rounded-2xl lg:rounded-xl",
                              "border transition-all duration-200",
                              "text-left",
                              isSelected
                                ? "bg-primary/15 border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                                : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                              isSelected 
                                ? "bg-primary/20" 
                                : "bg-white/[0.06]"
                            )}>
                              <Icon className={cn(
                                "w-5 h-5",
                                isSelected ? "text-primary" : "text-foreground/70"
                              )} />
                            </div>
                            <span className={cn(
                              "font-medium text-sm lg:text-base",
                              isSelected ? "text-primary" : "text-foreground"
                            )}>
                              {solution.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div variants={itemVariants} className="space-y-3 pt-2">
                    {/* Primary CTA */}
                    <motion.button
                      onClick={handleOpenWizard}
                      whileTap={{ scale: 0.98 }}
                      whileHover={!isMobile ? { scale: 1.01 } : undefined}
                      className={cn(
                        "w-full h-14 lg:h-16 rounded-2xl",
                        "bg-gradient-to-r from-primary via-primary to-primary/90",
                        "text-primary-foreground font-semibold text-base lg:text-lg",
                        "flex items-center justify-center gap-2",
                        "shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)]",
                        "hover:shadow-[0_6px_30px_rgba(var(--primary-rgb),0.4)]",
                        "transition-shadow duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      )}
                    >
                      Подобрать решение
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    {/* Secondary Link */}
                    <Link
                      to="/products"
                      className={cn(
                        "flex items-center justify-center gap-2",
                        "w-full h-12 rounded-xl",
                        "text-muted-foreground hover:text-foreground",
                        "text-sm font-medium",
                        "transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      )}
                    >
                      Смотреть все продукты
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Brief Wizard Modal */}
      <BriefWizard
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        initialInput={getPrefillText()}
      />
    </>
  );
}
