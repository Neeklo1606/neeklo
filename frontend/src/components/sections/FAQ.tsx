import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { defaultFaqs } from "@/data/faq";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={shouldReduceMotion ? {} : { y: y1 }}
        className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        style={shouldReduceMotion ? {} : { y: y2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
      />
      
      <div className="max-w-[900px] mx-auto container-mobile px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-14 md:mb-16 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
        >
          Частые вопросы
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-0">
          {defaultFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: shouldReduceMotion ? 0 : 0.4, 
                delay: shouldReduceMotion ? 0 : index * 0.05 
              }}
              className="border-b border-border"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-5 flex items-center justify-between gap-3 sm:gap-4 text-left group transition-colors duration-300 hover:text-primary"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown 
                    size={20} 
                    className="text-muted-foreground group-hover:text-primary transition-colors duration-300" 
                  />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.25,
                      ease: "easeOut",
                    }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0">
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
      </div>
    </section>
  );
};
