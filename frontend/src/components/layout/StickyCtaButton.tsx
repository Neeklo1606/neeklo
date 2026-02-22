"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BriefWizard } from "@/components/hero/BriefWizard";

export const StickyCtaButton = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show sticky button after scroll
  useEffect(() => {
    const handleScroll = () => {
      const threshold = isMobile
        ? window.innerHeight * 0.5
        : window.innerHeight;
      setShowSticky(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleClick = () => {
    setIsBriefOpen(true);
  };

  if (shouldReduceMotion) {
    return showSticky ? (
      <>
        <button
          onClick={handleClick}
          className={`fixed z-50 
                     px-6 py-3 md:px-6 md:py-3
                     bg-gradient-to-r from-cyan-400 to-cyan-500 
                     rounded-full md:rounded-xl
                     font-semibold text-sm md:text-base text-black
                     shadow-lg shadow-cyan-500/30
                     hover:shadow-xl hover:shadow-cyan-500/50
                     md:hover:scale-105 transition-all duration-200
                     flex items-center gap-2
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                     ${
                       isMobile
                         ? "bottom-[5.25rem] left-4 right-4 w-auto"
                         : "top-4 right-6"
                     }`}
          aria-label="Узнать стоимость проекта"
        >
          Узнать стоимость
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
      </>
    ) : null;
  }

  return (
    <>
      <AnimatePresence>
        {showSticky && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={handleClick}
            className={`fixed z-50 
                       px-6 py-3 md:px-6 md:py-3
                       bg-gradient-to-r from-cyan-400 to-cyan-500 
                       rounded-full md:rounded-xl
                       font-semibold text-sm md:text-base text-black
                       shadow-lg shadow-cyan-500/30
                       hover:shadow-xl hover:shadow-cyan-500/50
                       md:hover:scale-105 transition-all duration-200
                       flex items-center gap-2
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                       ${
                         isMobile
                           ? "bottom-[5.25rem] left-4 right-4 w-auto"
                           : "top-4 right-6"
                       }`}
            aria-label="Узнать стоимость проекта"
          >
            Узнать стоимость
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </>
  );
};
