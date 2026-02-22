import { memo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid3X3, Play, Send, Menu } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface NavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: "menu" | "telegram";
}

const TABS: NavTab[] = [
  { id: "home", label: "Главная", icon: Home, href: "/" },
  { id: "catalog", label: "Каталог", icon: Grid3X3, href: "/services" },
  { id: "telegram", label: "Telegram", icon: Send, action: "telegram" },
  { id: "menu", label: "Меню", icon: Menu, action: "menu" },
];

interface BottomNavProps {
  onMenuOpen?: () => void;
}

export const BottomNav = memo(function BottomNav({ onMenuOpen }: BottomNavProps) {
  const isMobile = useMobile();
  const location = useLocation();
  const shouldReduceMotion = usePrefersReducedMotion();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/services") return "catalog";
    if (path.startsWith("/work") || path.startsWith("/cases")) return "cases";
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: NavTab) => {
    if (tab.action === "telegram") {
      window.open("https://t.me/neeekn", "_blank");
    } else if (tab.action === "menu" && onMenuOpen) {
      onMenuOpen();
    }
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: shouldReduceMotion ? 0 : 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: shouldReduceMotion ? 0 : 60, opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom"
      >
        {/* Glass container - enhanced blur, softer border */}
        <div className="mx-2.5 mb-2.5 rounded-[22px] bg-background/70 backdrop-blur-3xl border border-white/[0.05] shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-around h-[64px] px-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              const content = (
                <div className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 min-w-[52px]">
                  {/* Active indicator pill - softer */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-1.5 inset-y-1 bg-primary/10 rounded-[14px]"
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 35 
                      }}
                    />
                  )}
                  
                  {/* Icon - smaller */}
                  <Icon 
                    className={`w-[18px] h-[18px] relative z-10 transition-colors duration-150 ${
                      isActive 
                        ? "text-primary/90" 
                        : "text-muted-foreground/45"
                    }`}
                    strokeWidth={isActive ? 1.8 : 1.5}
                  />
                  
                  {/* Label - smaller, lighter */}
                  <span 
                    className={`text-[9px] font-medium tracking-wide relative z-10 transition-colors duration-150 ${
                      isActive 
                        ? "text-primary/80" 
                        : "text-muted-foreground/35"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              );

              if (tab.href) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    className="touch-manipulation active:scale-[0.92] transition-transform duration-100"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="touch-manipulation active:scale-[0.92] transition-transform duration-100"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
});
