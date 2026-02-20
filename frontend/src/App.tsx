import { useState, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { MainNav } from "@/components/layout/MainNav";
import { CookieConsent } from "@/components/common/CookieConsent";
import { PageLoader } from "@/components/common/PageLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { SuccessScreen } from "@/components/cart/SuccessScreen";
import { usePublicBootstrap } from "@/hooks/usePublicBootstrap";
import AppRoutes from "@/routes";

// Configure Query Client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const DEFAULT_NAV_ITEMS = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Кейсы", href: "/portfolio" },
  { label: "Процесс", href: "/process" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: bootstrap } = usePublicBootstrap();

  const navItems = useMemo(() => {
    const menu = bootstrap?.menus?.mobile ?? bootstrap?.menus?.header;
    const items = menu?.items;
    if (items && Array.isArray(items) && items.length > 0) {
      return (items as Array<{ label: string; url?: string }>)
        .filter((i) => !i.url?.startsWith("#"))
        .map((i) => ({ label: i.label, href: i.url ?? "/" }));
    }
    return DEFAULT_NAV_ITEMS;
  }, [bootstrap]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <CartProvider>
      <MainNav />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <BottomNav onMenuOpen={() => setIsMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
      <CartSidebar />
      <SuccessScreen />
      <CookieConsent />
    </CartProvider>
  );
}

const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Disable first-visit loader in production for better Core Web Vitals/LCP.
    if (import.meta.env.PROD) return false;
    // Only show loader on very first visit (session storage resets on tab close)
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('neeklo_loaded');
      if (hasLoaded) return false;
      sessionStorage.setItem('neeklo_loaded', 'true');
      return true;
    }
    return false;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showLoader && <PageLoader minDisplayTime={400} />}
        <Toaster />
        <Sonner />
        <BrowserRouter basename={typeof window !== "undefined" && window.location.pathname.startsWith("/frontend") ? "/frontend" : undefined}>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
