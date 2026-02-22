"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BriefWizard } from "@/components/hero/BriefWizard";

export function ScrootieHelper() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleOpenWizard = useCallback(() => {
    setIsWizardOpen(true);
  }, []);

  const handleCloseWizard = useCallback(() => {
    setIsWizardOpen(false);
  }, []);

  return (
    <>
      <section className="py-12 md:py-16 relative overflow-hidden">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: shouldReduceMotion ? 0 : 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            className="max-w-xl mx-auto"
          >
            {/* Compact Card */}
            <div
              className={cn(
                "relative p-6 md:p-8",
                "rounded-[20px] lg:rounded-[24px]",
                "bg-foreground/[0.02] dark:bg-white/[0.03]",
                "border border-foreground/[0.06] dark:border-white/[0.06]",
                "flex flex-col sm:flex-row items-center gap-5 sm:gap-6"
              )}
            >
              {/* Scrootie Icon */}
              <div className={cn(
                "flex-shrink-0",
                "w-14 h-14 md:w-16 md:h-16 rounded-2xl",
                "bg-primary/10 dark:bg-primary/15",
                "border border-primary/20",
                "flex items-center justify-center"
              )}>
                <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>

              {/* Text & CTA */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-foreground">
                    Не знаете, что подойдёт именно вам?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Подскажу решение под вашу задачу
                  </p>
                </div>

                <motion.button
                  onClick={handleOpenWizard}
                  whileTap={{ scale: 0.98 }}
                  whileHover={!isMobile ? { y: -2 } : undefined}
                  className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "px-5 py-2.5 md:px-6 md:py-3",
                    "rounded-xl",
                    "bg-primary text-primary-foreground",
                    "font-medium text-sm",
                    "hover:bg-primary/90",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  )}
                >
                  Подобрать
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Brief Wizard Modal */}
      <BriefWizard
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        initialInput="Помогите выбрать решение для моей задачи."
      />
    </>
  );
}
