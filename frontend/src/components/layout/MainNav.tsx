import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePublicBootstrap } from "@/hooks/usePublicBootstrap";
import { useCart } from "@/context/CartContext";
import { BriefWizard } from "@/components/hero/BriefWizard";
import { smoothScrollToId } from "@/lib/smoothScroll";
import logoLight from "@/assets/logo.webp";
import logoDark from "@/assets/logo-dark.webp";

const DEFAULT_NAV_ITEMS = [
  { label: "Услуги", href: "/services", sectionId: "services", hashId: "services" },
  { label: "Кейсы", href: "/work", sectionId: "cases", hashId: "cases" },
  { label: "Блог", href: "/blog", sectionId: "blog", hashId: undefined },
  { label: "Контакты", href: "/contact", sectionId: "contact", hashId: "contact" },
];

type NavItem = { label: string; href: string; sectionId?: string; hashId?: string };

function menuItemsToNav(items: Array<{ label: string; url?: string; children?: unknown[] }>): NavItem[] {
  const urlToHash: Record<string, string> = { "/services": "services", "/work": "cases", "/contact": "contact" };
  const nav = items
    .filter((i) => !i.children?.length)
    .map((i) => {
      const url = i.url ?? "#";
      return {
        label: i.label,
        href: url,
        sectionId: urlToHash[url] ?? (url === "/services" ? "services" : url === "/work" ? "cases" : url === "/blog" ? "blog" : undefined),
        hashId: urlToHash[url],
      };
    });
  const hasBlog = nav.some((i) => i.href === "/blog");
  if (!hasBlog) {
    const blogItem: NavItem = { label: "Блог", href: "/blog", sectionId: "blog", hashId: undefined };
    const insertIndex = Math.min(2, nav.length);
    nav.splice(insertIndex, 0, blogItem);
  }
  return nav;
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
  const { cart, toggleCart } = useCart();
  const isHome = location.pathname === "/";

  const navItems = useMemo(() => {
    const header = bootstrap?.menus?.header;
    const items = header?.items;
    if (items && Array.isArray(items) && items.length > 0) {
      return menuItemsToNav(items as Array<{ label: string; url?: string; children?: unknown[] }>);
    }
    return DEFAULT_NAV_ITEMS;
  }, [bootstrap]);

  // Active: на главной — по видимой секции (scroll-spy), на остальных — по маршруту
  const isActive = (href: string, sectionId?: string) => {
    if (location.pathname === '/' && sectionId && activeSection) return sectionId === activeSection;
    if (href === '/services') return location.pathname === '/services' || location.pathname.startsWith('/services/');
    if (href === '/work') return location.pathname === '/work' || location.pathname.startsWith('/work/') || location.pathname === '/portfolio' || location.pathname.startsWith('/portfolio/');
    if (href === '/contact') return location.pathname === '/contact' || location.pathname === '/contacts';
    if (href === '/blog') return location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    if (href === '/about') return location.pathname === '/about';
    return location.pathname === href;
  };

  // Все пункты ведут на страницы; href всегда маршрут страницы
  const burgerMenuItems = useMemo(
    () => navItems.map((item) => ({
      label: item.label,
      href: item.href,
      active: isActive(item.href, item.sectionId),
      hashId: item.hashId,
    })),
    [navItems, activeSection, location.pathname]
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
            "grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-all duration-500 ease-out",
            "rounded-lg md:rounded-xl",
            "px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2",
            "min-h-10 md:min-h-11",
            "bg-card/95 backdrop-blur-[16px] border border-border shadow-sm text-foreground"
          )}
        >
            {/* Logo — левая колонка */}
            <Link 
              to="/" 
              className="relative z-50 flex items-center justify-start transition-all duration-500 cursor-pointer"
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <img
                  src={logoDark}
                  alt="Neeklo Studio"
                  width={200}
                  height={58}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="w-auto h-9 sm:h-10 md:h-11 transition-all duration-500 ease-out"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation — центр, ровно посередине */}
            <nav className="hidden md:flex items-center justify-center transition-all duration-500">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href, item.sectionId);
                  const className = cn(
                    "relative text-sm font-medium rounded-full transition-all duration-300 ease-out overflow-hidden cursor-pointer",
                    "px-4 py-2",
                    active ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  );
                  const pillClass = "absolute inset-0 rounded-full bg-black";
                  return (
                    <li key={item.href + (item.sectionId ?? "")} className="relative">
                      <Link to={item.href} className={className} aria-current={active ? "page" : undefined}>
                        <motion.span
                          className={pillClass}
                          initial={false}
                          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                        <span className="relative z-10 pointer-events-none">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Side — правая колонка */}
            <div className="flex items-center justify-end gap-2">
              {/* Cart - Desktop */}
              <motion.button
                type="button"
                onClick={toggleCart}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 rounded-full border transition-all duration-200 cursor-pointer",
                  "text-sm font-medium px-4 py-2",
                  "bg-muted border-border text-foreground hover:bg-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                aria-label="Корзина"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Корзина</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-semibold bg-foreground text-primary-foreground"
                  >
                    {cart.length}
                  </span>
                )}
              </motion.button>
              {/* CTA - Desktop */}
              <motion.button
                type="button"
                onClick={() =>
                  isHome
                    ? smoothScrollToId("contact")
                    : setIsBriefOpen(true)
                }
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 rounded-[14px] font-bold transition-all duration-200 text-sm px-5 py-2.5 cursor-pointer",
                  "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[var(--glow-primary)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                aria-label={isHome ? "Начать проект" : "Узнать стоимость проекта"}
              >
                <span className="hidden lg:inline">
                  {isHome ? "Начать проект" : "Узнать стоимость"}
                </span>
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
                  <img
                    src={currentLogo}
                    alt="Neeklo Studio"
                    width={208}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="h-[60px]"
                  />
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
                      key={item.href + item.label}
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
                          "block px-5 py-4 rounded-xl min-h-[48px] flex items-center cursor-pointer",
                          "text-base md:text-lg font-medium transition-all duration-200",
                          item.active ? "bg-black text-white" : "text-foreground hover:bg-foreground/5 active:scale-[0.98]"
                        )}
                        aria-current={item.active ? "page" : undefined}
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
      <BriefWizard isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </>
  );
};
