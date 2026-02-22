import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "../common/Container";
import { BriefForm } from "../BriefForm";

export const BriefFormSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="brief-form"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-foreground mb-4"
            >
              Давайте познакомимся
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Расскажите нам о задаче — мы соберём бриф и подготовим КП
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="relative rounded-3xl p-6 md:p-12 backdrop-blur-xl
                border border-border/20 shadow-lg bg-card"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan/20 via-purple/20 to-cyan/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
              
              {/* Form Content */}
              <div className="relative z-10">
                <BriefForm />
              </div>
            </div>
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              Или свяжитесь с нами напрямую в{" "}
              <a
                href="https://t.me/neeekn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                Telegram
              </a>
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
