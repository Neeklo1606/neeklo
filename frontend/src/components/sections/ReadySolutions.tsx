"use client";

import { memo } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
import { ArrowRight, Globe, Bot, Video, Smartphone, LucideIcon, Currency, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Solution {
  id: string;
  title: string;
  price: string;
  duration: string;
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

function buildSolutions(cms?: Array<{ slug: string; title: string; price: string; duration: string }>): Solution[] {
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
  solutions?: Array<{ slug: string; title: string; price: string; duration: string }>;
}

export function ReadySolutions({ title, subtitle, sectionId, solutions: solutionsData }: ReadySolutionsProps = {}) {
  const isMobile = useMobile();
  const shouldReduceMotion = usePrefersReducedMotion();
  const solutions = buildSolutions(solutionsData);
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id={sectionId ?? "products"} className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className={`io-animate io-slide-left flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12 ${isVisible ? "io-visible" : ""}`}>
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {title ?? "Готовые решения"}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              {subtitle ?? "Цена и сроки — сразу. Без скрытых платежей."}
            </p>
          </div>

          {/* Desktop: All services link */}
          <Link
            to="/services"
            className={cn(
              "hidden md:inline-flex items-center gap-1.5",
              "text-sm font-medium text-cyan-400",
              "hover:text-cyan-300 transition-colors duration-200"
            )}
          >
            Все услуги
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Solutions Grid: 2x2 mobile, 4 cols desktop */}
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

        {/* Mobile: All products link */}
        <div
          className={`io-animate io-slide-left mt-10 md:hidden ${isVisible ? "io-visible" : ""}`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link
            to="/services"
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "py-3 px-5 rounded-lg min-h-[40px]",
              "bg-zinc-800/80 border border-zinc-600/50",
              "text-sm font-medium text-cyan-400",
              "hover:bg-zinc-700/80 hover:border-cyan-400/30",
              "transition-all duration-200"
            )}
          >
            Все услуги
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
