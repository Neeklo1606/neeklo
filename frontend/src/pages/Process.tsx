import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageSquare, Lightbulb, Code2, Rocket, HeadphonesIcon, ArrowRight } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Опишите задачу",
    description: "AI-агент проанализирует запрос и предложит стратегию",
    details: ["Бесплатная консультация", "Анализ целей", "Подбор решения"],
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Согласуем концепцию",
    description: "Демо-продукт, прототип, обсуждение деталей и сроков",
    details: ["Прототип за 1-3 дня", "Фиксированная цена", "Прозрачный план"],
  },
  {
    number: "03",
    icon: Code2,
    title: "Разрабатываем",
    description: "Реализация по плану с прогрессом в реальном времени",
    details: ["Еженедельные демо", "Итеративная разработка", "Быстрые правки"],
  },
  {
    number: "04",
    icon: Rocket,
    title: "Запускаем",
    description: "Тестирование, деплой и обучение команды",
    details: ["Полное тестирование", "Документация", "Обучение"],
  },
  {
    number: "05",
    icon: HeadphonesIcon,
    title: "Сопровождаем",
    description: "Техподдержка, доработки и масштабирование",
    details: ["Гарантийный период", "Быстрая поддержка", "Развитие"],
  },
];

interface StepCardProps {
  step: typeof steps[0];
  index: number;
}

const StepCard = ({ step, index }: StepCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
  const numberScale = useTransform(scrollYProgress, [0, 0.6, 1], [0, 1, 1]);
  const numberRotate = useTransform(scrollYProgress, [0, 0.6, 1], [-180, 0, 0]);

  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center"
    >
      <div className={`w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
        {/* Number Section */}
        <motion.div 
          style={{ scale: numberScale, rotate: numberRotate }}
          className="relative flex-shrink-0"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-150" />
            
            {/* Number */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-5xl md:text-7xl font-bold text-primary-foreground">
                {step.number}
              </span>
            </div>
            
            {/* Icon badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg"
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className={`flex-1 text-center ${isEven ? 'md:text-left' : 'md:text-right'}`}>
          <motion.h2
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            {step.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-6 max-w-md mx-auto md:mx-0"
            style={{ marginLeft: isEven ? undefined : 'auto' }}
          >
            {step.description}
          </motion.p>

          {/* Details chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`flex flex-wrap gap-2 justify-center ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
          >
            {step.details.map((detail, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium border border-border/50"
              >
                {detail}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useMetaTags(
    "Процесс работы — Neeklo Studio",
    "Как мы работаем: от описания задачи до запуска и сопровождения. Прозрачный процесс digital-разработки.",
    "https://neeklo.ru/og-process.jpg",
    "https://neeklo.ru/process"
  );

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-8 md:py-12">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                5 шагов к результату
              </motion.span>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Как мы работаем
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Прозрачный процесс от идеи до результата
              </p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex flex-col items-center text-muted-foreground"
              >
                <span className="text-sm mb-2">Листайте вниз</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Steps Timeline */}
        <section className="py-8">
          <Container>
            <div className="relative">
              {/* Progress line - desktop only */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              
              <div className="space-y-0">
                {steps.map((step, index) => (
                  <StepCard key={step.number} step={step} index={index} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-3xl mx-auto text-center"
            >
              {/* Background glow */}
              <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full scale-150 -z-10" />
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-8"
              >
                <Rocket className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Готовы начать?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Опишите задачу — AI-агент проанализирует и предложит оптимальное решение
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-4 sm:px-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:bg-primary/80 transition-all hover:scale-105"
                >
                  Запустить проект
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://t.me/neeekn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border border-border text-foreground font-medium hover:bg-muted active:bg-muted/80 transition-all hover:scale-105"
                >
                  Написать в Telegram
                </a>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Process;
