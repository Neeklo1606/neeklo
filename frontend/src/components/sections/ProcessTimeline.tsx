import { useEffect, useRef, useState } from "react";
import { Search, Palette, Code, Rocket, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const steps: ProcessStep[] = [
  {
    id: 1,
    title: "Диагностика и аудит",
    description: "Проводим быстрый аудит бизнеса, анализируем процессы, цели, проблемы. Формируем стратегию, составляем ТЗ и план работ.",
    icon: Search,
  },
  {
    id: 2,
    title: "Концепция, дизайн и прототипирование",
    description: "Создаём дизайн-концепцию, прототипы будущего продукта, продумываем пользовательские сценарии и визуальную механику.",
    icon: Palette,
  },
  {
    id: 3,
    title: "Разработка и интеграции",
    description: "Реализуем продукт на React / Vue / Laravel. Интегрируем платёжные системы, CRM, AI-модули и API.",
    icon: Code,
  },
  {
    id: 4,
    title: "Тестирование, оптимизация и запуск",
    description: "Проводим финальные проверки, устраняем баги, оптимизируем скорость. Запускаем проект в продакшен.",
    icon: Rocket,
  },
  {
    id: 5,
    title: "Поддержка и масштабирование",
    description: "Обеспечиваем системную поддержку, дорабатываем новые модули, подключаем AI-агентов, запускаем маркетинг и увеличиваем результат.",
    icon: TrendingUp,
  },
];

export const ProcessTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !sectionRef.current) return;

    const section = sectionRef.current;
    const totalSteps = steps.length;

    // Create scroll-triggered animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalSteps * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newStep = Math.min(
            Math.floor(progress * totalSteps),
            totalSteps - 1
          );
          setActiveStep(newStep);
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gradient-to-b from-[#0A0A0F] via-[#090B13] to-background"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-[1400px] mx-auto container-mobile px-5 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-right space-y-6 lg:pr-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-4 lg:ml-auto shadow-glow-primary">
              <ActiveIcon size={36} className="text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                Этап {activeStep + 1}
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {steps[activeStep].title}
              </h2>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[500px] lg:ml-auto">
                {steps[activeStep].description}
              </p>
            </div>
          </div>

          {/* Center Column - Timeline */}
          <div className="hidden lg:flex flex-col items-center justify-center h-[500px] relative">
            {/* Vertical Line */}
            <div className="absolute w-[2px] h-full bg-border/30" />
            
            {/* Progress Line */}
            <div 
              className="absolute top-0 w-[2px] bg-gradient-to-b from-primary via-primary to-transparent transition-all duration-700 ease-out"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            />

            {/* Step Markers */}
            <div className="relative flex flex-col justify-between h-full py-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex items-center justify-center"
                >
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all duration-500
                      ${
                        index <= activeStep
                          ? "bg-primary border-primary shadow-glow-primary scale-110"
                          : "bg-background border-border/50"
                      }
                    `}
                  >
                    {index < activeStep && (
                      <div className="w-full h-full rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-border/20 shadow-2xl">
            {/* Animated Gradient Background */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-transparent transition-opacity duration-700"
              style={{ opacity: (activeStep + 1) / steps.length }}
            />
            
            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/40 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/40 rounded-full blur-[80px] animate-pulse" />
            
            {/* Step Number Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[200px] md:text-[280px] font-bold text-primary/10 select-none">
                {activeStep + 1}
              </div>
            </div>

            {/* Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ActiveIcon size={120} className="text-primary/20" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              h-1 rounded-full transition-all duration-500
              ${index === activeStep ? "w-12 bg-primary" : "w-6 bg-border/50"}
            `}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      {activeStep === 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-muted-foreground text-sm animate-bounce">
          <span>Скролльте вниз</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      )}
    </section>
  );
};
