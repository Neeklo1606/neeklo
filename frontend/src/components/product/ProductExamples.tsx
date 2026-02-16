"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import casesData from "@/data/cases.json";

interface ProductExamplesProps {
  category: string; // "Web", "AI", "Video", "Bot" etc.
  maxItems?: number;
}

export function ProductExamples({ category, maxItems = 6 }: ProductExamplesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map category to case categories with fuzzy matching
  const categoryMap: Record<string, string[]> = {
    "web": ["web", "website"],
    "ai-video": ["ai-video", "ai", "video"],
    "video": ["video", "ai-video", "ai"],
    "bot": ["tg-bot", "bot", "telegram"],
    "telegram": ["tg-bot", "bot", "telegram"],
    "app": ["app", "mini-app", "miniapp"],
    "design": ["design", "branding"],
    "automation": ["automation", "ai"],
    "ai": ["ai", "ai-video"],
  };

  const searchTerms = categoryMap[category.toLowerCase()] || [category.toLowerCase()];
  
  // Filter cases by category
  const filteredCases = casesData
    .filter((c) => {
      const caseCat = (c.category || "").toLowerCase().replace(/[\s-]/g, "");
      return searchTerms.some(term => 
        caseCat.includes(term.replace(/[\s-]/g, "")) ||
        term.replace(/[\s-]/g, "").includes(caseCat)
      );
    })
    .slice(0, maxItems);

  if (filteredCases.length === 0) {
    // Fallback to featured cases if no category match
    const featuredCases = casesData.filter((c) => c.featured).slice(0, 3);
    if (featuredCases.length === 0) return null;
    
    return (
      <section id="examples" className="py-10 md:py-14">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Примеры работ
            </h2>
            <Link
              to="/work"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Все кейсы
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCases.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="examples" className="py-10 md:py-14">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Примеры работ
          </h2>
          <Link
            to={`/work?cat=${category.toLowerCase()}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Все кейсы
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:hidden scrollbar-hide"
        >
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="flex-shrink-0 w-[80%] snap-start"
            >
              <CaseCard caseItem={caseItem} />
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {filteredCases.slice(0, 3).map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CaseCardProps {
  caseItem: (typeof casesData)[0];
}

function CaseCard({ caseItem }: CaseCardProps) {
  const hasVideo = caseItem.coverVideo && caseItem.coverVideo.length > 0;
  const coverImage = caseItem.coverPoster
    ? (caseItem.coverPoster.startsWith('http') || caseItem.coverPoster.startsWith('/')
        ? caseItem.coverPoster
        : `/cases/${caseItem.coverPoster}`)
    : "/placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-muted/30 border border-border/50",
        "hover:border-primary/30 transition-all duration-300"
      )}
    >
      {/* Cover */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={coverImage}
          alt={caseItem.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
          {caseItem.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {caseItem.category}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {caseItem.year}
          </span>
        </div>

        {/* Metric */}
        {caseItem.metrics && caseItem.metrics[0] && (
          <div className="text-xs text-primary font-medium">
            {caseItem.metrics[0].value} {caseItem.metrics[0].label}
          </div>
        )}

        {/* Link */}
        <Link
          to={`/work/${caseItem.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Открыть
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
