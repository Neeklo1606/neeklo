import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Container } from "@/components/common/Container";
import type { CmsBlock } from "./BlockRenderer";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlockFAQData {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
}

export function BlockFAQ({ block }: { block: CmsBlock }) {
  const d = (block.data || {}) as BlockFAQData;
  const items = Array.isArray(d.items) ? d.items : [];
  const title = d.title || "Частые вопросы";
  const subtitle = d.subtitle;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-6 sm:py-12 md:py-24 bg-background relative overflow-hidden">
      <motion.div
        style={shouldReduceMotion ? {} : { y: y1 }}
        className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={shouldReduceMotion ? {} : { y: y2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
      />

      <Container className="relative z-10">
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-10 md:mb-14 max-w-xl mx-auto px-2"
            >
              {subtitle}
            </motion.p>
          )}
          {!subtitle && <div className="mb-8 sm:mb-10 md:mb-14" />}

          <div className="space-y-0 border-t border-border">
            {items.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : index * 0.05,
                }}
                className="border-b border-border"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full min-h-[48px] sm:min-h-0 py-4 sm:py-5 md:py-6 flex items-center justify-between gap-3 sm:gap-4 text-left group transition-colors duration-300 hover:text-primary active:bg-muted/30 touch-manipulation rounded-none"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 pr-2">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="flex-shrink-0 w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center"
                    aria-hidden
                  >
                    <ChevronDown
                      size={22}
                      className="text-muted-foreground group-hover:text-primary transition-colors duration-300 sm:w-5 sm:h-5"
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.4,
                        ease: "easeOut",
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 sm:pb-5 md:pb-6 pr-10 sm:pr-12 pl-0">
                        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 md:hidden">
            <Link
              to="/services"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-lg min-h-[44px] bg-muted border border-border text-sm font-medium text-primary hover:bg-muted/80 hover:border-primary/30 transition-all duration-200"
            >
              Все услуги
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
