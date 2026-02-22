"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  priceFrom: string;
  telegramLink?: string;
  productTitle: string;
}

export function StickyCTA({
  priceFrom,
  telegramLink = "https://t.me/neeekn",
  productTitle,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 300px)
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent(`Здравствуйте! Интересует ${productTitle}`);
    window.open(`${telegramLink}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed bottom-20 left-0 right-0 z-40",
            "md:hidden", // Only on mobile
            "px-4 pb-safe"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-3",
              "p-3 rounded-2xl",
              "bg-background/95 backdrop-blur-lg",
              "border border-border/50",
              "shadow-lg"
            )}
          >
            {/* Price */}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-foreground block truncate">
                {priceFrom}
              </span>
              <span className="text-xs text-muted-foreground">
                {productTitle}
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClick}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-4 py-2.5 rounded-xl",
                "bg-primary text-primary-foreground",
                "font-medium text-sm",
                "hover:bg-primary/90 transition-colors",
                "flex-shrink-0"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              Обсудить
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
