"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Home, Send } from "lucide-react";
import { cn, scrollToElement } from "@/lib/utils";
import { Container } from "@/components/common/Container";

interface ProductHeroCompactProps {
  badge: string;
  title: string;
  subtitle: string;
  priceFrom: string;
  duration: string;
  chips: string[];
  telegramLink?: string;
  onScrollToPackages?: () => void;
}

export function ProductHeroCompact({
  badge,
  title,
  subtitle,
  priceFrom,
  duration,
  chips,
  telegramLink = "https://t.me/neeekn",
  onScrollToPackages,
}: ProductHeroCompactProps) {
  const handleTelegram = () => {
    const message = encodeURIComponent(`Здравствуйте! Интересует ${title}`);
    window.open(`${telegramLink}?text=${message}`, "_blank");
  };

  const handleScrollToExamples = () => {
    scrollToElement("examples", 100, "smooth");
  };

  return (
    <section className="pt-20 pb-8 md:pt-24 lg:pt-28 md:pb-12">
      <Container className="py-3 md:py-4">
        {/* Breadcrumb — в один ряд, ровно при любом адаптиве: [Home /] [Каталог /] [Название] */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center flex-nowrap overflow-hidden min-w-0 gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground leading-tight"
          aria-label="Хлебные крошки"
        >
          <span className="inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link
              to="/"
              className="no-min-touch hover:text-foreground transition-colors inline-flex items-center"
              aria-label="На главную"
            >
              <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            </Link>
            <span className="text-muted-foreground/50 select-none">/</span>
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link to="/products" className="no-min-touch hover:text-foreground transition-colors whitespace-nowrap">
              Каталог
            </Link>
            <span className="text-muted-foreground/50 select-none">/</span>
          </span>
          <span className="min-w-0 overflow-hidden">
            <span className="block truncate text-foreground font-medium">{title}</span>
          </span>
        </motion.nav>
      </Container>
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-4"
        >
          <span
            className={cn(
              "inline-flex items-center px-3 py-1",
              "text-xs font-medium",
              "rounded-full",
              "bg-primary/10 text-primary",
              "border border-primary/20"
            )}
          >
            {badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-base md:text-lg text-muted-foreground mb-5 max-w-xl"
        >
          {subtitle}
        </motion.p>

        {/* Price & Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="text-xl md:text-2xl font-bold text-foreground">
            {priceFrom}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm md:text-base text-muted-foreground">
            {duration}
          </span>
        </motion.div>

        {/* Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {chips.map((chip, index) => (
            <span
              key={index}
              className={cn(
                "px-3 py-1.5",
                "text-sm",
                "rounded-lg",
                "bg-muted/50 text-foreground",
                "border border-border/50"
              )}
            >
              {chip}
            </span>
          ))}
        </motion.div>

        {/* CTAs: слева — Обсудить, справа — всегда в Telegram (та же ссылка, что везде) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3"
        >
          <button
            onClick={onScrollToPackages || handleTelegram}
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "px-5 py-2.5 md:px-6 md:py-3",
              "rounded-xl",
              "bg-primary text-primary-foreground",
              "font-medium text-sm",
              "hover:bg-primary/90 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            Обсудить проект
          </button>

          <a
            href={`${telegramLink}?text=${encodeURIComponent(`Здравствуйте! Интересует ${title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5",
              "px-4 py-2.5 rounded-xl",
              "text-sm font-medium text-muted-foreground",
              "hover:text-foreground hover:bg-muted/50",
              "transition-colors border border-border/50"
            )}
          >
            <Send className="w-4 h-4" />
            В Telegram
          </a>

          <button
            onClick={handleScrollToExamples}
            className={cn(
              "text-sm text-muted-foreground/80 hover:text-foreground",
              "underline underline-offset-2 transition-colors"
            )}
          >
            Примеры
          </button>
        </motion.div>
      </div>
    </section>
  );
}
