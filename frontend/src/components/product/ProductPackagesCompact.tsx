"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, Currency, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface ProductPackagesCompactProps {
  packages: Package[];
  telegramLink?: string;
  productTitle: string;
}

export function ProductPackagesCompact({
  packages,
  telegramLink = "https://t.me/neeekn",
  productTitle,
}: ProductPackagesCompactProps) {
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle package
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelectPackage = (pkg: Package) => {
    const message = encodeURIComponent(
      `Здравствуйте! Интересует ${productTitle} — пакет "${pkg.name}" (${pkg.price})`
    );
    window.open(`${telegramLink}?text=${message}`, "_blank");
  };

  return (
    <section id="packages" className="py-10 md:py-14">
      <div className="container max-w-5xl mx-auto container-mobile px-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Выберите пакет
          </h2>
          <p className="text-sm text-muted-foreground">
            Три готовых решения под разный бюджет
          </p>
        </div>

        {/* Package tabs - Mobile */}
        <div className="flex justify-center gap-1 mb-6 md:hidden">
          {packages.map((pkg, index) => (
            <button
              key={pkg.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {pkg.name}
            </button>
          ))}
        </div>

        {/* Mobile: Single card view */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={packages[activeIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PackageCard
                pkg={packages[activeIndex]}
                onSelect={handleSelectPackage}
                isHighlighted={activeIndex === 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={handleSelectPackage}
              isHighlighted={index === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PackageCardProps {
  pkg: Package;
  onSelect: (pkg: Package) => void;
  isHighlighted?: boolean;
}

function PackageCard({ pkg, onSelect, isHighlighted }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex flex-col h-full",
        "p-6 md:p-8 rounded-xl",
        "bg-background border border-border/50",
        "shadow-md hover:shadow-lg transition-all duration-300",
        isHighlighted && "border-primary/30 shadow-lg"
      )}
    >
      {/* Highlighted badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground shadow-md">
            Популярный
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          {pkg.name}
        </h3>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </div>

      {/* Price with icon */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Currency className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {pkg.price}
          </span>
        </div>
      </div>

      {/* Features - simplified tags */}
      <div className="flex-1 mb-6">
        <div className="flex flex-wrap gap-2">
          {pkg.features.slice(0, 6).map((feature, index) => (
            <span
              key={index}
              className={cn(
                "inline-flex items-center gap-1.5",
                "px-2.5 py-1 rounded-lg",
                "text-xs font-medium",
                "bg-muted/50 text-muted-foreground",
                "border border-border/30"
              )}
            >
              <Check className="w-3 h-3 text-primary flex-shrink-0" />
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(pkg)}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2",
          "py-3 px-5 rounded-lg",
          "text-sm font-medium",
          "shadow-sm hover:shadow-md",
          "transition-all duration-200",
          "min-h-[40px]",
          isHighlighted
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        <MessageCircle className="w-4 h-4" />
        Выбрать
      </button>
    </motion.div>
  );
}
