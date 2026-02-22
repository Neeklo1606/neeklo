import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, scrollToElement } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; href: string }>;
  isActive: (href: string) => boolean;
}

export const MobileMenu = ({ isOpen, onClose, navItems, isActive }: MobileMenuProps) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToElement(targetId, 100, 'smooth');
      window.history.pushState(null, '', href);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Drawer - Slide from right */}
          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: shouldReduceMotion ? 0 : '100%' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] z-[101] bg-card border-l border-border/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/20">
              <span className="text-lg font-semibold text-foreground">Меню</span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-5">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={cn(
                        "flex items-center justify-between py-4 px-5 rounded-xl text-base font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className={cn(
                        "w-4 h-4 transition-all",
                        isActive(item.href) ? "opacity-100" : "opacity-0"
                      )} />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* CTA Button at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border/20 bg-card">
              <a href="https://t.me/neeekn" target="_blank" rel="noopener noreferrer" className="block">
                <motion.button
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center gap-2 shadow-lg min-h-[40px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Обсудить проект
                </motion.button>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
