import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePublicBootstrap } from "@/hooks/usePublicBootstrap";
import { BriefWizard } from "@/components/hero/BriefWizard";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";

const DEFAULT_NAV_ITEMS = [
  { label: "Услуги", href: "/services", sectionId: "products" },
  { label: "Портфолио", href: "/work", sectionId: "cases" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contact" },
];

function menuItemsToNav(items: Array<{ label: string; url?: string; children?: unknown[] }>): Array<{ label: string; href: string; sectionId?: string }> {
  const sectionMap: Record<string, string> = { "/services": "products", "/work": "cases" };
  return items
    .filter((i) => !i.children?.length)
    .map((i) => ({
      label: i.label,
      href: i.url ?? "#",
      sectionId: sectionMap[i.url ?? ""],
    }));
}

export const MainNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const activeSection = useActiveSection();
  const { data: bootstrap } = usePublicBootstrap();

  const navItems = useMemo(() => {
    const header = bootstrap?.menus?.header;
    const items = header?.items;
    if (items && Array.isArray(items) && items.length > 0) {
      return menuItemsToNav(items as Array<{ label: string; url?: string; children?: unknown[] }>);
    }
    return DEFAULT_NAV_ITEMS;
  }, [bootstrap]);

  const burgerMenuItems = useMemo(
    () => navItems.map(({ label, href }) => ({ label, href })),
    [navItems]
  );

  // Watch for dark mode changes (dark mode is default, light mode has 'light-mode' class)
  useEffect(() => {
    const checkDarkMode = () => {
      // Dark mode is default (no class), light mode has 'light-mode' class
      const isLight = document.documentElement.classList.contains('light-mode');
      setIsDarkMode(!isLight);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if nav item is active (by route or by scroll section)
  const isActive = (href: string, sectionId?: string) => {
    // On homepage, use section-based highlighting
    if (location.pathname === '/' && sectionId && activeSection) {
      return sectionId === activeSection;
    }
    // Route-based highlighting
    if (href === '/services') {
      return location.pathname === '/services';
    }
    if (href === '/work') {
      return location.pathname === '/work' || location.pathname.startsWith('/work/');
    }
    if (href === '/about' || href === '/contact') {
      return location.pathname === href;
    }
    return location.pathname === href;
  };

  // Get appropriate logo based on theme (light logo on dark theme, dark logo on light theme)
  const currentLogo = isDarkMode ? logoLight : logoDark;

  return (
    <>
      {/* Fixed Header Container — только desktop (md+), на мобилке навигация внизу */}
      <header 
        className={cn(
          "hidden md:block",
          "fixed left-1/2 -translate-x-1/2 z-[9999]",
          "w-[95%] max-w-7xl",
          "lg:w-[95%] md:w-[97%]",
          "transition-all duration-500 ease-out",
          "top-3 sm:top-4"
        )}
        role="navigation"
        aria-label="Главная навигация"
      >
        {/* Nav Container — низкая высота */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: shouldReduceMotion ? 0 : 0.4, 
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out",
            "bg-black/40 backdrop-blur-2xl",
            "border border-gray-800/50",
            "rounded-lg md:rounded-xl",
            "shadow-2xl shadow-black/50",
            "px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2",
            "min-h-10 md:min-h-11"
          )}
        >
            {/* Logo */}
            <Link 
              to="/" 
              className="relative z-50 flex items-center flex-shrink-0 transition-all duration-500"
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <img
                  src={currentLogo}
                  alt="Neeklo Studio"
                  loading="eager"
                  decoding="async"
                  className="w-auto h-7 md:h-8 transition-all duration-500 ease-out"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center justify-center flex-1 transition-all duration-500">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.href} className="relative">
                    <Link
                      to={item.href}
                      className={cn(
                        "relative text-sm font-medium rounded-full transition-all duration-300 ease-out overflow-hidden",
                        "px-4 py-2",
                        isActive(item.href, item.sectionId) 
                          ? "text-background" 
                          : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                      )}
                    >
                      {/* Animated background pill */}
                      <motion.span
                        className="absolute inset-0 bg-foreground rounded-full"
                        initial={false}
                        animate={{
                          scale: isActive(item.href, item.sectionId) ? 1 : 0,
                          opacity: isActive(item.href, item.sectionId) ? 1 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side */}
            <div className="flex items-center flex-shrink-0 gap-2">
              {/* CTA - Desktop */}
              <motion.button
                onClick={() => setIsBriefOpen(true)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg font-bold transition-all duration-200",
                  "text-sm",
                  "bg-gradient-to-r from-cyan-400 to-cyan-500 text-white",
                  "hover:shadow-lg hover:shadow-cyan-500/30",
                  "px-5 py-3"
                )}
                aria-label="Узнать стоимость проекта"
              >
                <span className="hidden lg:inline">Узнать стоимость</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel - slide from RIGHT */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] z-[101] bg-background border-l border-border/20 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src={currentLogo} alt="Neeklo Studio" loading="lazy" decoding="async" className="h-[60px]" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Закрыть меню"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Nav - using burgerMenuItems for full navigation */}
              <nav className="flex-1 overflow-y-auto py-5">
                <motion.ul 
                  className="space-y-1 px-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.15,
                      }
                    }
                  }}
                >
                  {burgerMenuItems.map((item) => (
                    <motion.li
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, x: -30, filter: "blur(4px)" },
                        visible: { 
                          opacity: 1, 
                          x: 0, 
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }
                        }
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block px-5 py-4 rounded-xl min-h-[48px] flex items-center",
                          "text-base md:text-lg font-medium transition-all duration-200",
                          location.pathname === item.href
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-foreground/5 active:scale-[0.98]"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* CTA */}
              <div className="p-5 border-t border-border/20">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBriefOpen(true);
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl min-h-[48px]",
                    "bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold",
                    "text-base md:text-lg",
                    "transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30"
                  )}
                  aria-label="Узнать стоимость проекта"
                >
                  <span>Узнать стоимость</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
