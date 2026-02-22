import { memo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Send, Menu } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";

interface NavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: "menu" | "telegram";
}

const TABS: NavTab[] = [
  { id: "home", label: "Главная", icon: Home, href: "/" },
  { id: "catalog", label: "Каталог", icon: LayoutGrid, href: "/services" },
  { id: "telegram", label: "Telegram", icon: Send, action: "telegram" },
  { id: "menu", label: "Меню", icon: Menu, action: "menu" },
];

interface BottomNavProps {
  onMenuOpen?: () => void;
}

export const BottomNav = memo(function BottomNav({ onMenuOpen }: BottomNavProps) {
  const isMobile = useMobile();
  const location = useLocation();

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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom"
      role="navigation"
      aria-label="Нижнее меню"
    >
      {/* Компактный контейнер с backdrop-blur и тенью */}
      <div className="mx-2 mb-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-md">
        <div className="flex items-center justify-around gap-0 p-[14px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            const content = (
              <div className="relative flex flex-col items-center justify-center gap-[6px] min-w-[56px]">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-1 inset-y-0.5 bg-primary/15 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-[22px] h-[22px] transition-colors duration-200 ${
                    isActive
                      ? "text-primary opacity-100 drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                      : "text-foreground/60"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span
                  className={`text-xs font-medium relative z-10 transition-colors duration-200 ${
                    isActive ? "text-primary font-semibold" : "text-foreground/55"
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
                    className="touch-manipulation active:scale-[0.96] transition-transform duration-100"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className="touch-manipulation active:scale-[0.96] transition-transform duration-100"
                >
                  {content}
                </button>
              );
            })}
        </div>
      </div>
    </nav>
  );
});
