import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { StructuredData } from "@/components/common/StructuredData";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Palette, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Bot, 
  Video, 
  Smartphone, 
  Cog, 
  Send,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { QuickOrderForm } from "@/components/common/QuickOrderForm";
import { useMobile } from "@/hooks/useMobile";

const aboutStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Neeklo Studio",
    "description": "Digital-студия, которая помогает бизнесу запускать сайты, боты и AI-решения быстро и без боли",
    "url": "https://neeklo.ru",
    "logo": "https://neeklo.ru/logo.png",
    "foundingDate": "2021",
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    },
    "knowsAbout": [
      "Веб-разработка",
      "AI-решения",
      "Telegram-боты",
      "AI-видео",
      "Дизайн и брендинг"
    ]
  }
};

const About = () => {
  useMetaTags(
    "О студии | Neeklo Studio — Digital-продукты",
    "Neeklo Studio — делаем сайты, боты и AI-решения быстро и аккуратно. Запуск от 5 дней.",
    "https://neeklo.ru/og-about.jpg",
    "https://neeklo.ru/about",
    "о студии neeklo, digital студия, веб-разработка, дизайн, AI видео"
  );

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const isMobile = useMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSources = [
    "/frontend/videos/neeklo_hello.mp4",
  ];

  // Запуск видео на десктопе (autoplay не всегда срабатывает)
  useEffect(() => {
    if (isMobile) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => { v.play().catch(() => {}); setVideoPlaying(true); };
    v.addEventListener("canplay", onCanPlay);
    const t = setTimeout(() => { v.play().catch(() => {}); }, 400);
    return () => {
      v.removeEventListener("canplay", onCanPlay);
      clearTimeout(t);
    };
  }, [isMobile]);

  const handleVideoPlay = () => {
    const v = videoRef.current;
    if (v) {
      v.play().then(() => setVideoPlaying(true)).catch(() => {});
    }
  };

  // Value cards data
  const valueCards = [
    {
      icon: Zap,
      title: "Скорость",
      description: "Запуск за 5–14 дней"
    },
    {
      icon: Target,
      title: "Фокус на задаче",
      description: "Делаем то, что приносит заявки"
    },
    {
      icon: Palette,
      title: "Дизайн и продукт",
      description: "Визуал + UX под конверсию"
    },
    {
      icon: Sparkles,
      title: "AI-ускорение",
      description: "Нейросети для итераций и контента"
    }
  ];

  // What we do links
  const whatWeDo = [
    { label: "Сайты", href: "/products/website", icon: Globe, desc: "Лендинги и корпоративные сайты" },
    { label: "Telegram-боты", href: "/products/telegram-bot", icon: Bot, desc: "Автоматизация общения с клиентами" },
    { label: "AI-видео / Reels", href: "/products/ai-video", icon: Video, desc: "Видеоконтент с нейросетями" },
    { label: "Mini App", href: "/products/mini-app", icon: Smartphone, desc: "Приложения внутри Telegram" },
    { label: "Автоматизация", href: "/products/automation", icon: Cog, desc: "Интеграции и воронки" },
    { label: "Брендинг", href: "/products/branding", icon: Palette, desc: "Айдентика и стиль" }
  ];

  // How we work steps
  const howWeWork = [
    { step: "1", title: "Понимаем задачу", description: "2–5 минут: вопросы и примеры" },
    { step: "2", title: "Собираем решение", description: "Дизайн, прототип, запуск" },
    { step: "3", title: "Передаём и поддерживаем", description: "Документация и улучшения" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <StructuredData data={aboutStructuredData} />
      
      <main>
        {/* ========== HERO with Video ========== */}
        <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              key={videoSources[videoSourceIndex]}
              src={videoSources[videoSourceIndex]}
              autoPlay={!isMobile}
              muted
              loop
              playsInline
              preload="auto"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onError={() => {
                setVideoSourceIndex((prev) => {
                  const next = prev + 1;
                  return next < videoSources.length ? next : prev;
                });
              }}
              className="w-full h-full object-cover"
            />
            {/* Тёмный оверлей для читаемости текста, без засвета */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 pointer-events-none" />
            {/* Кнопка play на мобильных, когда видео не идёт */}
            {isMobile && !videoPlaying && (
              <button
                type="button"
                onClick={handleVideoPlay}
                className="absolute inset-0 z-[2] flex items-center justify-center"
                aria-label="Запустить видео"
              >
                <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                </span>
              </button>
            )}
          </div>
          
          {/* Hero Content */}
          <Container className="relative z-10 text-center py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              {/* Glass surface for readability */}
              <div className="glass-effect rounded-2xl md:rounded-3xl p-6 md:p-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                  О студии{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    neeklo
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                  Делаем сайты, боты и контент, которые дают результат — быстро и аккуратно.
                </p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 min-h-[48px] rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:bg-primary/80 transition-all hover:scale-105 text-sm md:text-base"
                  >
                    Каталог
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </Container>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5 md:p-2"
            >
              <div className="w-1 h-1.5 md:h-2 rounded-full bg-foreground/40" />
            </motion.div>
          </motion.div>
        </section>

        {/* ========== VALUE CARDS ========== */}
        <section id="values" className="py-12 md:py-20 scroll-mt-24">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {valueCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-effect p-5 md:p-6 rounded-2xl hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========== WHAT WE DO ========== */}
        <section id="what-we-do" className="py-12 md:py-20 bg-muted/20 scroll-mt-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Что делаем
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {whatWeDo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className="group flex items-center gap-3 p-4 md:p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-card/80 transition-all min-h-[60px]"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm md:text-base block">{item.label}</span>
                      <span className="text-xs text-muted-foreground hidden md:block truncate">
                        {item.desc}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========== HOW WE WORK ========== */}
        <section id="how-we-work" className="py-12 md:py-20 scroll-mt-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Как работаем
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {howWeWork.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-effect p-5 md:p-6 rounded-2xl text-center"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg md:text-xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section id="cta" className="py-12 md:py-20 scroll-mt-24 mb-16 md:mb-0">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-6 md:p-10 rounded-2xl md:rounded-3xl text-center border-primary/20"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Готовы начать?
              </h2>
              <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
                Напишите в Telegram — ответим за 15 минут
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
                <motion.a
                  href="https://t.me/neeekn"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 min-h-[48px] rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all text-sm md:text-base"
                >
                  <Send className="mr-2 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  Написать в Telegram
                </motion.a>
                <motion.button
                  onClick={() => setIsOrderFormOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 min-h-[48px] rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 border border-border transition-all text-sm md:text-base"
                >
                  Оставить заявку
                </motion.button>
                <Link
                  to="/contacts"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 min-h-[48px] rounded-full border border-border text-foreground font-medium hover:bg-muted/50 transition-all text-sm md:text-base"
                >
                  Контакты
                  <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
                </Link>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
      
      {/* Quick Order Modal */}
      <QuickOrderForm 
        isOpen={isOrderFormOpen} 
        onClose={() => setIsOrderFormOpen(false)} 
      />
    </div>
  );
};

export default About;
