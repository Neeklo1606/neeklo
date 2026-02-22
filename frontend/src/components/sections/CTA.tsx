import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { QuickOrderForm } from "@/components/common/QuickOrderForm";
import { useAnimationVariants } from "@/hooks/useScrollAnimation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const CTA = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const { variants, shouldReduceMotion } = useAnimationVariants();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  return (
    <>
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Parallax Background Effects */}
        <div className="absolute inset-0 -z-10">
          <motion.div 
            style={prefersReducedMotion ? {} : { y: y1, scale }}
            className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-[100px] sm:blur-[120px]" 
          />
          <motion.div 
            style={prefersReducedMotion ? {} : { y: y2 }}
            className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-[100px] sm:blur-[120px]" 
          />
        </div>

        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={variants.fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Готовы обсудить
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ваш проект?
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 px-4">
              Оставьте заявку — свяжемся в течение часа
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="group"
                  onClick={() => setIsOrderFormOpen(true)}
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Быстрый заказ
                </Button>
              </motion.div>
              <motion.a 
                href="https://t.me/neeekn" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="group">
                  Написать в Telegram
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <QuickOrderForm 
        isOpen={isOrderFormOpen} 
        onClose={() => setIsOrderFormOpen(false)} 
      />
    </>
  );
};
