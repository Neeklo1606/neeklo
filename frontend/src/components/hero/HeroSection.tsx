import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SplineBackground } from './SplineBackground';
import { BriefWizard } from './BriefWizard';
import { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  scrollTarget?: string;
}

export function HeroSection({ title, subtitle, ctaText, scrollTarget }: HeroSectionProps = {}) {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const shouldReduceMotion = usePrefersReducedMotion();

  const displayTitle = title ?? "Создание сайтов,\nMini App и AI видео";
  const displaySubtitle = subtitle ?? "Разрабатываем продукты, которые приносят деньги";
  const displayCta = ctaText ?? "Узнать стоимость";

  const handleCtaClick = () => {
    setIsBriefOpen(true);
  };

  const scrollToTarget = () => {
    const id = scrollTarget ?? "cases";
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Fade-out эффект при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Fade out начинается сразу, заканчивается на 50% высоты экрана
      const fadeStart = 0;
      const fadeEnd = windowHeight * 0.5;
      
      if (scrollPosition <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollPosition >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const opacity = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Вызвать сразу для начального состояния
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* 3D Spline Background */}
        <SplineBackground />
        
        {/* Content */}
        <div 
          className="relative z-10 w-full h-screen flex items-start justify-center 
                     px-4 sm:px-6 md:px-10 lg:px-16 text-center pointer-events-none
                     transition-opacity duration-100 ease-out 
                     pt-16 sm:pt-20 md:pt-24 lg:pt-28"
          style={{
            opacity: scrollOpacity,
            transform: `translateY(${(1 - scrollOpacity) * -20}px)`,
            transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
          }}
        >
          
          <div className="flex flex-col items-center justify-start max-w-6xl w-full text-center">
              {/* Подложка только под заголовок и подзаголовок — тусклая, тёмная, малозаметная */}
              <div className="relative w-full max-w-4xl mx-auto">
                <div
                  className="absolute inset-0 -inset-x-3 -inset-y-1
                             bg-black/15 rounded-lg -z-10"
                />
                <motion.h1
                  initial={shouldReduceMotion ? {} : fadeInUp.initial}
                  animate={shouldReduceMotion ? {} : fadeInUp.animate}
                  transition={
                    shouldReduceMotion
                      ? {}
                      : { ...fadeInUp.transition, delay: 0.3 }
                  }
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                             font-extrabold leading-[1.15] tracking-tight text-white
                             drop-shadow-[0_4px_20px_rgba(0,0,0,1)]"
                >
                  {displayTitle.split("\n").map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? {}
                      : { duration: 0.6, delay: 0.5 }
                  }
                  className="text-sm sm:text-base md:text-lg lg:text-xl 
                             text-white font-medium leading-relaxed
                             drop-shadow-[0_4px_16px_rgba(0,0,0,1)]
                             max-w-2xl sm:max-w-3xl mx-auto mt-6 mb-6"
                >
                  {displaySubtitle}
                </motion.p>
              </div>

              {/* Кнопки — без подложки */}
              <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? {}
                      : { duration: 0.6, delay: 0.7 }
                  }
                  className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-4 sm:gap-y-0 lg:gap-x-6 justify-center mt-10
                             pointer-events-auto w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
                >
                  {/* Primary CTA */}
                  <button
                    onClick={handleCtaClick}
                    className="group relative w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-bold
                               text-base sm:text-lg md:text-xl
                               bg-gradient-to-r from-cyan-400 to-cyan-500 text-white
                               shadow-lg shadow-cyan-500/50 
                               hover:shadow-xl hover:shadow-cyan-500/60
                               hover:scale-105 active:scale-95
                               transition-all duration-200 overflow-hidden
                               [text-shadow:_0_1px_2px_rgba(0,0,0,0.3)]
                               focus-visible:outline-none focus-visible:ring-2 
                               focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
                               focus-visible:ring-offset-black"
                    aria-label="Узнать стоимость проекта"
                  >
                    <span
                      className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 
                                 rounded-xl blur opacity-50 group-hover:opacity-75 
                                 transition-opacity duration-300"
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      Узнать стоимость
                      <ArrowRight
                        className="w-5 h-5 group-hover:translate-x-1 
                                 transition-transform duration-200"
                      />
                    </span>
                  </button>

                  {/* Secondary CTA */}
                  <button
                    onClick={scrollToTarget}
                    className="group w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-semibold
                               text-base sm:text-lg md:text-xl
                               bg-black/30 backdrop-blur-md
                               border-2 border-[#404040] text-white
                               hover:border-cyan-400 hover:bg-cyan-400/10
                               transition-all duration-300
                               focus-visible:outline-none focus-visible:ring-2 
                               focus-visible:ring-cyan-400 focus-visible:ring-offset-2 
                               focus-visible:ring-offset-black"
                    aria-label="Смотреть кейсы"
                  >
                    <span
                      className="flex items-center justify-center gap-2 
                                 group-hover:text-cyan-400 transition-colors"
                    >
                      Смотреть кейсы
                      <ArrowRight
                        className="w-5 h-5 group-hover:translate-x-1 
                                 transition-transform duration-200"
                      />
                    </span>
                  </button>
                </motion.div>
          </div>
        </div>
      </section>

      {/* Brief Wizard Modal */}
      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </>
  );
}
