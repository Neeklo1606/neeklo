"use client";

import { memo } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Globe, Bot, Video, Smartphone, LucideIcon, Currency, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { smoothScrollToId } from "@/lib/smoothScroll";

interface Solution {
  id: string;
  title: string;
  price: string;
  duration: string;
  description?: string;
  href: string;
  icon: LucideIcon;
}

const SLUG_ICONS: Record<string, LucideIcon> = {
  website: Globe, "telegram-bot": Bot, "ai-video": Video, "mini-app": Smartphone,
  "miniapp": Smartphone, "ai-agent": Globe, "mobile-app": Smartphone,
};
const defaultSolutions: Solution[] = [
  {
    id: "website",
    title: "Сайт для бизнеса",
    price: "от 120 000 ₽",
    duration: "7–10 дней",
    href: "/products/website",
    icon: Globe,
  },
  {
    id: "bot",
    title: "Telegram-бот",
    price: "от 90 000 ₽",
    duration: "5–7 дней",
    href: "/products/telegram-bot",
    icon: Bot,
  },
  {
    id: "video",
    title: "Видео для продаж",
    price: "от 60 000 ₽",
    duration: "3–5 дней",
    href: "/products/ai-video",
    icon: Video,
  },
  {
    id: "miniapp",
    title: "Mini App",
    price: "от 150 000 ₽",
    duration: "10–14 дней",
    href: "/products/mini-app",
    icon: Smartphone,
  },
];

function buildSolutions(cms?: Array<{ slug: string; title: string; price: string; duration: string; description?: string }>): Solution[] {
  if (!cms?.length) return defaultSolutions;
  return cms.map((s) => {
    const slug = s.slug.replace(/^products\//, "").toLowerCase();
    const Icon = SLUG_ICONS[slug] ?? Globe;
    const href = slug.startsWith("/") ? slug : `/products/${slug}`;
    return {
      id: slug,
      title: s.title,
      price: s.price,
      duration: s.duration,
      description: s.description,
      href,
      icon: Icon,
    };
  });
}

// Solution Card — compact catalog style, equal height
const SolutionCard = memo(function SolutionCard({
  solution,
  index,
  isVisible,
}: {
  solution: Solution;
  index: number;
  isVisible: boolean;
}) {
  const Icon = solution.icon;

  return (
    <div
      className={`io-animate io-slide-left h-full ${isVisible ? "io-visible" : ""}`}
      style={{ transitionDelay: `${100 + index * 100}ms` }}
    >
      <Link
        to={solution.href}
        className={cn(
          "group flex flex-col h-full cursor-pointer overflow-hidden",
          "rounded-xl p-5 md:p-6",
          "bg-zinc-900 border border-zinc-700/50",
          "shadow-md card-hover",
          "min-h-[220px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        )}
      >
        {/* Icon + Title (1 line) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex-shrink-0",
              "bg-cyan-400/10 border border-cyan-400/20",
              "flex items-center justify-center",
              "group-hover:bg-cyan-400/15 transition-colors duration-200"
            )}
          >
            <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-foreground truncate">
            {solution.title}
          </h3>
        </div>

        {/* Price + Срок — flex-1 для выравнивания, больше отступ между строками */}
        <div className="flex flex-col gap-2.5 flex-1 py-4">
          <div className="flex items-center gap-2">
            <Currency className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              {solution.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Срок: {solution.duration}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div
          className={cn(
            "inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg flex-shrink-0",
            "text-sm font-medium",
            "bg-cyan-400/15 border border-cyan-400/40 text-cyan-400",
            "hover:bg-cyan-400/25 transition-all duration-200",
            "min-h-[44px]"
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Обсудить
        </div>
      </Link>
    </div>
  );
});

interface ReadySolutionsProps {
  title?: string;
  subtitle?: string;
  sectionId?: string;
  variant?: "cards" | "faq";
  solutions?: Array<{ slug: string; title: string; price: string; duration: string; description?: string }>;
}

const DEFAULT_FAQ_ANSWER = "Обсудим задачу и сроки — ответим в тот же день. Напишите в Telegram или оставьте заявку ниже.";

export function ReadySolutions({ title, subtitle, sectionId, variant, solutions: solutionsData }: ReadySolutionsProps = {}) {
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();
  const solutions = buildSolutions(solutionsData);
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const isFaq = variant === "faq";

  return (
    <section ref={ref} id={sectionId ?? "products"} className="py-6 sm:py-12 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className={cn(
          "io-animate io-slide-left flex flex-col gap-4 mb-10 md:mb-12",
          isFaq ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
          isVisible && "io-visible"
        )}>
          <div className={isFaq ? "max-w-lg" : ""}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {title ?? "Готовые решения"}
            </h2>
            <p className={cn(
              "text-muted-foreground text-sm md:text-base",
              isFaq ? "max-w-md mx-auto" : "max-w-md"
            )}>
              {subtitle ?? (isFaq ? "Частые запросы: цена и сроки по каждому решению." : "Цена и сроки — сразу. Без скрытых платежей.")}
            </p>
          </div>

          {!isFaq && (
            <Link
              to="/services"
              className={cn(
                "hidden md:inline-flex items-center gap-1.5",
                "text-sm font-medium text-primary",
                "hover:text-primary/90 transition-colors duration-200"
              )}
            >
              Все услуги
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isFaq ? (
          <div className={`io-animate io-fade-in max-w-3xl mx-auto ${isVisible ? "io-visible" : ""}`}>
            <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
              {solutions.map((solution, index) => (
                <AccordionItem
                  key={solution.id}
                  value={`solution-${solution.id}`}
                  className="bg-card border border-border rounded-xl px-4 sm:px-5 data-[state=open]:border-primary/30 shadow-sm"
                >
                  <AccordionTrigger className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 py-4 hover:no-underline [&>svg]:shrink-0">
                    <span className="min-w-0 text-left font-semibold text-foreground text-sm sm:text-base">
                      {solution.title}
                    </span>
                    <span className="text-right text-muted-foreground font-normal text-xs sm:text-sm tabular-nums">
                      — {solution.price}, {solution.duration}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4">
                    <p className="mb-4">
                      {solution.description ?? DEFAULT_FAQ_ANSWER}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={solution.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Подробнее об услуге
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => smoothScrollToId("contact")}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Обсудить проект
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {solutions.map((solution, index) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>

            <div
              className={`io-animate io-slide-left mt-10 md:hidden ${isVisible ? "io-visible" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link
                to="/services"
                className={cn(
                  "flex items-center justify-center gap-2 w-full",
                  "py-3 px-5 rounded-lg min-h-[40px]",
                  "bg-muted border border-border",
                  "text-sm font-medium text-primary",
                  "hover:bg-muted/80 hover:border-primary/30",
                  "transition-all duration-200"
                )}
              >
                Все услуги
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
